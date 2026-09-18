from pathlib import Path
import re,html,json,shutil
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,PageBreak,KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor,white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4

ROOT=Path(__file__).parent
source=ROOT/'medica-guide.md'
raw=source.read_text(encoding='utf8')
for a,b in {'没有':'沒有','常见词意':'常見詞意','银行':'銀行','全區图':'全區圖','原版单館圖':'原版單館圖','檢验':'檢驗','与':'與','属于':'屬於','删掉':'刪掉','票数':'票數'}.items():raw=raw.replace(a,b)
source.write_text(raw,encoding='utf8')
pdfmetrics.registerFont(TTFont('JhengHei','C:/Windows/Fonts/msjh.ttc',subfontIndex=0))
pdfmetrics.registerFont(TTFont('JhengHeiBold','C:/Windows/Fonts/msjhbd.ttc',subfontIndex=0))
pdfmetrics.registerFontFamily('JhengHei',normal='JhengHei',bold='JhengHeiBold',italic='JhengHei',boldItalic='JhengHeiBold')
navy=HexColor('#173e50');teal=HexColor('#126477');gray=HexColor('#445460')
base=dict(fontName='JhengHei',fontSize=10.6,leading=17.2,textColor=HexColor('#243642'),wordWrap='CJK',spaceAfter=9)
styles={
 'p':ParagraphStyle('body',**base),
 'h1':ParagraphStyle('heading',fontName='JhengHeiBold',fontSize=22,leading=30,textColor=navy,spaceAfter=20,keepWithNext=True,wordWrap='CJK'),
 'h2':ParagraphStyle('sub',fontName='JhengHeiBold',fontSize=13.5,leading=20,textColor=teal,spaceBefore=10,spaceAfter=9,keepWithNext=True,wordWrap='CJK'),
 'li':ParagraphStyle('list',**{**base,'leftIndent':12,'firstLineIndent':-10,'spaceAfter':7}),
 'cell':ParagraphStyle('cell',**{**base,'fontSize':9.4,'leading':14.4,'spaceAfter':0}),
 'th':ParagraphStyle('th',**{**base,'fontName':'JhengHeiBold','fontSize':9.2,'leading':14,'textColor':white,'spaceAfter':0}),
 'compact':ParagraphStyle('compact',**{**base,'fontSize':9.2,'leading':12.8,'spaceAfter':0}),
}
def inline(t,web=False):
 t=html.escape(t)
 t=re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)',lambda m:('<a href="'+m[2]+'">'+m[1]+'</a>') if web else ('<a href="'+m[2]+'" color="#126477"><u>'+m[1]+'</u></a>'),t)
 t=re.sub(r'\*\*(.*?)\*\*',r'<b>\1</b>',t)
 return t
def widths(headers,n):
 if n==5:return [39,96,116,88,172]
 if n==4:return [139,104,105,163]
 if n==3:
  if headers[0]=='時間':return [89,173,249]
  if '搜尋' in headers[1]:return [88,156,267]
  return [119,176,216]
 return [139,372]

