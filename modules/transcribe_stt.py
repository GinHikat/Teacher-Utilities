import os
import io
import sys
from google.cloud import speech
from google.oauth2 import service_account
from dotenv import load_dotenv
from pydub import AudioSegment
import math
import subprocess

load_dotenv()
CREDENTIALS_PATH = os.getenv('GOOGLE_API_CREDS')

def transcribe_audio_file(audio_file_path, language_code="vi-VN"):
    """
    Transcribe Vietnamese text using Google Cloud Speech-to-Text.
    Note: For files > 10MB, Google Cloud requires files to be uploaded to GCS (gs://).
    """
    if not CREDENTIALS_PATH:
        print("Error: GOOGLE_API_CREDS environment variable not set in .env")
        return

    if not os.path.exists(CREDENTIALS_PATH):
        print(f"Error: Credentials file not found at {CREDENTIALS_PATH}")
        return

    # Check file size (10MB limit for local files)
    file_size_mb = os.path.getsize(audio_file_path) / (1024 * 1024)
    print(f"File size: {file_size_mb:.2f} MB")
    
    if file_size_mb > 10:
        print("Warning: Local file is larger than 10MB. Google Cloud Speech-to-Text typically requests")
        print("files larger than 10MB to be uploaded to a Google Cloud Storage (GCS) bucket.")
        print("Attempting to send anyway, but this may fail.")

    # Load credentials
    credentials = service_account.Credentials.from_service_account_file(CREDENTIALS_PATH)
    client = speech.SpeechClient(credentials=credentials)

    # Read the audio file
    print(f"Reading file: {audio_file_path}")
    with io.open(audio_file_path, "rb") as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)
    
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.MP3,
        language_code=language_code,
        use_enhanced=True,
        model="default"
    )

    print(f"Sending long-running request for {language_code}...")
    
    try:
        # Using long_running_recognize for better stability and longer content
        operation = client.long_running_recognize(config=config, audio=audio)

        print("Waiting for operation to complete... (this may take a while for large files)")
        response = operation.result(timeout=3600)  # 1 hour timeout

        print("\n--- Transcription Results ---")
        full_transcript = []
        for result in response.results:
            alternative = result.alternatives[0]
            full_transcript.append(alternative.transcript)
            # Print intermediate progress if desired
            # print(alternative.transcript)

        # Output the combined text
        print("\n--- Final Text ---")
        print(" ".join(full_transcript))

    except Exception as e:
        print(f"An error occurred: {e}")

def split_media_by_duration(input_file, chunk_minutes=45):
    chunk_seconds = chunk_minutes * 60

    # Get total duration
    result = subprocess.run([
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        input_file
    ], capture_output=True)

    stdout_text = result.stdout.decode('utf-8', errors='ignore')
    total_duration = float(stdout_text.strip())
    num_chunks = math.ceil(total_duration / chunk_seconds)

    print(f"Total duration: {total_duration/60:.1f} min → {num_chunks} chunks of {chunk_minutes} min")
    
    input_path = Path(input_file) if 'Path' in globals() else type('Path', (), {'__new__': lambda cls, p: __import__('pathlib').Path(p)})(input_file)

    for i in range(num_chunks):
        start = i * chunk_seconds
        output_file = f"output_{input_path.stem}_part_{i+1}{input_path.suffix}"

        subprocess.run([
            "ffmpeg", 
            "-ss", str(start),
            "-t", str(chunk_seconds),
            "-i", input_file,
            "-c", "copy",
            "-y", output_file
        ], capture_output=True)

        size_mb = os.path.getsize(output_file) / (1024 * 1024)
        print(f"  {output_file}: {size_mb:.1f} MB")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python transcribe_stt.py <path_to_mp3_file>")
    else:
        file_path = 'output_part_6.mp3'
        if not os.path.isfile(file_path):
            print(f"Error: File '{file_path}' does not exist.")
        else:
            transcribe_audio_file(file_path)
