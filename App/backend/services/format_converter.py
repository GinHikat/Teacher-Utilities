import os
import sys
from pathlib import Path
import anyio

# Ensure modules directory is in sys.path
backend_dir = Path(__file__).resolve().parents[1]  # App/backend
project_root = backend_dir.parent.parent            # Teacher_Utilities
modules_dir = project_root / "modules"

if str(modules_dir) not in sys.path:
    sys.path.append(str(modules_dir))

from format_converter import convert_file

async def convert_file_async(input_path: Path, output_path: Path) -> Path:
    """Run the format conversion in a separate thread to avoid blocking FastAPI."""
    return await anyio.to_thread.run_sync(convert_file, input_path, output_path)
