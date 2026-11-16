// Checks the calculator's maths by pressing its real keys. Run: node test.js
// It loads the script from index.html with a stand-in for the screen, so no browser or install is needed.
const fs = require('fs'), vm = require('vm'), assert = require('assert');
const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
const code = html.match(/<script>\nconst OPS[\s\S]*?<\/script>/)[0].replace(/<\/?script>/g, '');

// A fake page element: remembers what is written to it, shrugs at everything else
const fake = () => {
  const own = {};
  const p = new Proxy(function () {}, {
    get: (_, k) => k in own ? own[k] : k === Symbol.toPrimitive ? () => NaN : k === 'then' ? undefined : (own[k] = fake()),
    set: (_, k, v) => { own[k] = v; return true; },
    apply: () => fake(),
    construct: () => fake()
  });
  return p;
};
function load(saved = {}) {
  const els = {}, data = new Map(Object.entries(saved).map(([k, v]) => [k, JSON.stringify(v)]));
  const document = fake();
  document.getElementById = id => els[id] ||= fake();
  const ctx = vm.createContext({
    document, navigator: {}, innerWidth: 390, console, setTimeout: () => 0, clearTimeout() {},
    localStorage: { getItem: k => data.has(k) ? data.get(k) : null, setItem: (k, v) => data.set(k, v) },
    lightMode: fake(), themeAttr: () => '', OLD_THEMES: {},
    addEventListener() {}, requestAnimationFrame() {}, getComputedStyle: fake(), ResizeObserver: fake()
  });
  vm.runInContext(code, ctx);
  const KEYS = { '%': 'pct', '=': 'eq', '←': 'back', 'C': 'ac', '±': 'neg' };
  ctx.type = keys => { // 'C' first, then one key per character; names like sin( go in [brackets]
    ctx.press('ac');
    for (const k of keys.match(/\[[^\]]+\]|./gu)) ctx.press(k[0] === '[' && k.length > 1 ? k.slice(1, -1) : KEYS[k] || k);
    return String(els.main.textContent);
  };
  ctx.preview = () => String(els.preview.textContent);
  return ctx;
}

let n = 0;
const check = (calc, keys, want) => { n++; assert.strictEqual(calc.type(keys), want, keys); };
const c = load();

// Order of sums and no floating-point junk
check(c, '2+3×4=', '14');
check(c, '0.1+0.2=', '0.3');
check(c, '1÷3=', '0.333333333333333');
check(c, '5÷0=', 'Error');
check(c, '1000×1000=', '1,000,000');
check(c, '5−8=', '-3');
check(c, '9±+4=', '-5');
check(c, '12←3+1=', '14');

// Percent: stays on screen, b% of a for + and −, before or after the number
check(c, '100−6%=', '94');
check(c, '100−%6=', '94');
check(c, '5−6%=', '4.7');
check(c, '5−%6=', '4.7');
check(c, '1000+10%=', '1,100');
check(c, '422−6%=', '396.68');
check(c, '200×10%=', '20');
check(c, '80÷10%=', '800');
check(c, '50%=', '0.5');
check(c, '100−6%×2=', '99.88');      // more follows, so 6% is plain 0.06
check(c, '100−6%%=', '94');          // a second % is ignored
check(c, '100−6%←=', '94');          // ← deletes just the %, then = sees 100−6
check(c, '100−%+6=', '106');         // an operator after a stray % replaces it
check(c, '100−6%', '100−6%');        // the % stays on screen…
assert.strictEqual(c.preview(), '= 94'); n++;

// Scientific keys
check(c, '30[sin(]=', '0.5');
check(c, '[sin(]30=', '0.5');        // missing ")" is closed
check(c, '180[sin(]=', '0');
check(c, '90[tan(]=', 'Error');
check(c, '2[π]=', '6.28318530717959');
check(c, '2(3+4)=', '14');
check(c, '5[!]=', '120');
check(c, '9[√(]=', '3');
check(c, '2[^]10=', '1,024');
check(c, '8[ʸ√]3=', '2');
check(c, '8[logᵧ]2=', '3');
check(c, '3[²]+4[²]=', '25');

// Very long numbers: 15 digits can be typed, bigger answers go short
check(c, '1234567890123456', '123,456,789,012,345');
check(c, '999999999999999×10=', '9,999,999,999,999,990');
check(c, '999999999999999×100=', '9.99999999999999e16');
check(c, '999999999999999×999999999999999=', '9.99999999999998e29');
check(c, '999999999999999×100=+1=', '9.99999999999999e16'); // the short answer can be used again

// Copy and paste
c.type('100−6%'); assert.strictEqual(c.copyText(), '94'); n++;
c.type('1000+10%='); assert.strictEqual(c.copyText(), '1100'); n++;
c.type('12.'); assert.strictEqual(c.copyText(), '12'); n++;
c.type('5÷0='); assert.strictEqual(c.copyText(), ''); n++;
for (const [text, want] of [['1,234.50', '1234.5'], ['RM 99', '99'], [' $5 ', '5'], ['−3', '-3'], ['-RM12.30', '-12.3'], ['.5', '0.5'],
  ['1e3', '1000'], ['hello', ''], ['', ''], ['1.2.3', ''], ['12abc', ''], ['<b>1</b>', ''], ['1e999', ''], ['9'.repeat(80), '1e60']]) {
  assert.strictEqual(c.parseNum(text), want, 'paste ' + text); n++;
}
c.type('7+'); c.pasteNum('1,000'); assert.strictEqual(c.copyText(), '1007'); n++;

// Every scientific key has a spoken name for screen readers
for (const [k1, , k2] of vm.runInContext('SCI', c)) for (const k of [k1, k2]) {
  if (k && k !== 'rad') { assert.ok(vm.runInContext('SAY', c)[k], 'no spoken name for ' + k); n++; }
}

// Decimal Places setting
const d = load({ 'calc-settings': { dp: '2' } });
check(d, '10÷4=', '2.50');
check(d, '2÷3=', '0.67');
check(d, '0−0.001=', '0.00');
check(d, '999999999999999×100=', '9.99999999999999e16');

// The version must be the same in sw.js, Settings and the top of CHANGELOG.md
const ver = fs.readFileSync(__dirname + '/sw.js', 'utf8').match(/calc-(\d+\.\d+\.\d+)/)[1];
assert.ok(html.includes(`Version <span class="val">${ver}</span>`), 'Settings version line is not ' + ver); n++;
assert.strictEqual(fs.readFileSync(__dirname + '/CHANGELOG.md', 'utf8').match(/^## (\S+)/m)[1], ver, 'CHANGELOG top section'); n++;

console.log(`All ${n} checks passed (version ${ver})`);
