import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR: '+e.message));
p.on('console', m => m.type()==='error' && errs.push('CONSOLE: '+m.text()));
p.on('response', r => r.status()>=400 && errs.push('HTTP '+r.status()+' '+r.url()));
await p.goto('http://127.0.0.1:8080/');
await p.waitForTimeout(1500);          // boot + idle frames
await p.click('#demoBtn');             // exercises audio graph + routing
await p.waitForTimeout(2500);
await p.click('#tgAtmos');             // exercises height routing rebuild
await p.waitForTimeout(800);
if (errs.length){ console.error(errs.join('\n')); process.exit(1); }
console.log('SMOKE OK'); await b.close();
