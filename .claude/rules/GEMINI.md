# Instructions for Gemini (Antigravity AI Assistant)

When working on this repository, you must follow these rules before recommending a commit or stating that code is ready for deployment:

Firstly, when generating codes, DO NOT use

- Bulleted list (like 1. 2. 3.)
- Too many redundant comments, no comments like ====== for separation, keep them simple and consistent

Also when coding, save the quota by cleaning the code right after you generate it to ensure the code is readable and simple to interpret and fix

## 🔒 Pre-commit & Deployment Checklist

Before announcing that a task is complete or suggesting a Git commit:

1. **Verify requirements.txt and App/backend/requirements.txt**:

   - Check if any new dependencies were introduced.
   - Do NOT add Windows-only dependencies (like `pywin32`) unconditionally. Always use platform markers:
     ```txt
     pywin32; platform_system == 'Windows'
     ```
2. **Verify cross-platform compatibility of imports**:

   - Check if any Windows-specific imports (`win32com`, `pythoncom`, etc.) are imported at the top-level of any modules.
   - Make all such imports conditional:
     ```python
     try:
         import win32com.client
         HAS_WORD = True
     except ImportError:
         HAS_WORD = False
     ```
   - Guard execution of these specific Windows features using `HAS_WORD`.
3. **Verify the server starts up successfully**:

   - If changes were made to backend routes, libraries, or entry points, verify that the FastAPI server loads without import-time or startup errors.
