from pathlib import Path
import zipfile,json
root=Path('.');dest=Path('public/claude-project.zip')
readme='''# 德國、荷蘭之旅 — Claude 共編

這份壓縮檔包含網頁程式與目前初始行程。使用者在網站新增的記帳、行李、備註，請另搭配網站匯出的最新 JSON。

主要檔案：app/journey-page.tsx（分頁與內容）、app/journey.css（版面）、app/ledger.tsx（記帳）、app/packing.tsx（行李）、lib/plan-v6.json（行程與初始資料）。

網站為 React + TypeScript + Vinext。安裝依賴後執行 npm run dev。若只要修改資料，請保留 schemaVersion 2、planRevision 8、14 個日期及欄位結構，回傳完整 JSON 讓使用者匯入。

購物在 app/shopping.tsx，商品資料在 lib/plan-v6.json 的 giftProducts（每筆含 images、tips）。只分荷蘭與德國，再分超市、藥妝、伴手禮。各地完整故事在 lib/plan-v6.json 的 stories；MEDICA 最新攻略為 public/guides/medica-2026-updated.pdf（使用者提供的 17 頁版本）；主行程連結此 PDF。網站資料備份位於記帳頁底部。

照片位於現有網站 /photos/，本包採絕對網址引用，可直接預覽而不必重新上傳所有照片。photos-manifest.json 列出檔名；要完全離線，可從原網站下載後放入 public/photos/。

請保持每個主題單獨分頁、每日只顯示一天並有前一天／下一天按鈕。照片 object-fit:contain，不能裁切。記帳及行李可增刪並在瀏覽器保存；匯入前先備份。
'''
origin='https://germany-netherlands-nov2026-travel.pox870506.chatgpt.site'
paths=[]
for folder in ['app','lib','components','hooks','public/guides']:
 if Path(folder).exists():paths.extend(p for p in Path(folder).rglob('*') if p.is_file())
for name in ['package.json','pnpm-lock.yaml','tsconfig.json','postcss.config.mjs','components.json','next-env.d.ts']:
 if Path(name).exists():paths.append(Path(name))
with zipfile.ZipFile(dest,'w',zipfile.ZIP_DEFLATED) as z:
 z.writestr('README-CLAUDE.md',readme)
 z.writestr('vite.config.ts',"import {defineConfig} from 'vite';\nimport vinext from 'vinext';\nimport tailwindcss from '@tailwindcss/postcss';\nexport default defineConfig({plugins:[vinext()],css:{postcss:{plugins:[tailwindcss()]}}});\n")
 for path in paths:
  if path.as_posix()=='lib/media-catalog.json':continue
  if path.as_posix() in ['lib/plan-v6.json','lib/photo-meta.json']:
   text=path.read_text(encoding='utf8').replace('"/photos/','"'+origin+'/photos/');z.writestr(path.as_posix(),text)
  else:z.write(path,path.as_posix())
 z.writestr('photos-manifest.json',json.dumps({p.name:origin+'/photos/'+p.name for p in Path('public/photos').glob('fast-*.webp')},ensure_ascii=False,indent=2))
print('Claude source package',dest.stat().st_size,'bytes')
