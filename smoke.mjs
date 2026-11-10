import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR: '+e.message));
p.on('console', m => m.type()==='error' && errs.push('CONSOLE: '+m.text()));
p.on('response', r => { const u=new URL(r.url());
  if(r.status()>=400 && !/favicon\.ico$/.test(u.pathname)) errs.push('HTTP '+r.status()+' '+u.pathname); });
let stepFail = '';
try {
  await p.goto('http://127.0.0.1:8080/');
  await p.waitForTimeout(1500);
  await p.click('#demoBtn', { timeout: 8000 });
  await p.waitForTimeout(2500);
  await p.click('#tgAtmos', { timeout: 8000 });
  await p.waitForTimeout(800);
} catch (e) { stepFail = e.message.split('\n')[0]; }
await b.close();
if (errs.length){ console.error('COLLECTED ERRORS:\n'+errs.join('\n')); process.exit(1); }
if (stepFail){ console.error('STEP FAIL: '+stepFail); process.exit(1); }
console.log('SMOKE OK');
