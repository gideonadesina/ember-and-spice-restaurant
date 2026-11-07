"""Standard-library checks: balanced HTML, local links, IDs and sized images."""
from html.parser import HTMLParser
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent.parent
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
class Inspector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.errors, self.ids, self.links, self.images = [], [], set(), [], []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag not in VOID: self.stack.append(tag)
        if 'id' in attrs:
            if attrs['id'] in self.ids: self.errors.append('Duplicate ID: '+attrs['id'])
            self.ids.add(attrs['id'])
        if tag == 'img':
            self.images.append(attrs)
            for key in ['alt','width','height','src']:
                if key not in attrs: self.errors.append('Image missing '+key)
        if tag in ['a','link','script','img']:
            value = attrs.get('href') or attrs.get('src')
            if value and not value.startswith(('https:','http:','data:','mailto:','tel:')): self.links.append(value)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID: self.handle_endtag(tag)
    def handle_endtag(self, tag):
        if tag in VOID: return
        if not self.stack or self.stack[-1] != tag: self.errors.append('Mismatched closing tag: '+tag)
        else: self.stack.pop()

reports = {}
for name in ['index.html','about.html','services.html','contact.html']:
    parser = Inspector(); source = (ROOT/name).read_text(encoding='utf-8'); parser.feed(source)
    if parser.stack: parser.errors.append('Unclosed tags: '+str(parser.stack))
    for link in parser.links:
        file, _, fragment = link.partition('#'); file = file.split('?')[0]
        target = ROOT/(file or name)
        if not target.exists(): parser.errors.append('Missing link target: '+link)
        elif fragment:
            other = Inspector(); other.feed(target.read_text(encoding='utf-8'))
            if fragment not in other.ids: parser.errors.append('Missing anchor: '+link)
    reports[name] = {'errors':parser.errors,'images':len(parser.images),'localLinks':len(parser.links)}
sizes = {p.name:p.stat().st_size for p in (ROOT/'assets/images').glob('*.webp')}
assert len(sizes) == 10 and all(size < 300*1024 for size in sizes.values())
result = {'pages':reports,'imageBytes':sizes,'note':'Standard-library structural checks; not a W3C conformance certification.'}
(ROOT/'qa/static-results.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result,indent=2))
assert all(not r['errors'] for r in reports.values())
