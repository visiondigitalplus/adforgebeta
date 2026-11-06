/* ============================================================
   Generador del lote: 7 (o 14) piezas rankeadas por IC.
   Combina el diccionario (content.js) con la evidencia real (ic.js).
   ============================================================ */

function vdBuildPieces(c, n){
  const total = n || 7;
  const plan = VD_PLAN.slice(0, total);
  const t = vdTokens(c);
  const ctas = VD_CTAS[c.brief.objetivo] || VD_CTAS['Ventas'];
  const comp = vdCompliance(c);

  const piezas = plan.map((p, i) => {
    const calc = vdCalcIC(c, p, i);
    const g1 = VD_ARQ[p.q1](t);
    const g2 = VD_ARQ[p.q2](t);
    const g3 = VD_ARQ[p.q1 === 'directo' ? 'espejo' : 'directo'](t);

    const piezaTmp = { ganchos: [g1, g2, g3] };
    return {
      n: i + 1,
      angulo: p.a, formato: p.f, conciencia: p.c, tier: p.tier,
      ganchos: [g1, g2, g3],
      copy: `${g1} ${VD_cap(t.meca)}. ${VD_cap(t.promesa)}.`,
      guion: vdGuion(p.f, t, ctas),
      guionCompleto: vdGuionCompleto(p.f, t, ctas, piezaTmp),
      ctas: [ctas[0], ctas[1]],
      prueba: (c.brief.prueba||[]).length
        ? 'Usar el activo disponible: ' + (c.brief.prueba||[]).join(', ') + '.'
        : 'Define el activo de prueba antes de producir: sin prueba, la promesa no se sostiene.',
      img: vdPromptImg(p.f, t, i),
      vid: vdPromptVid(p.f, t),
      hip: `Si "${p.a.toLowerCase()}" está funcionando en ${t.pais}, esta pieza debería superar 25% de Hook Rate y 15% de Hold Rate con un costo por resultado menor al promedio de la cuenta.`,
      metrica: (p.f==='Estático' || p.f==='Carrusel')
        ? 'CTR ≥ 1,5% · día 3: cortar si el CTR es menor a 0,8%'
        : 'Hook Rate ≥ 25% · Hold Rate ≥ 15% · día 3: cortar si el Hook Rate es menor a 20%',
      comp: comp, brief: c.brief,
      ic: calc.ic, banda: calc.banda, sub: calc.sub, pens: calc.pens, bruto: calc.bruto,
      fuente: calc.fuente, referencias: calc.referencias, virales: calc.virales, porIA: !!calc.porIA
    };
  });

  return piezas.sort((a,b) => b.ic - a.ic).map((p, i) => { p.rank = i + 1; return p; });
}

function vdICPromedio(piezas){
  if(!piezas.length) return 0;
  return Math.round(piezas.reduce((s,p)=>s+p.ic, 0) / piezas.length);
}

function vdMarkdown(c){
  const p = c.piezas || [];
  let out = `[Entrega generada con AdForge · Content & Ads Studio — Visión Digital]\n\n`;
  out += `# ${c.nombre}\n\n`;
  out += `Producto: ${c.brief.producto}\nPaís: ${c.brief.pais}\nObjetivo: ${c.brief.objetivo}\n`;
  out += `Piezas: ${p.length} · IC promedio: ${vdICPromedio(p)}\n\n`;
  p.forEach(x => {
    out += `\n---\n\n## #${x.rank} · ${x.angulo} · ${x.formato} — IC ${x.ic} (banda ${x.banda})\n`;
    out += `Conciencia: ${x.conciencia} · Perfil: ${x.tier === 'A' ? 'Ancla' : x.tier === 'B' ? 'Adaptación' : 'Disruptiva'}\n\n`;
    out += `**Ganchos**\n1. ${x.ganchos[0]}\n2. ${x.ganchos[1]}\n3. ${x.ganchos[2]}\n\n`;
    out += `**Copy:** ${x.copy}\n\n**Guion**\n${x.guion.map(l => '- ' + l).join('\n')}\n\n`;
    out += `**CTAs:** ${x.ctas[0]} / ${x.ctas[1]}\n\n`;
    out += `**Prueba:** ${x.prueba}\n\n**Prompt de imagen:** ${x.img}\n\n**Prompt de video:** ${x.vid}\n\n`;
    out += `**Hipótesis:** ${x.hip}\n\n**Métrica:** ${x.metrica}\n\n`;
    out += `**Compliance (${x.comp.nivel}):** ${x.comp.nota}\n`;
  });
  out += `\n---\n_AdForge · Content & Ads Studio · Visión Digital_`;
  return out;
}

function vdSlug(s){
  return String(s||'cliente').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40) || 'cliente';
}
