import sys
from pathlib import Path
import os

# Add the project directories to sys.path
sys.path.append(os.path.abspath('.'))
sys.path.append(os.path.abspath('App/backend'))

from services.transcription import split_media_by_duration

def test_split():
    # Use the file found in D:/
    input_file = Path(r"D:\7. Cô truyền bài 2 GD2 3.4.2026_adbdd36d6609fd0f117518f738133a85.mp3")
    output_dir = Path(r"D:\Study\Education\Projects\Teacher_Utilities\App\backend\outputs\test_split")
    output_dir.mkdir(exist_ok=True, parents=True)
    
    if not input_file.exists():
        print(f"ERROR: Test file {input_file} does not exist.")
        # Try local example if D:/ file is missing
        input_file = Path(r"D:\file_example_MP3_700KB.mp3")
        if not input_file.exists():
             return

    print(f"Testing split with: {input_file}")
    try:
        results = split_media_by_duration(input_file, output_dir, 45)
        print(f"SUCCESS: Generated {len(results)} chunks.")
        for r in results:
            print(f" - {r}")
    except Exception as e:
        print(f"FAILURE: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_split()
