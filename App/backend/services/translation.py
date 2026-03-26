import os
from pathlib import Path
from docx import Document
from deep_translator import GoogleTranslator
try:
    from pdf2docx import Converter
    HAS_PDF2DOCX = True
except ImportError:
    HAS_PDF2DOCX = False
import time

def convert_pdf_to_docx(pdf_path: Path) -> Path:
    """Convert PDF to .docx using pdf2docx."""
    if not HAS_PDF2DOCX:
        raise ImportError("pdf2docx library is not installed for PDF translation.")
    
    docx_path = pdf_path.with_suffix(".docx")
    cv = Converter(str(pdf_path))
    cv.convert(str(docx_path))
    cv.close()
    return docx_path

def translate_text(text, target_lang="en"):
    """Translate text to target language."""
    if not text or not text.strip():
        return text or ""

    try:
        # print(f"Translating text to: {target_lang}")
        translated = GoogleTranslator(source="auto", target=target_lang).translate(text)
        return translated if translated is not None else text
    except Exception as e:
        print(f"Translation error: {text[:30]}... -> {e}")
        return text



def translate_paragraph(paragraph, target_lang="en"):
    """Translate a single paragraph while preserving formatting."""
    text = paragraph.text.strip()
    if not text:
        return

    translated = translate_text(text, target_lang=target_lang)
    if translated is None:
        translated = text

    if not paragraph.runs:
        paragraph.add_run(translated)
        return

    # Clear existing runs but keep structure
    for run in paragraph.runs:
        run.text = ""

    paragraph.runs[0].text = translated

async def translate_full_document_async(input_path: Path, output_path: Path, target_lang="en", progress_callback=None):
    print(f"Starting full document translation. Target: {target_lang}")
    if not input_path.exists():
        raise FileNotFoundError(f"File not found: {input_path}")


    
    # For .pdf files
    if input_path.suffix.lower() == ".pdf":
        input_path = convert_pdf_to_docx(input_path)

    try:
        doc = Document(str(input_path))
    except Exception as e:
        raise Exception(f"Cannot open document: {e}")

    total_tasks = len(doc.paragraphs)
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                total_tasks += len(cell.paragraphs)

    completed = 0
    
    # Translate body paragraphs
    for paragraph in doc.paragraphs:
        translate_paragraph(paragraph, target_lang=target_lang)
        completed += 1
        if progress_callback:
            await progress_callback(completed, total_tasks)

    # Translate tables
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for paragraph in cell.paragraphs:
                    translate_paragraph(paragraph, target_lang=target_lang)
                    completed += 1
                    if progress_callback:
                        await progress_callback(completed, total_tasks)

    doc.save(str(output_path))
    return output_path