sections=raw.split('<!-- page -->');flows=[];htmlsections=[]
for ix,section in enumerate(sections):
 if ix:flows.append(PageBreak())
 if ix==0:flows.append(Spacer(1,28))
 lines=section.strip().splitlines();i=0;webparts=[]
 while i<len(lines):
  line=lines[i].strip()
  if not line:i+=1;continue
  if line.startswith('|'):
   table=[]
   while i<len(lines) and lines[i].strip().startswith('|'):
    cells=[x.strip() for x in lines[i].strip().strip('|').split('|')]
    if not all(re.fullmatch(r'[- :]+',x) for x in cells):table.append(cells)
    i+=1
   compact=ix in [5,17]
   ws=widths(table[0],len(table[0]));data=[[Paragraph(inline(c),styles['th' if n==0 else 'compact' if compact else 'cell']) for c in row] for n,row in enumerate(table)]
   t=Table(data,colWidths=ws,repeatRows=1,hAlign='LEFT')
   t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),navy),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('ROWBACKGROUNDS',(0,1),(-1,-1),[HexColor('#f1f6f7'),white]),('LINEBELOW',(0,0),(-1,-1),.35,HexColor('#d6e1e5'))]))
   if compact:t.setStyle(TableStyle([('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4)]))
   flows.extend([t,Spacer(1,13)])
   webparts.append('<div class="table-wrap"><table>'+''.join('<tr>'+''.join(('<th>' if n==0 else '<td>')+inline(c,True)+('</th>' if n==0 else '</td>') for c in row)+'</tr>' for n,row in enumerate(table))+'</table></div>')
   continue
  if line=='---':flows.append(Spacer(1,12));webparts.append('<hr>');i+=1;continue
  if line.startswith('# '):kind='h1';text=line[2:];tag='h1'
  elif line.startswith('## '):kind='h2';text=line[3:];tag='h2'
  elif line.startswith('- '):kind='li';text='• '+line[2:];tag='p'
  elif re.match(r'^\d+\. ',line):kind='li';text=line;tag='p'
  else:kind='p';text=line;tag='p'
  flows.append(Paragraph(inline(text),styles[kind]));webparts.append('<'+tag+'>'+inline(text,True)+'</'+tag+'>');i+=1
 htmlsections.append('<section id="page-'+str(ix+1)+'">'+''.join(webparts)+'</section>')

out=ROOT/'output/pdf';out.mkdir(parents=True,exist_ok=True)
dest=out/'MEDICA-2026-全攻略.pdf'
def decorate(c,doc):
 c.saveState();w,h=A4
 c.setFillColor(teal);c.rect(0,h-8,w,8,fill=1,stroke=0)
 c.setFont('JhengHei',8);c.setFillColor(gray)
 c.drawString(42,h-30,'MEDICA 2026｜杜塞道夫國際醫療展')
 c.drawRightString(w-42,h-30,'長照復健 × 實體醫療設備')
 c.setStrokeColor(HexColor('#d6e1e5'));c.line(42,40,w-42,40)
 c.setFont('JhengHei',8);c.drawString(42,25,'繁體中文參觀手冊・資料查核 2026/09/13')
 c.drawRightString(w-42,25,str(doc.page));c.restoreState()
doc=SimpleDocTemplate(str(dest),pagesize=A4,rightMargin=42,leftMargin=42,topMargin=53,bottomMargin=51,title='MEDICA 2026 參觀全攻略｜長照復健與醫療設備',author='德國、荷蘭之旅',pageCompression=1)
doc.build(flows,onFirstPage=decorate,onLaterPages=decorate)
public=ROOT/'public/guides';public.mkdir(parents=True,exist_ok=True);shutil.copyfile(dest,public/'medica-2026-zh-tw.pdf');shutil.copyfile(source,public/'medica-2026-zh-tw.md')
css='''*{box-sizing:border-box}body{margin:0;background:#edf3f4;color:#243642;font-family:"Microsoft JhengHei",system-ui,sans-serif;font-size:18px;line-height:1.85}header{background:#173e50;color:white;padding:20px max(20px,calc((100% - 940px)/2));}header a{color:white;display:inline-block;margin-right:24px}main{max-width:980px;margin:auto}section{padding:42px;background:white;margin:24px 0;border-radius:12px}h1{font-size:1.75rem;line-height:1.5;color:#173e50}h2{font-size:1.25rem;color:#126477;margin-top:28px}a{color:#126477;text-underline-offset:4px}p{margin:15px 0}.table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:16px;line-height:1.65}th{background:#173e50;color:white}td,th{padding:12px;text-align:left;vertical-align:top;border-bottom:1px solid #d6e1e5;min-width:110px}tr:nth-child(even){background:#f1f6f7}nav a{display:inline-block;padding:6px 12px}button{font:inherit;cursor:pointer}footer{text-align:center;padding:30px}@media(max-width:600px){section{padding:23px;margin:12px 8px}body{font-size:18px}h1{font-size:1.5rem}}@media print{@page{size:A4;margin:16mm}header,nav,footer{display:none}body{background:white;font-size:11pt}main{max-width:none}section{margin:0;padding:0;border-radius:0;break-after:page}section:last-child{break-after:auto}h1,h2{break-after:avoid}tr{break-inside:avoid}.table-wrap{overflow:visible}table{font-size:10pt}td,th{padding:6px;min-width:0}a{color:inherit;text-decoration:none}}'''
web='<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MEDICA 2026 參觀全攻略</title><style>'+css+'</style><header><strong>MEDICA 2026｜參觀全攻略</strong><br><a href="medica-2026-zh-tw.pdf" download>下載 PDF</a><a href="/">回旅遊行程</a><button onclick="window.print()">列印手冊</button></header><main><nav aria-label="手冊目錄">'+''.join('<a href="#page-'+str(n)+'">'+t+'</a>' for n,t in [(3,'展會'),(4,'購票'),(8,'地圖'),(10,'展館'),(14,'動線'),(17,'補給'),(22,'摘要卡片')])+'</nav>'+''.join(htmlsections)+'</main><footer>德國、荷蘭之旅・2026</footer></html>'
(public/'medica-2026-zh-tw.html').write_text(web,encoding='utf8')
print('PDF:',dest,'bytes',dest.stat().st_size,'designed pages',len(sections))
