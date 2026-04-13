---
description: Generates an updated static PDF resume using the latest markdown content.
---

This workflow regenerates the `resume.pdf` and `MS_RESUME.pdf` from the latest content files in `backend/app/content/markdown`.

// turbo-all
1. Use the `run_command` tool with `Cwd: "/Users/meftasadat/Documents/bio/backend"` to run this inline python script directly:

```bash
.venv/bin/python3 -c "
import sys
import shutil
from pathlib import Path
from app.services.resume_generator import generate_resume_latex, compile_latex_to_pdf
from app.api.content import get_bio_data

def main():
    bio = get_bio_data()
    sections = {
        'summary': True,
        'experience': True,
        'education': True,
        'talks': True,
        'publications': True,
        'blogs': False,
    }
    
    latex = generate_resume_latex(bio, sections)
    tmp_pdf_path = compile_latex_to_pdf(latex)
    
    target1 = Path('app/static/resume.pdf')
    target2 = Path('app/content/MS_RESUME.pdf')
    
    shutil.copy(tmp_pdf_path, target1)
    shutil.copy(tmp_pdf_path, target2)
    print(f'✅ Resume successfully generated and updated at {target1} and {target2}')

if __name__ == '__main__':
    main()
"
```
