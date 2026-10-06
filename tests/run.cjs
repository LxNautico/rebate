const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
if(new Set(ids).size!==ids.length)throw Error('Duplicate HTML IDs');
for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){const file=m[1].split('?')[0];if(!/^(https?:|#|data:)/.test(file)&&!fs.existsSync(path.join(root,file)))throw Error('Missing asset '+file);}
const scripts=fs.readdirSync(root).filter(f=>f.endsWith('.js'));
for(const file of scripts){const source=fs.readFileSync(path.join(root,file),'utf8');for(const match of source.matchAll(/getElementById\('([^']+)'\)/g))if(!ids.includes(match[1]))throw Error('Missing HTML ID '+match[1]+' in '+file);const check=spawnSync(process.execPath,['--check',path.join(root,file)],{encoding:'utf8'});if(check.status!==0){process.stderr.write(check.stderr);process.exit(1);}}
console.log('PASS: script syntax, HTML IDs and linked local assets.');
let passed=0;for(const file of fs.readdirSync(__dirname).filter(f=>f.endsWith('.cjs')&&f!=='run.cjs').sort()){const result=spawnSync(process.execPath,[path.join(__dirname,file)],{encoding:'utf8'});if(result.status!==0){process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');console.error('FAIL: '+file);process.exit(1);}console.log('PASS: '+file);passed++;}
console.log('All '+passed+' test suites passed.');
