<div align="center">

# Teacher Utilities: Format-Preserving Translation & Audio Processing Platform

<p align="center">
  <a href="http://localhost:8000/docs"><img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI Backend"></a>
  <a href="http://localhost:5173"><img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Frontend"></a>
  <a href="https://ffmpeg.org"><img src="https://img.shields.io/badge/Audio-FFmpeg-0078D4?style=for-the-badge&logo=ffmpeg&logoColor=white" alt="FFmpeg Audio"></a>
  <a href="https://github.com/GinHikat/Teacher_Utilities"><img src="https://img.shields.io/badge/Python-3.10%2B-green?style=for-the-badge&logo=python&logoColor=white" alt="Python Version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License"></a>
</p>

**A high-performance utility platform for educators, researchers, and content creators—providing format-preserving document translation, automated audio partitioning, and transcription workflows.**

</div>

---

## 📢 Key Capabilities & Features

- 📄 **Format-Preserving Document Translation**: Translates `.docx` and `.doc` files while maintaining structural layout, paragraph styling, and table formatting using `python-docx` and `deep-translator`.
- 🎙️ **High-Speed Audio Segmentation**: Automatically partitions large lecture and speech recordings into optimized audio chunks using **FFmpeg** and **Pydub** for seamless speech recognition.
- ⚡ **Cross-Platform Self-Healing Architecture**: Built with conditional platform dependency guards (`pywin32; platform_system == 'Windows'`) ensuring zero import crashes when deployed to Linux environments (Vercel / Render).
- 🎨 **Modern Glassmorphic React UI**: Designed with React, Vite, Tailwind CSS, and Framer Motion micro-animations for an intuitive educator workbench.

---

## 💡 System Architecture

```
+--------------------------+     +--------------------------+     +--------------------------+
|  React + Vite Frontend   | --> |   FastAPI REST Service   | --> | Document & Audio Engines |
| (Tailwind & Framer Motion)|     | (Uvicorn ASGI Router)    |     | (python-docx / FFmpeg)   |
+--------------------------+     +--------------------------+     +--------------------------+
```

### Component Breakdown

| Layer | Technology | Role & Capabilities |
| --- | --- | --- |
| **Frontend UI** | React + Vite + Tailwind CSS | Responsive Educator Workbench with glassmorphism aesthetics & real-time progress states |
| **Backend API** | FastAPI (Python 3.10+) | High-throughput asynchronous REST API endpoints with auto-generated Swagger documentation |
| **Translation Engine** | `python-docx` + `deep-translator` | Format-preserving document text parsing & multilingual translation |
| **Audio Processing** | FFmpeg / Pydub | Audio extraction, frequency resampling (16kHz Mono), and chunk splitting |
| **Deployment** | Vercel / Render | Production serverless ASGI deployment configuration via `vercel.json` |

---

## 📂 Repository Structure

```text
Teacher_Utilities/
├── App/                          # Full-Stack Web Application
│   ├── backend/                  # FastAPI Backend API Service
│   │   ├── api/                  # REST endpoints & router configuration
│   │   ├── core/                 # Settings & central configuration
│   │   ├── services/             # Translation & audio transcription services
│   │   ├── main.py               # Application deployment entry point
│   │   └── requirements.txt      # Backend Python dependencies
│   ├── frontend/                 # React (Vite) UI Frontend
│   │   ├── src/                  # Components, pages & styling logic
│   │   └── package.json          # Frontend Node.js dependencies
│   └── vercel.json               # Serverless deployment configuration
├── audio/                        # Local audio processing cache
├── modules/                      # Business logic & helper processing modules
├── secrets/                      # Local environment credential storage
├── requirements.txt              # Project dependencies
└── README.md                     # Project documentation
```

---

## ⚡ Setup & Quick Start

### Prerequisites

* **Python 3.10+**
* **Node.js (v18+) & npm**
* **FFmpeg**: Installed and accessible in your system PATH for audio processing.

---

### 1. Launch Backend API Service

```bash
# Navigate to backend directory
cd App/backend

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI Uvicorn Server
python main.py
```

*The API will be available at `http://localhost:8000` with interactive Swagger docs at `http://localhost:8000/docs`.*

---

### 2. Launch Frontend Workbench UI

```bash
# Open a new terminal and navigate to frontend directory
cd App/frontend

# Install Node.js dependencies
npm install

# Start Vite development server
npm run dev
```

*The application UI will run at `http://localhost:5173`.*

---

## 🔒 Cross-Platform & Deployment Guidelines

To prevent deployment failures on Linux environments (Vercel / Render):

1. **Platform Environment Markers**:
   Restrict Windows-only libraries in `requirements.txt`:
   ```text
   pywin32; platform_system == 'Windows'
   ```

2. **Conditional Win32 Imports**:
   Wrap Windows COM object calls inside `try/except` guards:
   ```python
   try:
       import win32com.client
       HAS_WORD = True
   except ImportError:
       HAS_WORD = False
   ```

---

## 🧪 Automated Testing

Run Pytest suite for backend services:

```bash
cd App/backend
python -m pytest
```

---