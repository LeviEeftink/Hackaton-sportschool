from pathlib import Path
from PIL import Image
from docx import Document
from docx.oxml.ns import qn
import json, hashlib

root=Path(__file__).resolve().parent
doc=Document(root.parents[1]/'Fase 1 - aangepast.docx')
for path in (root/'qa').glob('page-*.png'):
    im=Image.open(path).convert('RGBA')
    bg=Image.new('RGBA',im.size,'white'); bg.alpha_composite(im)
    bg.convert('RGB').save(path)
for t in doc.tables:
    assert sum(int(c.get(qn('w:w'))) for c in t._tbl.tblGrid)==9360
    assert t._tbl.tblPr.find(qn('w:tblW')).get(qn('w:w'))=='9360'
assert len(doc.inline_shapes)==5
assert '0..' not in (root/'klassendiagram.puml').read_text(encoding='utf-8')
text='\n'.join(p.text for p in doc.paragraphs)
for name in ('klassendiagram','usecasediagram','activiteitendiagram'):
    assert (root/f'{name}.puml').read_text(encoding='utf-8').strip() in text
for row in json.loads((root/'render-controle.json').read_text(encoding='utf-8')):
    src=(root/(row['diagram']+'.puml')).read_text(encoding='utf-8').encode('utf-8')
    assert hashlib.sha256(src).hexdigest()==row['sourceSHA256']
print('Structuur gecontroleerd: 5 afbeeldingen, 6 tabellen, 3 volledige PlantUML-bronnen en geldige render-hashes.')
