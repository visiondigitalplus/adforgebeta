/* ============================================================
   Motor de puntuación · Índice de Confianza
   Fórmula: docs/06 — IC = 0,30 EV + 0,20 ES + 0,20 EO + 0,15 CP + 0,15 EN − penalizaciones
   ============================================================ */

const VD_N = v => { const x = parseFloat(String(v).replace(',','.')); return isNaN(x)?0:x; };
const VD_clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const VD_cap = v => v ? v.charAt(0).toUpperCase()+v.slice(1) : v;

function vdHash(str){
  let h = 2166136261;
  for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h,16777619); }
  return h >>> 0;
}
function vdRng(seed){ let s = seed>>>0; return () => { s = (Math.imul(s,1664525)+1013904223)>>>0; return s/4294967296; }; }
function vdBetween(r,a,b){ return Math.round(a + r()*(b-a)); }

/* --- componentes base --- */
function vdLongevity(d){
  d = VD_N(d);
  if(d < 7) return 10; if(d < 14) return 30; if(d < 30) return 55;
  if(d < 60) return 78; if(d < 90) return 88; return 100;
}
function vdScale(v){
  v = VD_N(v);
  if(v <= 1) return 10; if(v <= 3) return 45; if(v <= 6) return 72;
  if(v <= 10) return 88; return 100;
}
function vdErPct(r){
  const views = VD_N(r.views); if(!views) return 0;
  const inter = VD_N(r.likes)+VD_N(r.comments)+VD_N(r.shares)+VD_N(r.saves);
  return inter/views*100;
}
function vdErScore(er){
  if(er <= 0) return 0;
  if(er < 1) return 10; if(er < 2) return 35; if(er < 4) return 55;
  if(er < 6) return 75; if(er < 10) return 90; return 100;
}
function vdVelocity(r){ return VD_N(r.views)/Math.max(1, VD_N(r.dias)); }
function vdVelScore(v){
  if(v < 1000) return 10; if(v < 10000) return 30; if(v < 100000) return 55;
  if(v < 1000000) return 80; return 100;
}
function vdViralScore(r){
  if(!VD_N(r.views)) return 0;
  return Math.round(0.6*vdErScore(vdErPct(r)) + 0.4*vdVelScore(vdVelocity(r)));
}

/* --- calidad de prueba --- */
function vdProofScore(brief){
  const p = (brief && brief.prueba) || [];
  let v = 0;
  if(p.indexOf('testimonio') > -1) v += 40;
  if(p.indexOf('demo') > -1)       v += 35;
  if(p.indexOf('dato') > -1)       v += 25;
  if(p.indexOf('fotos') > -1)      v += 10;
  return v ? Math.min(100, v) : 25;
}

/* --- encaje declarado (país + categoría + conciencia) --- */
function vdFitScore(brief){
  if(!brief) return 50;
  let v = 0;
  if((brief.pais||'').trim()) v += 40;
  if((brief.subnicho||'').trim() || (brief.mecanismo||'').trim()) v += 30;
  if((brief.avatar||'').trim() && (brief.dolor||'').trim()) v += 30;
  return v;
}

