// Раскопки до колокола (Руины Древних): a patch of earth and grass where the find glints; the player
// rubs it off (presses and drags, a finger or the mouse), and under it comes up the Old People's plate.
// At `bell` seconds the village bell rings (the scene's bell, and heard) — the digging is over.
// → { cleared: 0..1, how much of the plate is seen; bell: true if the bell ended it }
//   opts: { at: the element it lies at ('glint'), bell: seconds (45) }
import { toll } from '../sound.js';

let styled = null, ctx = null;
// (the site's "sounds" slider: MooodVolume.output — what this page makes goes to the speakers through it)
let sink = null;
const audio = () => { if (!ctx) { ctx = new AudioContext(); sink = MooodVolume.output(ctx); sink.connect(ctx.destination); } if (ctx.state === 'suspended') ctx.resume(); return ctx; };

export default {
  title: 'Раскопки до колокола', // (as the author's ☰ lists it)
  skipped: { cleared: 1, bell: false },
  async run(g, b, { at = 'glint', bell = 45 } = {}, signal) {
    styled ||= b.css('minigames/dig.css');
    await styled;
    if (signal.aborted) return;
    const W = Math.round(Math.min(320, innerWidth * 0.62)), H = Math.round(W * 0.62), dpr = Math.min(2, devicePixelRatio || 1);
    const box = document.createElement('div');
    box.className = 'mg-dig';
    box.style.width = `${W}px`; box.style.height = `${H}px`;
    const plate = document.createElement('canvas'), dirt = document.createElement('canvas');
    for (const c of [plate, dirt]) { c.width = W * dpr; c.height = H * dpr; box.append(c); }
    const place = () => {
      const p = b.where(at) || { x: innerWidth * 0.7, y: innerHeight * 0.8 };
      box.style.left = `${Math.max(8, Math.min(innerWidth - W - 8, p.x - W / 2))}px`;
      box.style.top = `${Math.max(8, Math.min(innerHeight - H - 8, p.y - H * 0.55))}px`;
    };
    place();
    b.layer.prepend(box);

    // the plate: dull metal, a bent corner, letters of the Old People and an arrow
    const P = plate.getContext('2d');
    P.scale(dpr, dpr);
    P.translate(W / 2, H / 2); P.rotate(-0.09);
    const pw = W * 0.6, ph = H * 0.44;
    const grad = P.createLinearGradient(-pw / 2, -ph / 2, pw / 2, ph / 2);
    grad.addColorStop(0, '#a3a69b'); grad.addColorStop(0.5, '#858a80'); grad.addColorStop(1, '#666a62');
    P.shadowColor = 'rgba(30,24,16,0.5)'; P.shadowBlur = 8; P.shadowOffsetY = 3;
    P.fillStyle = grad;
    P.beginPath(); P.moveTo(-pw / 2 + 8, -ph / 2); P.lineTo(pw / 2 - 18, -ph / 2); P.lineTo(pw / 2, -ph / 2 + 16);
    P.lineTo(pw / 2, ph / 2 - 8); P.quadraticCurveTo(pw / 2, ph / 2, pw / 2 - 8, ph / 2); P.lineTo(-pw / 2 + 8, ph / 2);
    P.quadraticCurveTo(-pw / 2, ph / 2, -pw / 2, ph / 2 - 8); P.lineTo(-pw / 2, -ph / 2 + 8); P.quadraticCurveTo(-pw / 2, -ph / 2, -pw / 2 + 8, -ph / 2);
    P.fill();
    P.shadowColor = 'transparent';
    P.strokeStyle = 'rgba(255,240,215,0.3)'; P.lineWidth = 1.2; P.stroke();
    P.fillStyle = 'rgba(128,96,60,0.22)';
    for (let i = 0; i < 22; i++) { P.beginPath(); P.ellipse((Math.random() - 0.5) * pw, (Math.random() - 0.5) * ph, 3 + Math.random() * 10, 2 + Math.random() * 5, Math.random() * 3, 0, 7); P.fill(); }
    P.font = `bold ${Math.round(ph * 0.34)}px Georgia, serif`;
    P.textAlign = 'center'; P.textBaseline = 'middle';
    P.fillStyle = 'rgba(44,48,46,0.7)';
    P.fillText('…АНЦИЯ', -pw * 0.08, -ph * 0.12);
    P.lineWidth = ph * 0.07; P.strokeStyle = 'rgba(44,48,46,0.7)'; P.lineCap = 'round';
    P.beginPath(); P.moveTo(-pw * 0.3, ph * 0.26); P.lineTo(pw * 0.22, ph * 0.26); P.moveTo(pw * 0.12, ph * 0.14); P.lineTo(pw * 0.24, ph * 0.26); P.lineTo(pw * 0.12, ph * 0.38); P.stroke();
    P.fillStyle = 'rgba(133,138,128,0.8)'; // worn
    for (let i = 0; i < 40; i++) { P.beginPath(); P.arc((Math.random() - 0.5) * pw * 0.8, (Math.random() - 0.5) * ph * 0.8, 0.5 + Math.random() * 1.6, 0, 7); P.fill(); }
    const mask = []; // where the plate is: the points that count
    const pd = P.getImageData(0, 0, plate.width, plate.height).data;
    for (let y = 0; y < plate.height; y += 6 * dpr) for (let x = 0; x < plate.width; x += 6 * dpr) if (pd[(y * plate.width + x) * 4 + 3] > 200) mask.push(y * plate.width + x);

    // the earth over it: soft lumps, crumbs on them, grass through them; the metal peeks out at a corner
    const D = dirt.getContext('2d', { willReadFrequently: true });
    D.scale(dpr, dpr);
    const inside = (x, y, k) => ((x - W / 2) / (W * 0.46)) ** 2 + ((y - H / 2) / (H * 0.44)) ** 2 < k;
    for (let i = 0; i < 9; i++) {
      const x = W / 2 + (i ? (Math.random() - 0.5) * W * 0.42 : 0), y = H / 2 + (i ? (Math.random() - 0.5) * H * 0.36 : 0), r = (i ? 0.22 + Math.random() * 0.12 : 0.46) * W;
      const lump = D.createRadialGradient(x, y, 0, x, y, r);
      lump.addColorStop(0, 'rgba(80,64,44,1)'); lump.addColorStop(i ? 0.55 : 0.78, 'rgba(84,68,46,0.97)'); lump.addColorStop(1, 'rgba(84,68,46,0)');
      D.save(); D.translate(x, y); D.scale(1, H / W * 1.1); D.translate(-x, -y);
      D.fillStyle = lump; D.beginPath(); D.arc(x, y, r, 0, 7); D.fill();
      D.restore();
    }
    D.globalCompositeOperation = 'source-atop';
    for (let i = 0; i < 260; i++) {
      D.fillStyle = Math.random() < 0.5 ? 'rgba(52,40,28,0.7)' : 'rgba(126,106,76,0.5)';
      D.beginPath(); D.arc(Math.random() * W, Math.random() * H, 1 + Math.random() * 2.5, 0, 7); D.fill();
    }
    D.globalCompositeOperation = 'source-over';
    D.lineCap = 'round';
    for (let n = 0; n < 70;) {
      const x = Math.random() * W, y = Math.random() * H, h = 8 + Math.random() * 18;
      if (!inside(x, y, 0.75) || y - h < 2) continue;
      D.strokeStyle = ['#6f7d52', '#86915f', '#5c6a45', '#9aa06a'][n++ % 4]; D.lineWidth = 1 + Math.random() * 1.5;
      D.beginPath(); D.moveTo(x, y); D.quadraticCurveTo(x + (Math.random() - 0.5) * 8, y - h / 2, x + (Math.random() - 0.5) * 14, y - h); D.stroke();
    }
    D.globalCompositeOperation = 'destination-out';
    D.fillStyle = 'rgba(0,0,0,0.8)';
    D.beginPath(); D.ellipse(W / 2 + pw * 0.36, H / 2 - ph * 0.3, W * 0.03, H * 0.025, 0, 0, 7); D.fill();
    D.globalCompositeOperation = 'source-over';

    // rubbing: each pass takes some of the earth away; heard as a scratch
    let sound = null;
    const scratch = speed => {
      try {
        if (!sound) {
          const a = audio(), n = a.createBuffer(1, a.sampleRate, a.sampleRate), d = n.getChannelData(0);
          for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
          const s = a.createBufferSource(), f = a.createBiquadFilter(), v = a.createGain();
          s.buffer = n; s.loop = true; f.type = 'bandpass'; f.frequency.value = 1400; f.Q.value = 0.7; v.gain.value = 0;
          s.connect(f).connect(v).connect(sink); s.start();
          sound = { s, v, a };
        }
        const t = sound.a.currentTime;
        sound.v.gain.cancelScheduledValues(t);
        sound.v.gain.setTargetAtTime(Math.min(0.08, speed * 0.004), t, 0.02);
        sound.v.gain.setTargetAtTime(0, t + 0.08, 0.08);
      } catch { /* no sound: still digs */ }
    };
    let last = null;
    const rub = (x, y) => {
      D.globalCompositeOperation = 'destination-out';
      D.globalAlpha = 0.35; D.lineWidth = W * 0.085; D.lineCap = 'round';
      D.beginPath(); D.moveTo(last ? last.x : x, last ? last.y : y + 0.1); D.lineTo(x, y); D.stroke();
      D.globalAlpha = 1; D.globalCompositeOperation = 'source-over';
      scratch(last ? Math.hypot(x - last.x, y - last.y) : 0);
      last = { x, y };
    };
    const local = e => { const r = box.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const down = e => { e.preventDefault(); box.setPointerCapture?.(e.pointerId); last = null; rub(...local(e)); };
    const move = e => { if (box.hasPointerCapture?.(e.pointerId) || e.buttons) rub(...local(e)); };
    const up = () => { last = null; };
    box.addEventListener('pointerdown', down);
    box.addEventListener('pointermove', move);
    box.addEventListener('pointerup', up);
    box.addEventListener('pointercancel', up);
    addEventListener('resize', place);

    const cleared = () => {
      const d = D.getImageData(0, 0, dirt.width, dirt.height).data;
      let seen = 0;
      for (const i of mask) if (d[i * 4 + 3] < 90) seen++;
      return mask.length ? seen / mask.length : 1;
    };
    const t0 = Date.now();
    let rang = false, done = 0;
    try {
      await new Promise(ok => {
        const timer = setInterval(() => {
          if (signal.aborted) return ok();
          done = cleared();
          if (done >= 0.85) { box.classList.add('clean'); clearInterval(timer); setTimeout(ok, 1400); }
          else if (Date.now() - t0 > bell * 1000) {
            rang = true; clearInterval(timer);
            b.set('bell', 1, 3); toll();
            setTimeout(ok, 2500);
          }
        }, 400);
        signal.addEventListener('abort', () => { clearInterval(timer); ok(); });
      });
    } finally {
      removeEventListener('resize', place);
      if (sound) { try { sound.s.stop(); } catch { /* stopped */ } }
      sound = null;
      if (signal.aborted) box.remove();
      else { // the plate stays a while, fading, as it is spoken of
        box.style.pointerEvents = 'none';
        setTimeout(() => box.classList.add('gone'), 3000);
        setTimeout(() => box.remove(), 7000);
      }
    }
    return { cleared: done, bell: rang };
  },
};
