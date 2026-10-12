#!/usr/bin/env python3
"""Build the study tool into one self-contained HTML file.

Usage:
    python scripts/build.py                 # writes dist/index.html
    python scripts/build.py _site/index.html  # writes to a path of your choice
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
CONTENT = SRC / "content"

# Order matters: the q-fix files patch questions defined in the q-s files.
QUESTION_FILES = [
    "q-s1.js", "q-s2.js", "q-s3.js", "q-s4.js", "q-s5.js", "q-s6.js", "q-s7.js",
    "q-fix.js", "q-fix2.js", "q-fix3.js",
]


def read(path: pathlib.Path) -> str:
    return path.read_text(encoding="utf-8")


def build() -> str:
    template = read(SRC / "template.html")
    for marker in ("/*__DATA__*/", "/*__APP__*/"):
        if marker not in template:
            sys.exit(f"Build failed: {marker} is missing from src/template.html")

    data = "const Q=[];\n"
    data += "".join(read(CONTENT / name) + "\n" for name in QUESTION_FILES)
    data += "const CARDS=[];\n" + read(CONTENT / "cards.js") + "\n"
    data += read(CONTENT / "drills.js") + "\n"
    data += read(SRC / "guide.js") + "\n"

    # Insert the app script first, then the data, so neither can collide with the other's marker.
    page = template.replace("/*__APP__*/", read(SRC / "app.js").strip())
    return page.replace("/*__DATA__*/", data)


def main() -> None:
    dest = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "dist" / "index.html"
    page = build()
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(page, encoding="utf-8")
    print(f"Built {dest} ({len(page):,} characters)")


if __name__ == "__main__":
    main()