/* --- evidencia real recogida en la investigación --- */
function vdEvidence(exp, angulo, plan, idx){
  const todos = (exp.ads||[]).filter(a => (a.angulo||'').trim().toLowerCase() === String(angulo).toLowerCase());
  const ads = todos.filter(a => a.origen !== 'ia');          // verificados a mano
  const propuestos = todos.filter(a => a.origen === 'ia');    // sugeridos por IA, sin comprobar
  const virales = (exp.viral||[]).filter(v => (v.angulo||'').trim().toLowerCase() === String(angulo).toLowerCase());

  const real = ads.length > 0;
  let EV = 0, ES = 0, EO = 0;

  if(real){
    EV = Math.max.apply(null, ads.map(a => vdLongevity(a.dias)));
    ES = Math.max.apply(null, ads.map(a => vdScale(a.variantes)));
  }
  if(virales.length){
    EO = Math.max.apply(null, virales.map(v => vdViralScore(v)));
  }

  /* lo que no exista se estima de forma determinista y se marca como estimado */
  const r = vdRng(vdHash((exp.id||'x')+'|'+angulo+'|'+idx));
  /* sin evidencia verificada, el IC es conservador: se descuenta 15% */
  const estEV = Math.round(vdBetween(r, plan.ev[0], plan.ev[1]) * 0.85);
  const estES = Math.round(vdBetween(r, plan.es[0], plan.es[1]) * 0.85);
  const estEO = Math.round(vdBetween(r, plan.eo[0], plan.eo[1]) * 0.85);

  const fuentes = [];
  if(real && virales.length) fuentes.push('verificada');
  else if(real || virales.length) fuentes.push('parcial');
  else fuentes.push('estimada');
  /* cuando la IA propuso anuncios, se avisa: hay indicio, no prueba */
  const porIA = propuestos.length > 0;

  return {
    EV: real ? EV : estEV,
    ES: real ? ES : estES,
    EO: virales.length ? EO : estEO,
    fuente: fuentes[0],
    porIA: porIA,
    referencias: ads.length,
    virales: virales.length,
    estimado: {ev: estEV, es: estES, eo: estEO}
  };
}

/* --- cálculo completo de una pieza --- */
function vdCalcIC(exp, plan, idx){
  const ev = vdEvidence(exp, plan.a, plan, idx);
  const brief = exp.brief || {};
  const CP = vdProofScore(brief);
  const EN = vdFitScore(brief);
  const comp = vdCompliance(exp);

  const bruto = 0.30*ev.EV + 0.20*ev.ES + 0.20*ev.EO + 0.15*CP + 0.15*EN;
  const pens = [];
  if(comp.pen) pens.push({m:`Compliance ${comp.nivel.toLowerCase()}`, v:-comp.pen});

  const txtOferta = ((brief.oferta||'')+' '+(brief.promesa||'')+' '+(brief.garantia||'')).toLowerCase();
  if(!/garant/.test(txtOferta)) pens.push({m:'Oferta sin garantía declarada', v:-3});

  /* la evidencia real reduce la incertidumbre: eso vale puntos */
  if(ev.fuente === 'verificada') pens.push({m:'Evidencia verificada del ángulo', v:+5});
  else if(ev.fuente === 'parcial') pens.push({m:'Evidencia parcial del ángulo', v:+2});

  const faltan = vdMissing(brief);
  if(faltan.length) pens.push({m:`${faltan.length} datos ★ faltantes`, v:-Math.min(12, faltan.length*3)});

  const total = pens.reduce((s,p)=>s+p.v, 0);
  const ic = VD_clamp(Math.round(bruto + total), 20, 98);

  return {
    ic, banda: vdBanda(ic),
    sub:{EV:ev.EV, ES:ev.ES, EO:ev.EO, CP, EN},
    pens, bruto: Math.round(bruto*10)/10,
    fuente: ev.fuente, referencias: ev.referencias, virales: ev.virales, porIA: ev.porIA
  };
}

function vdBanda(ic){ return ic>=85?'A':ic>=70?'B':ic>=55?'C':'D'; }

function vdMissing(brief){
  const b = brief || {};
  const miss = [];
  if(!(b.subnicho||'').trim()) miss.push('sub-nicho');
  if(!(b.mecanismo||'').trim()) miss.push('mecanismo propio');
  if(!((b.prueba||[]).length)) miss.push('prueba disponible');
  if(!(b.referencias||'').trim()) miss.push('referencias');
  if(!((b.produccion||[]).length)) miss.push('qué puedes producir');
  return miss;
}

/* --- ranking de anuncios en el panel de investigación --- */
function vdAdScore(a){
  const viral = VD_N(a.viral) || 0;
  const fit = VD_clamp(VD_N(a.fit)||3,1,5)*20;
  return Math.round(0.35*vdLongevity(a.dias) + 0.20*vdScale(a.variantes) + 0.25*viral + 0.20*fit);
}
