import fs from "node:fs"; import path from "node:path"; import sharp from "sharp";
const SRC="public/gallery/weddings";
const OUT="/private/tmp/claude-501/-Users-nassersangari-Desktop-Website/09853c18-9262-4da5-8fc0-a5e2d0cc8cd0/scratchpad/wed";
fs.rmSync(OUT,{recursive:true,force:true}); fs.mkdirSync(OUT,{recursive:true});
const files=fs.readdirSync(SRC).filter(f=>/\.jpg$/i.test(f)).sort();
const CELL=330, COLS=5, ROWS=4, PER=COLS*ROWS;
const manifest=JSON.parse(fs.readFileSync("public/gallery/manifest.json","utf8"));
const dim=Object.fromEntries(manifest.map(e=>[e.file,e]));
for(let s=0;s*PER<files.length;s++){
  const batch=files.slice(s*PER,(s+1)*PER);
  const rows=Math.ceil(batch.length/COLS);
  const comps=[];
  for(let i=0;i<batch.length;i++){
    const f=batch[i];
    const t=await sharp(path.join(SRC,f)).resize(CELL-6,CELL-6,{fit:"cover"}).toBuffer();
    const x=(i%COLS)*CELL+3, y=Math.floor(i/COLS)*CELL+3;
    comps.push({input:t,left:x,top:y});
    const d=dim["weddings/"+f];
    const orient=d? (d.w>d.h?"LAND":"port") : "?";
    const label=f.replace(".jpg","")+" "+orient;
    comps.push({input:Buffer.from(`<svg width="230" height="26"><rect width="230" height="26" fill="#000"/><text x="6" y="18" font-family="Helvetica" font-size="14" fill="#fff">${label}</text></svg>`),left:x+3,top:y+3});
  }
  await sharp({create:{width:COLS*CELL,height:rows*CELL,channels:3,background:"#fff"}}).composite(comps).jpeg({quality:80}).toFile(`${OUT}/wed-${s+1}.jpg`);
  console.log(`wed-${s+1}.jpg (${batch.length})`);
}
