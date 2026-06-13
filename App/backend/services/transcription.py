import os
import io
import math
import subprocess
from pathlib import Path

def split_media_by_duration(input_file: Path, output_dir: Path, chunk_minutes=45, progress_callback=None):
    """Split media file into chunks by duration."""
    chunk_seconds = chunk_minutes * 60

    # Get total duration using a temporary file to avoid subprocess pipe decoding crashes on Windows
    import tempfile
    import json

    with tempfile.NamedTemporaryFile(delete=False) as tf:
        temp_name = tf.name

    try:
        # We use JSON format for ffprobe as it's more reliable to parse
        subprocess.run([
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "json",
            str(input_file)
        ], stdout=open(temp_name, 'w'), stderr=subprocess.DEVNULL, check=True)
        
        with open(temp_name, 'r') as f:
            data = json.load(f)
            total_duration = float(data['format']['duration'])
    except Exception as e:
        raise Exception(f"FFprobe duration parsing failed: {str(e)}")
    finally:
        if os.path.exists(temp_name):
            os.remove(temp_name)

    num_chunks = math.ceil(total_duration / chunk_seconds)

    orig_ext = input_file.suffix.lower()
    # We can safely use stream copy for these formats, which is near instant
    can_copy = orig_ext in ['.mp3', '.m4a', '.wav', '.flac']
    out_ext = orig_ext if can_copy else '.mp3'

    import concurrent.futures

    def process_chunk(i):
        start = i * chunk_seconds
        output_file_name = f"{input_file.stem}_part_{i+1}{out_ext}"
        output_file_path = output_dir / output_file_name

        # Fast seeking: Place -ss and -t BEFORE -i for near-instant extraction of large files
        ffmpeg_cmd = [
            "ffmpeg", 
            "-ss", str(start),
            "-t", str(chunk_seconds),
            "-i", str(input_file)
        ]
        
        if can_copy:
            ffmpeg_cmd.extend(["-map", "0:a:0", "-c", "copy"])
        else:
            ffmpeg_cmd.extend(["-map", "0:a:0", "-acodec", "libmp3lame", "-b:a", "128k"])
            
        ffmpeg_cmd.extend(["-y", str(output_file_path)])

        subprocess.run(ffmpeg_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return output_file_path if output_file_path.exists() else None

    output_files = []
    
    # Use ThreadPoolExecutor to run ffmpeg processes in parallel
    max_workers = min(num_chunks, os.cpu_count() or 4)
    completed_count = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures_map = {executor.submit(process_chunk, i): i for i in range(num_chunks)}
        for future in concurrent.futures.as_completed(futures_map):
            chunk_index = futures_map[future]
            res = future.result()
            if res:
                output_files.append(res)
            completed_count += 1
            if progress_callback:
                progress_callback(completed_count, num_chunks, f"✓ Chunk {chunk_index + 1} finished ({completed_count}/{num_chunks}).")
                
    # Sort files to ensure they are returned in the correct part order
    output_files.sort(key=lambda x: x.name)
            
    if not output_files:
         raise Exception("Process failed: No chunks generated. Confirm FFMPEG is installed and file is valid.")

    return output_files
