"""
LaTeX resume generator.
Builds a LaTeX document from portfolio data with selectable sections,
compiles it to PDF, and returns the path to the generated file.
"""
import subprocess
import tempfile
from datetime import date as date_type, datetime
from pathlib import Path
from typing import List, Optional

from ..models.portfolio import Bio
from ..models.blog import BlogPost


def _escape_latex(text: str) -> str:
    """Escape special LaTeX characters."""
    if not text:
        return ""
    replacements = [
        ("\\", r"\textbackslash{}"),
        ("&", r"\&"),
        ("%", r"\%"),
        ("$", r"\$"),
        ("#", r"\#"),
        ("_", r"\_"),
        ("{", r"\{"),
        ("}", r"\}"),
        ("~", r"\textasciitilde{}"),
        ("^", r"\textasciicircum{}"),
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    return text


def _format_date(d: Optional[date_type]) -> str:
    """Format a date as 'Mon YYYY'."""
    if d is None:
        return "Present"
    return d.strftime("%b %Y")


def _strip_markdown_bullet(line: str) -> str:
    """Strip leading '- ' from markdown bullet lines."""
    stripped = line.strip()
    if stripped.startswith("- "):
        return stripped[2:]
    return stripped


def generate_resume_latex(
    bio: Bio,
    sections: dict,
    experience_ids: Optional[List[str]] = None,
    blog_posts: Optional[List[BlogPost]] = None,
) -> str:
    """Generate a LaTeX document string from portfolio data.

    Args:
        bio: The full Bio data object.
        sections: Dict of section_key -> bool indicating which sections to include.
        experience_ids: Optional list of experience IDs to include.
                        If None, all experiences are included.
        blog_posts: Optional list of blog posts to include.
    """
    lines: list[str] = []
    now = datetime.now()

    # Preamble — use Helvetica Neue (macOS) via fontspec + XeLaTeX fallback,
    # but compile with pdflatex using helvet (Helvetica clone) for portability.
    lines.append(r"\documentclass[11pt,letterpaper]{article}")
    lines.append(r"\usepackage[margin=0.6in]{geometry}")
    lines.append(r"\usepackage{enumitem}")
    lines.append(r"\usepackage{titlesec}")
    lines.append(r"\usepackage[dvipsnames]{xcolor}")
    lines.append(r"\usepackage{hyperref}")
    lines.append(r"\usepackage{parskip}")
    lines.append(r"\usepackage[T1]{fontenc}")
    # Use Helvetica (closest to macOS San Francisco / Helvetica Neue available in pdflatex)
    lines.append(r"\usepackage[scaled=0.92]{helvet}")
    lines.append(r"\renewcommand{\familydefault}{\sfdefault}")
    lines.append(r"\usepackage{fancyhdr}")
    lines.append(r"\usepackage{lastpage}")
    lines.append("")
    # Black & grey color scheme
    lines.append(r"\definecolor{heading}{HTML}{111111}")
    lines.append(r"\definecolor{sectioncolor}{HTML}{333333}")
    lines.append(r"\definecolor{subheading}{HTML}{333333}")
    lines.append(r"\definecolor{bodytext}{HTML}{444444}")
    lines.append(r"\definecolor{lightgrey}{HTML}{888888}")
    lines.append(r"\definecolor{rulecolor}{HTML}{CCCCCC}")
    lines.append(r"\definecolor{linkcolor}{HTML}{333333}")
    lines.append("")
    # Section formatting — black/grey
    lines.append(r"\titleformat{\section}{\Large\bfseries\color{sectioncolor}}{}{0em}{}[\color{rulecolor}\titlerule]")
    lines.append(r"\titlespacing*{\section}{0pt}{12pt}{6pt}")
    lines.append("")
    # Hyperref setup — dark links
    lines.append(r"\hypersetup{colorlinks=true,linkcolor=linkcolor,urlcolor=linkcolor}")
    lines.append("")
    # Footer with download timestamp
    lines.append(r"\pagestyle{fancy}")
    lines.append(r"\fancyhf{}")
    lines.append(r"\renewcommand{\headrulewidth}{0pt}")
    timestamp = now.strftime("%B %d, %Y at %I:%M %p")
    lines.append(rf"\fancyfoot[L]{{\tiny\color{{lightgrey}} Generated on {timestamp}}}")
    lines.append(r"\fancyfoot[R]{\tiny\color{lightgrey} \thepage\ of \pageref{LastPage}}")
    lines.append("")
    # Custom commands
    lines.append(r"\newcommand{\expentry}[4]{%")
    lines.append(r"  \noindent\textbf{\color{subheading}#1} --- {\color{lightgrey}#2} \hfill {\color{lightgrey}\small #3}\\")
    lines.append(r"  {\small\color{lightgrey}#4}")
    lines.append(r"}")
    lines.append("")

    # Document start
    lines.append(r"\begin{document}")
    lines.append("")

    # Header
    name = _escape_latex(bio.name)
    title = _escape_latex(bio.title)
    lines.append(r"\begin{center}")
    lines.append(rf"  {{\LARGE\bfseries\color{{heading}} {name}}}\\[4pt]")
    lines.append(rf"  {{\color{{subheading}} {title}}}\\[6pt]")
    lines.append(
        r"  {\small\color{lightgrey} "
        r"\href{mailto:meftasadat@gmail.com}{meftasadat@gmail.com}"
        r" $\cdot$ "
        r"\href{https://meftasadat.xyz}{meftasadat.xyz}"
        r" $\cdot$ "
        r"\href{https://linkedin.com/in/meftasadat}{linkedin.com/in/meftasadat}"
        r" $\cdot$ "
        r"\href{https://github.com/meftasadat}{github.com/meftasadat}"
        r"}"
    )
    lines.append(r"\end{center}")
    lines.append(r"\vspace{-4pt}")
    lines.append("")

    # Summary
    if sections.get("summary"):
        lines.append(r"\section*{Summary}")
        lines.append(rf"{{\color{{bodytext}} {_escape_latex(bio.summary)}}}")
        lines.append("")

    # Experience
    if sections.get("experience"):
        experiences = bio.experience
        if experience_ids is not None:
            experiences = [e for e in experiences if e.id in experience_ids]

        if experiences:
            lines.append(r"\section*{Experience}")
            for exp in experiences:
                position = _escape_latex(exp.position)
                company = _escape_latex(exp.company)
                date_range = f"{_format_date(exp.start_date)} -- {_format_date(exp.end_date)}"
                location = _escape_latex(exp.location or "")

                lines.append(rf"\expentry{{{position}}}{{{company}}}{{{date_range}}}{{{location}}}")
                lines.append("")

                # Parse description bullets
                desc = exp.description or ""
                bullet_lines = [
                    l.strip() for l in desc.strip().split("\n") if l.strip()
                ]
                if bullet_lines:
                    lines.append(r"\begin{itemize}[leftmargin=1.2em,itemsep=2pt,parsep=0pt,topsep=4pt]")
                    for bl in bullet_lines:
                        clean = _escape_latex(_strip_markdown_bullet(bl))
                        lines.append(rf"  \item {{\color{{bodytext}} {clean}}}")
                    lines.append(r"\end{itemize}")
                lines.append(r"\vspace{4pt}")
                lines.append("")

    # Education
    if sections.get("education") and bio.education:
        lines.append(r"\section*{Education}")
        for edu in bio.education:
            degree = _escape_latex(edu.degree)
            field = _escape_latex(edu.field_of_study)
            institution = _escape_latex(edu.institution)
            date_range = f"{_format_date(edu.start_date)} -- {_format_date(edu.end_date)}"
            lines.append(
                rf"\noindent\textbf{{\color{{subheading}}{degree} in {field}}} --- "
                rf"{{\color{{lightgrey}}{institution}}} "
                rf"\hfill {{\color{{lightgrey}}\small {date_range}}}"
            )
            lines.append("")

    # Talks — with clickable links
    if sections.get("talks") and bio.talks:
        lines.append(r"\section*{Talks \& Presentations}")
        for talk in bio.talks:
            talk_title = _escape_latex(talk.title)
            event = _escape_latex(talk.event)
            location = _escape_latex(talk.location or "")
            date_str = _format_date(talk.date)

            # Make title a hyperlink if link is available
            if talk.link:
                title_str = rf"\href{{{talk.link}}}{{\textbf{{\color{{subheading}}{talk_title}}}}}"
            else:
                title_str = rf"\textbf{{\color{{subheading}}{talk_title}}}"

            lines.append(
                rf"\noindent{title_str} \hfill {{\color{{lightgrey}}\small {date_str}}}\\"
            )
            meta = event
            if location:
                meta += f" $\\cdot$ {location}"
            lines.append(rf"{{\small\color{{lightgrey}} {meta}}}")
            lines.append(r"\vspace{4pt}")
            lines.append("")

    # Publications
    if sections.get("publications") and bio.publications:
        lines.append(r"\section*{Publications}")
        for pub in bio.publications:
            pub_title = _escape_latex(pub.title)
            venue = _escape_latex(pub.venue)
            date_str = _format_date(pub.date)
            authors = _escape_latex(", ".join(pub.authors)) if pub.authors else ""

            # Make title a hyperlink if URL is available
            if pub.url:
                title_str = rf"\href{{{pub.url}}}{{\textbf{{\color{{subheading}}{pub_title}}}}}"
            else:
                title_str = rf"\textbf{{\color{{subheading}}{pub_title}}}"

            lines.append(rf"\noindent{title_str}\\")
            lines.append(rf"{{\small\color{{lightgrey}} {authors} --- \emph{{{venue}}}, {date_str}}}")
            lines.append(r"\vspace{4pt}")
            lines.append("")

    # Blog posts — with clickable links
    if sections.get("blogs") and blog_posts:
        lines.append(r"\section*{Blog Posts}")
        for post in blog_posts:
            post_title = _escape_latex(post.title)
            date_str = post.published_at.strftime("%b %Y")
            url = post.medium_url

            title_str = rf"\href{{{url}}}{{\textbf{{\color{{subheading}}{post_title}}}}}"
            lines.append(
                rf"\noindent{title_str} \hfill {{\color{{lightgrey}}\small {date_str}}}\\"
            )
            if post.excerpt:
                excerpt = _escape_latex(post.excerpt[:150])
                lines.append(rf"{{\small\color{{bodytext}} {excerpt}}}")
            lines.append(r"\vspace{4pt}")
            lines.append("")

    lines.append(r"\end{document}")
    return "\n".join(lines)


def compile_latex_to_pdf(latex_source: str) -> Path:
    """Compile a LaTeX source string to PDF. Returns the path to the PDF file.

    Raises RuntimeError if compilation fails.
    """
    tmp_dir = tempfile.mkdtemp(prefix="resume_")
    tex_path = Path(tmp_dir) / "resume.tex"
    tex_path.write_text(latex_source, encoding="utf-8")

    # Run pdflatex twice to resolve references (page numbers, lastpage)
    for _ in range(2):
        result = subprocess.run(
            [
                "pdflatex",
                "-interaction=nonstopmode",
                "-output-directory",
                tmp_dir,
                str(tex_path),
            ],
            capture_output=True,
            text=True,
            timeout=30,
        )

    pdf_path = Path(tmp_dir) / "resume.pdf"
    if not pdf_path.exists():
        raise RuntimeError(
            f"LaTeX compilation failed.\nSTDOUT:\n{result.stdout[-2000:]}\nSTDERR:\n{result.stderr[-1000:]}"
        )

    return pdf_path
