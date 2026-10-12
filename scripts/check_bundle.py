"""Reject JavaScript syntax errors in the actual assembled page before deployment."""
from pathlib import Path
import re, subprocess, sys

root=Path(__file__).resolve().parent.parent
path=Path(sys.argv[1]) if len(sys.argv)>1 else root/'dist/index.html'
scripts=re.findall(r'<script>(.*?)</script>',path.read_text(encoding='utf8'),re.S)
if not scripts:
    raise SystemExit('No application script found in the built page')
for script in scripts:
    result=subprocess.run(['node','--check','-'],input=script,encoding='utf8',capture_output=True)
    if result.returncode:
        print(result.stderr)
        raise SystemExit(result.returncode)
print(f'Built page syntax passed: {len(scripts)} script')
