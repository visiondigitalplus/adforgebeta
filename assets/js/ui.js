/* ============================================================
   Vistas de la interfaz
   ============================================================ */
const vdEsc = v => String(v==null?'':v).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const vdFmt = v => new Intl.NumberFormat('es').format(Math.round(VD_N(v)));

const VD_PAISES = ['México','Colombia','Venezuela','Argentina','Chile','Perú','España','Ecuador','República Dominicana','Panamá','Estados Unidos','Guatemala','Costa Rica','Uruguay','Bolivia','Paraguay','Honduras','El Salvador','Nicaragua','Puerto Rico'];
const VD_OBJETIVOS = ['Ventas','Mensajes','Prospectos','Tráfico','Interacción','Reconocimiento'];
const VD_IAS = ['Arena','ChatGPT','Gemini','Claude','Perplexity','API propia','Sin IA'];

function vdEstadoChip(c){
  if(c.piezas && c.piezas.length) return '<span class="pill pA">Entregado</span>';
  if(c.ads && c.ads.length || c.kws && c.kws.length) return '<span class="pill pB">Investigando</span>';
  return '<span class="pill pC">Nuevo</span>';
}

/* ---------------- HOME ---------------- */
function vdViewHome(){
  const cs = vdDB.clientes();
  const totalPiezas = cs.reduce((s,c)=>s+((c.piezas||[]).length),0);
  const totalAds = cs.reduce((s,c)=>s+((c.ads||[]).length),0);
  const conEntrega = cs.filter(c => (c.piezas||[]).length).length;

  return `
  <div class="row">
    <div>
      <h1 class="page">Clientes y expedientes</h1>
      <div class="sub">Cada cliente guarda su briefing, su investigación y su entrega. Todo en este navegador.</div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn" data-act="nuevo">+ Nuevo cliente</button>
      <button class="btn ghost" data-act="demo">Cargar demo</button>
    </div>
  </div>

  <details class="resumen">
    <summary>📊 Resumen · ${cs.length} cliente${cs.length===1?'':'s'} · ${totalPiezas} pieza${totalPiezas===1?'':'s'} generada${totalPiezas===1?'':'s'}<span class="f">▾</span></summary>
    <div class="grid g4" style="margin:14px 0 22px">
      <div class="kpi"><div class="v">${cs.length}</div><div class="l">Clientes</div></div>
      <div class="kpi"><div class="v">${conEntrega}</div><div class="l">Con entrega</div></div>
      <div class="kpi"><div class="v">${totalAds}</div><div class="l">Anuncios investigados</div></div>
      <div class="kpi"><div class="v">${totalPiezas}</div><div class="l">Piezas generadas</div></div>
    </div>
  </details>

  ${cs.length ? `<div class="grid g3">${cs.map(c => `
    <div class="cli">
      <div data-act="abrir" data-id="${c.id}" style="cursor:pointer">
        <b>${vdEsc(c.nombre)}</b>
        <div class="m">${vdEsc(c.brief.producto || 'Sin briefing')} · ${vdEsc(c.brief.pais || '—')}</div>
      </div>
      <div class="foot">
        <span>${(c.piezas||[]).length ? (c.piezas||[]).length + ' piezas · IC ' + vdICPromedio(c.piezas) : 'Sin entrega'}</span>
        <div style="display:flex;gap:6px;align-items:center">
          <button class="mini" data-act="renombrar" data-id="${c.id}" title="Cambiar el nombre">✏️</button>
          <button class="mini" data-act="borrarCli" data-id="${c.id}" title="Eliminar">🗑</button>
          ${vdEstadoChip(c)}
        </div>
      </div>
    </div>`).join('')}</div>` : `
    <div class="empty">
      <b>Todavía no hay clientes</b>
      Crea el primero o carga el ejemplo para ver el sistema completo funcionando.
      <div style="margin-top:16px"><button class="btn" data-act="nuevo">+ Nuevo cliente</button>
      <button class="btn ghost" data-act="demo" style="margin-left:8px">Cargar demo</button></div>
    </div>`}

  <div class="card" style="margin-top:22px">
    <div class="row" style="margin-bottom:0">
      <div>
        <h3 style="font-size:14px">Copia de seguridad</h3>
        <div class="hint">Los datos viven en este navegador. Exporta el archivo para no perderlos o para pasarlos a otra computadora.</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn ghost sm" data-act="exportar">Exportar base (.json)</button>
        <button class="btn ghost sm" data-act="importar">Importar base</button>
      </div>
    </div>
  </div>`;
}

/* ---------------- CLIENTE ---------------- */
function vdViewCliente(){
  const c = vdDB.cliente(vdApp.clienteId);
  if(!c) return '<div class="empty"><b>Cliente no encontrado</b></div>';

  const tabs = [
    ['brief','Briefing'],
    ['inv','Investigación'],
    ['entrega','Entrega']
  ];

  return `
  <div class="row">
    <div>
      <div class="hint" style="margin-bottom:6px"><a href="#" data-act="home">← Clientes</a></div>
      <h1 class="page">${vdEsc(c.nombre)}</h1>
      <div class="sub">${vdEsc(c.brief.producto || 'Sin producto definido')} · ${vdEsc(c.brief.pais || '—')} · objetivo ${vdEsc(c.brief.objetivo)}</div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${vdEstadoChip(c)}
      <button class="btn ghost sm" data-act="duplicar">Duplicar</button>
      <button class="btn danger sm" data-act="eliminar">Eliminar</button>
    </div>
  </div>

  ${vdStepper(c)}

  <div class="tabs">
    ${tabs.map(([id,l]) => `<button class="tabbtn ${vdApp.tab===id?'on':''}" data-act="tab" data-id="${id}">${l}</button>`).join('')}
  </div>

  ${vdApp.tab==='brief' ? vdTabBrief(c) : vdApp.tab==='inv' ? vdTabInv(c) : vdTabEntrega(c)}`;
}

/* ---------------- TAB BRIEFING ---------------- */
function vdTabBrief(c){
  const b = c.brief;
  const star = '<span class="req">★</span> ';
  const reqs = [b.producto,b.precio,b.avatar,b.pais,b.promesa,b.objetivo,b.presupuesto];
  const done = reqs.filter(x => String(x).trim()).length;

  return `
  <div class="card">
    <div class="field" style="margin-bottom:0">
      <label>Nombre del cliente o proyecto</label>
      <input data-nombre value="${vdEsc(c.nombre)}" placeholder="Nombre del cliente">
    </div>
  </div>

  <div class="card">
    <div class="row" style="margin-bottom:10px">
      <div><b>Datos obligatorios</b> <span class="hint">— sin estos siete no se puede investigar</span></div>
      <b id="reqCount">${done}/7</b>
    </div>
    <div class="bar"><i id="reqBar" style="width:${Math.round(done/7*100)}%"></i></div>
  </div>

  <div class="card">
    <div class="blk"><div class="n">1</div><div><h3>Tu negocio</h3><span>Qué vendes y a qué precio</span></div></div>
    <div class="grid g2">
      <div class="field"><label>Qué vendes <span class="req">*</span></label>
        <input data-f="producto" value="${vdEsc(b.producto)}" placeholder="Programa online de movilidad"></div>
      <div class="field"><label>Precio <span class="req">*</span></label>
        <input data-f="precio" value="${vdEsc(b.precio)}" placeholder="97 USD"></div>
    </div>
    <div class="field"><label>${star}Sub-nicho o categoría exacta</label>
      <input data-f="subnicho" value="${vdEsc(b.subnicho)}" placeholder="dolor lumbar en mujeres de 35 a 50"></div>
    <div class="field"><label>${star}Mecanismo propio (por qué tú)</label>
      <input data-f="mecanismo" value="${vdEsc(b.mecanismo)}" placeholder="método de 3 fases sin impacto articular"></div>
  </div>

  <div class="card">
    <div class="blk"><div class="n">2</div><div><h3>Tu cliente</h3><span>A quién le vendes y en qué país</span></div></div>
    <div class="field"><label>A quién le vendes <span class="req">*</span></label>
      <textarea data-f="avatar" placeholder="Mujeres de 35 a 50 que se despiertan con dolor de espalda">${vdEsc(b.avatar)}</textarea></div>
    <div class="grid g2">
      <div class="field"><label>Su dolor #1, en sus palabras</label>
        <input data-f="dolor" value="${vdEsc(b.dolor)}" placeholder="despertarse con dolor de espalda"></div>
      <div class="field"><label>El resultado que busca</label>
        <input data-f="deseo" value="${vdEsc(b.deseo)}" placeholder="volver a moverse sin dolor"></div>
    </div>
    <div class="grid g2">
      <div class="field"><label>País / mercado <span class="req">*</span></label>
        <select data-f="pais">${VD_PAISES.map(p=>`<option ${b.pais===p?'selected':''}>${p}</option>`).join('')}</select></div>
      <div class="field"><label>Objetivo de campaña <span class="req">*</span></label>
        <select data-f="objetivo">${VD_OBJETIVOS.map(o=>`<option ${b.objetivo===o?'selected':''}>${o}</option>`).join('')}</select></div>
    </div>
  </div>

  <div class="card">
    <div class="blk"><div class="n">3</div><div><h3>Tu promesa</h3><span>Qué resultado das y qué prueba tienes</span></div></div>
    <div class="field"><label>Qué prometes y en cuánto tiempo <span class="req">*</span></label>
      <textarea data-f="promesa" placeholder="Volver a moverte sin dolor en 21 días con 10 minutos al día">${vdEsc(b.promesa)}</textarea></div>
    <div class="field"><label>Garantía</label>
      <input data-f="garantia" value="${vdEsc(b.garantia)}" placeholder="30 días de garantía">
      <div class="hint">Sin garantía declarada, el IC del lote baja 3 puntos.</div></div>
    <div class="field"><label>Prueba que tienes</label>
      <div>${[['testimonio','Testimonios'],['demo','Demostración'],['dato','Datos o cifras'],['fotos','Fotos reales']]
        .map(([k,l])=>`<label class="chk ${(b.prueba||[]).indexOf(k)>-1?'on':''}">
          <input type="checkbox" data-chk="prueba" data-v="${k}" ${(b.prueba||[]).indexOf(k)>-1?'checked':''}>${l}</label>`).join('')}</div>
    </div>
    <div class="field"><label>Referencias o competidores</label>
      <input data-f="referencias" value="${vdEsc(b.referencias)}" placeholder="@cuenta1, @cuenta2, marca.com"></div>
  </div>

  <div class="card">
    <div class="blk"><div class="n">4</div><div><h3>Campaña y límites</h3><span>Presupuesto, restricciones y producción</span></div></div>
    <div class="grid g2">
      <div class="field"><label>Presupuesto mensual (USD) <span class="req">*</span></label>
        <input data-f="presupuesto" value="${vdEsc(b.presupuesto)}" placeholder="900"></div>
      <div class="field"><label>¿Con qué IA trabajamos?</label>
        <select data-f="ia">${VD_IAS.map(i=>`<option ${c.ia===i?'selected':''}>${i}</option>`).join('')}</select></div>
    </div>
    <div class="field"><label>Qué NO puedes decir</label>
      <input data-f="restricciones" value="${vdEsc(b.restricciones)}" placeholder="salud: sin promesas de curación"></div>
    <div class="field"><label>Qué puedes producir</label>
      <div>${[['video','Video propio'],['ugc','UGC / clientes'],['foto','Fotos'],['solo','Solo diseño con IA']]
        .map(([k,l])=>`<label class="chk ${(b.produccion||[]).indexOf(k)>-1?'on':''}">
          <input type="checkbox" data-chk="produccion" data-v="${k}" ${(b.produccion||[]).indexOf(k)>-1?'checked':''}>${l}</label>`).join('')}</div>
    </div>
  </div>

  <div style="display:flex;gap:10px;flex-wrap:wrap">
    <button class="btn" data-act="tab" data-id="inv">Ir a la investigación →</button>
    <button class="btn ghost" data-act="generar">Generar piezas con lo que hay</button>
  </div>`;
}

/* ---------------- TAB INVESTIGACIÓN ---------------- */
function vdTabInv(c){
  const r = c.research;
  return vdPanelIA(c) + (r ? vdInvDossier(c, r) : '') + vdInvDatos(c);
}

/* ============================================================
   PANEL ÚNICO: copiar prompt → Arena → pegar resultado → cargar
   ============================================================ */
function vdPanelIA(c){
  const r = c.research;
  return `
  <div class="card" style="border-color:#4a3a17;background:linear-gradient(180deg,#1a1508,#0d1017)">
    <div class="row" style="margin-bottom:6px">
      <div>
        <h3 style="font-size:18px;margin:0">Traer la investigación</h3>
        <div class="hint" style="max-width:66ch;margin-top:6px">
          Un solo camino, tres pasos. No hay que conectar nada ni pegar llaves.
        </div>
      </div>
      ${r ? '<span class="pill pA">investigación cargada</span>' : ''}
    </div>

    <div class="paso-item">
      <div class="paso-num">1</div>
      <div style="flex:1">
        <b class="paso-tit">Copia el prompt</b>
        <div class="hint-sm">Lleva dentro todo el briefing de ${vdEsc(c.nombre||'este cliente')}: qué vende, a quién, la promesa, el mecanismo y el país.</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
          <button class="btn" data-act="copiarPromptIA">📋 Copiar el prompt</button>
          <button class="btn ghost" data-act="verPrompt">Ver lo que se copia</button>
        </div>
      </div>
    </div>

    <div class="paso-item">
      <div class="paso-num">2</div>
      <div style="flex:1">
        <b class="paso-tit">Pégalo en Arena</b>
        <div class="hint-sm">Abre Arena, pega el prompt con Ctrl+V y elige ahí la IA que prefieras. Arena ya se encarga del resto: no tienes que decidir nada más.</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
          <a class="btn ghost" href="https://arena.ai" target="_blank" rel="noopener" style="text-decoration:none">↗ Abrir Arena</a>
        </div>
      </div>
    </div>

    <div class="paso-item" style="border-bottom:none">
      <div class="paso-num">3</div>
      <div style="flex:1">
        <b class="paso-tit">Trae el resultado</b>
        <div class="hint-sm">Copia la respuesta completa de Arena y pégala aquí. No importa si viene con texto alrededor:
          el sistema busca el JSON y lo lee solo.</div>
        <div style="margin-top:10px">
          <textarea id="jsonIA" rows="6" placeholder="Pega aquí el resultado que te generó el prompt…" style="width:100%;resize:vertical"></textarea>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
          <button class="btn" data-act="cargarJSON">▸ Cargar y generar las piezas</button>
          <button class="btn ghost" data-act="traerClip">📥 Traer del portapapeles</button>
        </div>
      </div>
    </div>

    <div class="note" style="margin-top:16px;margin-bottom:0">
      <b>Si Arena te responde con texto y no con datos</b>, escríbele: <i>«devuelve solo el JSON, sin explicación ni markdown»</i>.
    </div>
  </div>`;
}

/* --- expediente cargado --- */
function vdInvDossier(c, r){
  const b = c.brief;
  const fecha = new Date(r.generado).toLocaleString('es', {day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
  return `
  <div class="card" style="border-color:#24402f">
    <div class="row" style="margin-bottom:10px">
      <div>
        <h3 style="font-size:16px">Expediente de investigación</h3>
        <div class="hint">${vdEsc(fecha)} · mercado ${vdEsc(r.pais)} · fuente: ${vdEsc(r.ia)}</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn sm" data-act="tab" data-id="entrega">Ver la entrega →</button>
      </div>
    </div>
    <p style="color:#e2e9f7;font-size:14.5px;margin:0">${vdEsc(r.resumen)}</p>
  </div>

  <div class="card">
    <h3 style="font-size:16px;margin-bottom:12px">Consultas para la Biblioteca de Anuncios</h3>
    <div class="grid g2">
      ${(r.consultas||[]).map(x => `
        <div style="border:1px solid #1b2233;border-radius:10px;padding:11px 13px;background:#0a0e18">
          <div style="font-size:14px;color:#eef2fa">${vdEsc(x.q)}</div>
          <div class="hint" style="margin:3px 0 9px">${vdEsc(x.tipo)}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <a class="tag" href="${x.ads}" target="_blank" rel="noopener" style="text-decoration:none">Meta Ads ↗</a>
            <a class="tag" href="${x.tiktok}" target="_blank" rel="noopener" style="text-decoration:none">TikTok ↗</a>
            <a class="tag" href="${x.instagram}" target="_blank" rel="noopener" style="text-decoration:none">IG ↗</a>
            <a class="tag" href="${x.youtube}" target="_blank" rel="noopener" style="text-decoration:none">YouTube ↗</a>
          </div>
        </div>`).join('')}
    </div>
  </div>

  <div class="card">
    <h3 style="font-size:16px;margin-bottom:12px">Ángulos detectados</h3>
    <div class="tw"><table>
      <thead><tr><th>Ángulo</th><th>Por qué funciona aquí</th><th>Fuerza</th></tr></thead>
      <tbody>${(r.angulos||[]).map(a => `<tr>
        <td><b>${vdEsc(a.angulo)}</b></td>
        <td style="color:#c2ccdf">${vdEsc(a.razon)}</td>
        <td><span class="pill ${a.fuerza>=80?'pA':a.fuerza>=65?'pB':'pC'}">${a.fuerza}</span></td>
      </tr>`).join('')}</tbody>
    </table></div>
  </div>`;
}

/* --- datos que llegaron en el JSON (solo lectura) --- */
function vdInvDatos(c){
  const ads = c.ads || [], vir = c.viral || [], rev = c.rev || [], kws = c.kws || [];
  if(!ads.length && !vir.length && !rev.length && !kws.length) return '';

  const tblAds = ads.length ? `
  <div class="card">
    <div class="row" style="margin-bottom:12px">
      <div><h3 style="font-size:16px">Anuncios del mercado</h3>
        <div class="hint">${ads.length} anuncios · los que Arena encontró en la Biblioteca de Anuncios.
          Los marcados <b>[VERIFICADO]</b> cuentan como evidencia real y suben el IC.</div></div>
    </div>
    <div class="tw"><table>
      <thead><tr><th>Página</th><th>País</th><th>Días activo</th><th>Variantes</th><th>Objetivo</th><th>Formato</th><th>Ángulo</th></tr></thead>
      <tbody>${ads.map(a => `<tr>
        <td><b>${vdEsc(a.pagina)}</b></td><td>${vdEsc(a.pais)}</td>
        <td class="num">${VD_N(a.dias)}</td><td class="num">${VD_N(a.variantes)}</td>
        <td>${vdEsc(a.objetivo)}</td><td>${vdEsc(a.formato)}</td><td>${vdEsc(a.angulo)}</td>
      </tr>`).join('')}</tbody>
    </table></div>
  </div>` : '';

  const tblVir = vir.length ? `
  <div class="card">
    <h3 style="font-size:16px;margin-bottom:12px">Radar de contenido viral</h3>
    <div class="tw"><table>
      <thead><tr><th>Red</th><th>Cuenta</th><th>Vistas</th><th>Likes</th><th>Ángulo</th><th>ER</th><th>Viral</th></tr></thead>
      <tbody>${vir.map(v => `<tr>
        <td>${vdEsc(v.red)}</td><td>${vdEsc(v.cuenta)}</td>
        <td class="num">${VD_N(v.views)}</td><td class="num">${VD_N(v.likes)}</td>
        <td>${vdEsc(v.angulo)}</td>
        <td class="num">${(vdErPct(v)||0).toFixed(2)}%</td>
        <td><span class="pill ${vdViralScore(v)>=75?'pA':vdViralScore(v)>=50?'pB':'pD'}">${vdViralScore(v)}</span></td>
      </tr>`).join('')}</tbody>
    </table></div>
  </div>` : '';

  const revs = rev.length ? `
  <div class="card">
    <h3 style="font-size:16px;margin-bottom:12px">Ingeniería inversa</h3>
    ${rev.map((x,i) => `
      <div style="border:1px solid #1b2233;border-radius:10px;padding:12px 14px;margin-bottom:10px;background:#0a0e18">
        <b style="color:#f2d78a;font-size:13.5px">${vdEsc(x.cuenta || ('Análisis '+(i+1)))}</b>
        <div class="hint-sm" style="margin-top:6px">
          <b>Gancho:</b> ${vdEsc(x.gancho)}<br>
          <b>Promesa:</b> ${vdEsc(x.promesa)} · <b>Mecanismo:</b> ${vdEsc(x.mecanismo)}<br>
          <b>Prueba:</b> ${vdEsc(x.prueba)}<br>
          <b>Objeciones que derriba:</b> ${vdEsc(x.objeciones)}<br>
          <b>CTA:</b> ${vdEsc(x.cta)} · <b>Formato:</b> ${vdEsc(x.formato)}<br>
          <b>Por qué funciona:</b> ${vdEsc(x.porque)}
        </div>
      </div>`).join('')}
  </div>` : '';

  const tblKw = kws.length ? `
  <div class="card">
    <h3 style="font-size:16px;margin-bottom:12px">Términos de búsqueda</h3>
    <div class="tw"><table>
      <thead><tr><th>Término</th><th>Fuente</th><th>Intención</th><th>Se usa en</th><th>Comprobar</th></tr></thead>
      <tbody>${kws.map(k => `<tr>
        <td>${vdEsc(k.termino)}</td><td><span class="tag">${vdEsc(k.fuente)}</span></td>
        <td>${vdEsc(k.intencion)}</td><td>${vdEsc(k.uso)}</td>
        <td><a class="tag" href="${vdLinkGoogle(k.termino)}" target="_blank" rel="noopener" style="text-decoration:none">Google ↗</a></td>
      </tr>`).join('')}</tbody>
    </table></div>
  </div>` : '';

  return tblAds + tblKw + tblVir + revs;
}

/* --- pantalla de investigación en curso --- */
function vdLoadingView(){
  const c = vdDB.cliente(vdApp.clienteId);
  const nombre = c ? c.nombre : 'tu cliente';
  return `
  <div style="max-width:660px;margin:34px auto">
    <h1 class="page">Investigando el mercado…</h1>
    <div class="sub">Construyendo el expediente de <b>${vdEsc(nombre)}</b>. Esto normalmente son 3 horas de trabajo manual.</div>
    <div class="card" style="margin-top:20px">
      ${VD_STAGES.map((s,i) => `<div class="stage" id="stage${i}">
        <div class="dot">${i+1}</div>
        <div><b>${s[1]}</b><span>${s[2]}</span></div>
      </div>`).join('')}
      <div class="bar" style="margin-top:16px"><i id="loadBar" style="width:0%"></i></div>
    </div>
    <div class="hint">Al terminar se generan las 7 piezas y pasas directo a la entrega.</div>
  </div>`;
}

const VD_STAGES = [
  ['E1','Leyendo el briefing','Normalizando nicho, país, categoría y restricciones.'],
  ['E2','Construyendo consultas','Armando las búsquedas para la Biblioteca de Anuncios de Meta.'],
  ['E3','Mapeando el lenguaje','Términos de búsqueda, intención y fuente de cada uno.'],
  ['E4','Detectando ángulos','Cruzando el briefing con los patrones que funcionan en este nicho.'],
  ['E5','Preparando la verificación','Enlaces directos a Meta, TikTok, Instagram y YouTube.'],
  ['E6','Armando las 7 piezas','Generando el lote con su procedencia y su Índice de Confianza.']
];

/* ---------------- TAB ENTREGA ---------------- */
function vdPieceCard(p, c){
  const sub = p.sub;
  const row = (l,v) => `<div class="icrow"><span>${l}</span><div class="bar"><i style="width:${VD_clamp(v,0,100)}%"></i></div><b>${v}</b></div>`;
  return `
  <details class="piece" ${p.rank===1?'open':''}>
    <summary class="phead">
      <span class="ic ${p.banda}">${p.ic}</span>
      <span class="ptitle">
        <b>#${p.rank} · ${vdEsc(p.angulo)} · ${vdEsc(p.formato)}</b>
        <span class="m">${vdEsc(p.conciencia)} · banda ${p.banda} · IC ${p.fuente}</span>
        <span style="display:block;margin-top:6px">
          <span class="tag">${p.tier==='A'?'Ancla':p.tier==='B'?'Adaptación':'Disruptiva'}</span>
          <span class="tag">Compliance ${vdEsc(p.comp.nivel)}</span>
        </span>
        <span class="abrir">Dale clic para abrir la pieza completa <span class="f">▾</span></span>
      </span>
    </summary>
    <div class="pbody">
      <div class="hook"><b>Gancho principal</b>${vdEsc(p.ganchos[0])}</div>
      <div class="hook"><b>Gancho alterno 1</b>${vdEsc(p.ganchos[1])}</div>
      <div class="hook"><b>Gancho alterno 2</b>${vdEsc(p.ganchos[2])}</div>
      <div class="kit">
        <div class="kitbox full"><b>Copy / descripción</b>${vdEsc(p.copy)}</div>
        <div class="kitbox full"><b>Guion completo · ${vdEsc(p.formato)}</b>${vdGuionHTML(p)}</div>
        <div class="kitbox"><b>CTA de acción</b>${vdEsc(p.ctas[0])}</div>
        <div class="kitbox"><b>CTA de baja fricción</b>${vdEsc(p.ctas[1])}</div>
        <div class="kitbox"><b>Prompt de imagen</b>${vdEsc(p.img)}</div>
        <div class="kitbox"><b>Prompt de video</b>${vdEsc(p.vid)}</div>
        <div class="kitbox"><b>Prueba a usar</b>${vdEsc(p.prueba)}</div>
        <div class="kitbox"><b>Hipótesis</b>${vdEsc(p.hip)}</div>
        <div class="kitbox full"><b>Métrica y umbral de corte</b>${vdEsc(p.metrica)}</div>
        <div class="kitbox full" style="border-color:${p.comp.nivel==='Alto'?'#4b2029':'#1b2233'}"><b>Compliance ${vdEsc(p.comp.nivel)}</b>${vdEsc(p.comp.nota)}</div>
      </div>
      ${vdProcedencia(p, c)}
      <div class="evi"><b>Evidencia (${p.porIA && p.fuente === 'estimada' ? 'propuesta por IA' : p.fuente}):</b> ${p.referencias} anuncios verificados y ${p.virales} contenidos vinculados a este ángulo.</div>
      <div class="icbreak">
        ${row('Longevidad · 30%', sub.EV)}
        ${row('Escalado · 20%', sub.ES)}
        ${row('Orgánico · 20%', sub.EO)}
        ${row('Tu prueba · 15%', sub.CP)}
        ${row('Encaje · 15%', sub.EN)}
        ${p.pens.length ? p.pens.map(x=>`<div class="pen">${x.v} · ${x.m}</div>`).join('') : '<div style="color:#5ee9a8;font-size:11px;margin-top:4px">Sin penalizaciones</div>'}
        <div style="color:#5f6b86;font-size:11px;margin-top:5px">Base ${p.bruto} ${p.pens.length?'− '+Math.abs(p.pens.reduce((s,x)=>s+x.v,0))+' = ':''}<b style="color:#eceff7">${p.ic}</b> / 100</div>
      </div>
    </div>
  </details>`;
}

function vdTabEntrega(c){
  const p = c.piezas || [];
  if(!p.length){
    return `<div class="empty">
      <b>Todavía no hay entrega</b>
      Genera el lote con el briefing actual. Si aún no registraste anuncios en la investigación,
      las piezas se crean igual pero con <b>IC estimado</b>.
      <div style="margin-top:16px">
        <button class="btn" data-act="generar">Generar 7 piezas</button>
        <button class="btn ghost" data-act="tab" data-id="inv" style="margin-left:8px">Ir a la investigación</button>
      </div>
    </div>`;
  }

  const exito = vdCondicionesExito(c);
  const a = p.filter(x=>x.banda==='A').length;
  return `${vdCardExito(exito)}` + `
  <div class="row no-print">
    <div>
      <h2 style="font-size:18px">Entrega: ${p.length} piezas</h2>
      <div class="sub">IC promedio ${vdICPromedio(p)} · ${a} en banda A · ordenadas de mayor a menor probabilidad</div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn" data-act="imprimir">Imprimir / PDF</button>
      <button class="btn ghost sm" data-act="copiarMD">Copiar Markdown</button>
      <button class="btn ghost sm" data-act="descargarJSON">JSON</button>
      ${p.length<14?`<button class="btn ghost sm" data-act="ampliar">Ampliar a 14</button>`:''}
      <button class="btn ghost sm" data-act="generar">Regenerar</button>
    </div>
  </div>

  <div class="card no-print">
    <div class="row" style="margin-bottom:0">
      <div><b>${vdEsc(c.nombre)}</b> · ${vdEsc(c.brief.producto)} · ${vdEsc(c.brief.pais)} · objetivo ${vdEsc(c.brief.objetivo)}</div>
      <div class="hint">Generado con ${vdEsc(c.ia)}</div>
    </div>
  </div>

  ${vdCardIC()}

  ${p.map(x => vdPieceCard(x, c)).join('')}

  <div class="note no-print">
    <b>Cómo subir el IC de este lote:</b> las piezas marcadas como <b>estimada</b> llevan un descuento conservador del 15%
    porque todavía no hay anuncios de ese ángulo cargados en la investigación. En cuanto el JSON traiga anuncios reales
    del ángulo, el IC pasa a <b>parcial</b> o <b>verificada</b> y sube solo. Arriba tienes «¿Qué es el IC?» si quieres el detalle.
  </div>

  <div class="note no-print">El documento se imprime con el botón <b>Imprimir / PDF</b>: la barra superior y los botones no salen,
  solo la entrega. Sirve para enviarla tal cual al cliente.</div>

`;
}

/* ---------------- PROCEDENCIA (de dónde salió cada pieza) ---------------- */
function vdProcedencia(p, c){
  const b = c.brief || {};
  const r = c.research;
  const ang = r ? (r.angulos||[]).find(a => a.angulo === p.angulo) : null;
  const kw  = r ? ((r.kws||[]).find(k => k.uso === 'Gancho') || (r.kws||[])[0]) : null;
  const cons = r ? (r.consultas||[])[0] : null;
  const adsAng = (c.ads||[]).filter(a => (a.angulo||'') === p.angulo);

  const links = [];
  if(kw) links.push(`<a class="tag" href="${vdLinkAdLibrary(kw.termino, b.pais)}" target="_blank" rel="noopener" style="text-decoration:none">Meta Ads ↗</a>`);
  if(cons) links.push(`<a class="tag" href="${cons.tiktok}" target="_blank" rel="noopener" style="text-decoration:none">TikTok ↗</a>`);
  if(kw) links.push(`<a class="tag" href="${vdLinkGoogle(kw.termino)}" target="_blank" rel="noopener" style="text-decoration:none">Google ↗</a>`);

  const verif = adsAng.filter(a => a.origen !== 'ia');
  const prop  = adsAng.filter(a => a.origen === 'ia');
  let estado;
  if(verif.length){
    estado = `<b style="color:#5ee9a8">Verificada</b> con ${verif.length} anuncio(s) registrado(s): ` +
      verif.map(a => `${vdEsc(a.pagina||'—')} (${VD_N(a.dias)} días, ${VD_N(a.variantes)} variantes)`).join(' · ');
  } else if(prop.length){
    estado = `<b style="color:#f2cf6a">Propuesta por IA, sin verificar</b>: ` +
      prop.map(a => vdEsc(a.pagina||'—')).join(' · ') +
      `. Abre los enlaces y confirma en la Biblioteca de Anuncios antes de dar esta pieza por buena.`;
  } else {
    estado = `<b style="color:#f2cf6a">Estimada</b>: todavía no registraste un anuncio de este ángulo. Abre los enlaces,
      filtra por <b>Activos</b> y busca anuncios con 30+ días; luego anótalo en «Registra lo que confirmes».`;
  }

  return `
  <div class="evi" style="border-left-color:#7fb7d8;background:#0b1622">
    <b>De dónde salió esta pieza</b>
    <div style="margin-top:6px;line-height:1.7">
      <b>Ángulo:</b> ${vdEsc(p.angulo)}${ang ? ' — ' + vdEsc(ang.razon) : ''}<br>
      ${kw ? `<b>Término que la origina:</b> «${vdEsc(kw.termino)}» (${vdEsc(kw.fuente)}, ${vdEsc(kw.intencion)})<br>` : ''}
      <b>Estado de la evidencia:</b> ${estado}<br>
      <b>Formato:</b> ${vdEsc(p.formato)} · <b>Nivel de conciencia:</b> ${vdEsc(p.conciencia)}<br>
      ${links.length ? `<b>Comprobar ahora:</b> ${links.join(' ')}` : '<b>Comprobar:</b> ejecuta la investigación automática para tener los enlaces.'}
    </div>
  </div>`;
}

/* ============================================================
   CENTRO DE CONEXIONES
   Cada usuario conecta sus cuentas en su propio navegador.
   ============================================================ */
function vdViewConfig(){
  const conns = vdIAConn.conexiones;
  const conectadas = conns.length;

  const cards = conns.map(c => {
    const p = vdIAProv(c.prov) || { nombre:c.prov };
    const estado = c.estado === 'ok'
      ? '<span class="pill pA">conectada</span>'
      : c.estado === 'error' ? '<span class="pill pD">error</span>' : '<span class="pill pC">sin probar</span>';
    const usada = VD_IA_SECCIONES.filter(x => vdIAConn.activa[x[0]] === c.id).map(x => x[1]);
    return `
    <div class="card" style="background:#0c1119;margin-bottom:10px">
      <div class="row">
        <div>
          <b style="font-size:14px">${vdEsc(c.etiqueta)}</b> ${estado}
          <div class="hint">${vdEsc(p.nombre)} · modelo <b>${vdEsc(c.modelo)}</b>
            · llave ${vdEsc(c.llave.slice(0,6))}…${vdEsc(c.llave.slice(-4))}</div>
          ${usada.length ? `<div class="hint" style="color:#e3b23c">Se usa en: ${usada.join(', ')}</div>` : ''}
          ${c.error ? `<div class="hint" style="color:#f0a0a4">${vdEsc(c.error)}</div>` : ''}
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn ghost sm" data-act="iaProbar" data-id="${c.id}">Probar</button>
          <button class="btn danger sm" data-act="iaBorrar" data-id="${c.id}">Quitar</button>
        </div>
      </div>
    </div>`;
  }).join('');

  const opts = id => conns.map(c => `<option value="${c.id}" ${id===c.id?'selected':''}>${vdEsc(c.etiqueta)}</option>`).join('');

  return `
  <div class="crumb"><a href="#" data-act="home" style="color:#8d99b5;text-decoration:none">Clientes</a> &nbsp;/&nbsp; Conexiones</div>

  <div class="card">
    <div class="row" style="margin-bottom:6px">
      <div><h2 style="font-size:19px;margin:0">Tus conexiones</h2>
      <div class="hint" style="max-width:70ch;margin-top:6px">
        Cada persona conecta <b>su propia cuenta</b> en <b>su propio navegador</b>. Las llaves se guardan solo en este equipo
        y nunca se envían a ningún servidor nuestro: van directo a la API del proveedor que elijas.
        Si te quedas sin saldo o quieres comparar, añade otra y cámbiala cuando quieras.
      </div></div>
      <span class="chip">${conectadas} conectada${conectadas===1?'':'s'}</span>
    </div>
    ${cards || `<div class="note" style="margin-top:12px">Todavía no hay ninguna IA conectada. Sin conexión, la app usa su <b>motor local</b>:
      genera consultas, términos y ángulos desde el briefing, pero no redacta ni investiga con un modelo.</div>`}
  </div>

  <div class="card">
    <h3 style="font-size:15px;margin-bottom:14px">Conectar una IA</h3>
    <div class="grid g3">
      <div class="field"><label>Proveedor</label>
        <select id="iaProv" data-cambio="iaProv">
          ${VD_PROVEEDORES.map(p => `<option value="${p.id}">${vdEsc(p.nombre)}</option>`).join('')}
        </select>
      </div>
      <div class="field"><label>Modelo</label>
        <input id="iaModel" placeholder="gpt-5" value="${vdEsc(VD_PROVEEDORES[0].modelos[0])}">
      </div>
      <div class="field"><label>Nombre para ti (opcional)</label>
        <input id="iaEtiqueta" placeholder="Mi cuenta de OpenAI">
      </div>
      <div class="field" style="grid-column:1/-1"><label>Llave de API</label>
        <input id="iaKey" type="password" placeholder="sk-…" autocomplete="off">
        <div class="hint" id="iaAyuda">Consigue tu llave en ${vdEsc(VD_PROVEEDORES[0].alta)} · ${vdEsc(VD_PROVEEDORES[0].nota)}</div>
      </div>
      <div class="field" style="grid-column:1/-1" id="iaBaseWrap" hidden>
        <label>URL base de la API</label>
        <input id="iaBase" placeholder="https://tu-servidor/v1/chat/completions">
      </div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:4px">
      <button class="btn" data-act="iaConectar">Conectar y probar</button>
      <button class="btn ghost" data-act="verSeguridad">¿Es seguro esto?</button>
    </div>
  </div>

  <div class="card">
    <h3 style="font-size:15px;margin-bottom:6px">Qué IA usa cada sección</h3>
    <div class="hint" style="margin-bottom:14px">Puedes usar una IA distinta en cada parte. Si una se queda sin saldo, cambias solo esa.</div>
    <div class="grid g3">
      ${VD_IA_SECCIONES.map(([k, nom, desc]) => `
        <div class="field"><label>${nom}</label>
          <select data-cambio="iaAsignar" data-seccion="${k}">
            <option value="">Motor local (sin IA)</option>
            ${opts(vdIAConn.activa[k])}
          </select>
          <div class="hint">${desc}</div>
        </div>`).join('')}
    </div>
  </div>

  <div class="card">
    <h3 style="font-size:15px;margin-bottom:6px">Comparar dos IA</h3>
    <div class="hint" style="margin-bottom:14px">Lanza la misma tarea en las dos y mira las respuestas lado a lado. Sirve para elegir con criterio, no por fama.</div>
    ${conns.length >= 2 ? `
      <div class="grid g3" style="align-items:end">
        <div class="field"><label>IA A</label><select id="cmpA">${opts(conns[0].id)}</select></div>
        <div class="field"><label>IA B</label><select id="cmpB">${opts(conns[1].id)}</select></div>
        <div class="field"><button class="btn ghost" data-act="iaComparar">Comparar con el briefing actual</button></div>
      </div>
      ${vdApp.cmp ? `<div class="grid g2" style="margin-top:14px">${vdApp.cmp.map(r => `
        <div class="card" style="background:#0c1119">
          <div class="row"><b>${vdEsc(r.nombre)}</b><span class="hint">${r.ms} ms</span></div>
          <div style="font-size:12.5px;color:#c3ccdd;white-space:pre-wrap;max-height:280px;overflow:auto;margin-top:8px">${vdEsc(r.texto)}</div>
        </div>`).join('')}</div>` : ''}
    ` : `<div class="note">Necesitas al menos dos conexiones para comparar.</div>`}
  </div>

  <div class="note bad">
    <b>Si usas esto en un equipo compartido:</b> cualquiera que abra este navegador puede ver tus llaves. Usa una llave con límite de gasto,
    revócala cuando termines, y no conectes cuentas en computadoras ajenas.
  </div>

  <div style="margin-top:8px"><button class="btn ghost" data-act="home">← Volver a clientes</button></div>`;
}

/* ============================================================
   Condiciones de éxito: lo que decide si estas piezas funcionan
   ============================================================ */
function vdCondicionesExito(c){
  const b = c.brief || {};
  const piezas = c.piezas || [];
  const items = [];
  const presu = Number(String(b.precio||'').replace(/[^0-9]/g,'')) || 0;
  const diario = Number(b.presupuesto) || 0;

  /* 1 · presupuesto mínimo para tener datos */
  if(diario && diario < 10){
    items.push(['bad', 'Presupuesto insuficiente para aprender',
      `Con $${diario}/día no vas a juntar datos en 7 días: necesitas al menos $10–15/día por conjunto. Con menos, el sistema de Meta no sale de la fase de aprendizaje y cualquier lectura es ruido.`]);
  } else if(diario){
    items.push(['ok', 'Presupuesto con margen para leer resultados',
      `$${diario}/día te da una lectura real alrededor del día 4. Decide con 3–5 días de datos, no con 12 horas.`]);
  } else {
    items.push(['warn', 'Falta el presupuesto en el briefing',
      'Sin presupuesto declarado no se puede calcular cuántas conversiones necesitas para decidir. Complétalo en el briefing.']);
  }

  /* 2 · una variable por vez */
  items.push(['ok', 'Un ángulo por anuncio, no siete a la vez',
    'Estas 7 piezas no se publican juntas: entran 2 o 3 en paralelo para poder atribuir el resultado. Si lanzas todo, no sabrás qué funcionó.']);

  /* 3 · prueba real */
  if(!(b.prueba||[]).length){
    items.push(['bad', 'Sin prueba no hay venta',
      'No declaraste testimonios, fotos ni demostración. Las piezas de prueba social y testimonio van a caer: consigue el activo antes de gastar.']);
  } else {
    items.push(['ok', 'Prueba disponible declarada',
      'Usa el activo en las piezas de Prueba social y Testimonio. La prueba es lo que sostiene la promesa cuando el público no te conoce.']);
  }

  /* 4 · la oferta primero */
  if(!String(b.oferta||'').trim() && !String(b.promesa||'').trim()){
    items.push(['bad', 'Sin oferta clara no hay CTR',
      'No hay promesa ni oferta definida. El anuncio es el 20%; la oferta es el 80% del resultado.']);
  } else {
    items.push(['ok', 'La oferta está definida',
      'El anuncio solo amplifica la oferta. Si la oferta no se entiende en 5 segundos, ningún gancho la salva.']);
  }

  /* 5 · compliance */
  const comp = vdCompliance(c);
  if(comp.pen){
    items.push(['bad', `Compliance ${comp.nivel.toLowerCase()}`,
      comp.nota || 'Hay afirmaciones de salud, dinero o garantías que Meta puede rechazar o limitar. Revisa el texto antes de publicar.']);
  } else {
    items.push(['ok', 'Texto publicable sin riesgo evidente',
      'No detecté afirmaciones de resultado garantizado ni categorías sensibles. Aun así, revisa las políticas de tu sector.']);
  }

  /* 6 · regla de corte */
  items.push(['ok', 'Regla de corte decidida antes de publicar',
    'Día 3: Hook Rate < 20% o CTR < 0,8% → se corta. Sin regla escrita, el dinero se va en piezas que no rinden y nadie decide.']);

  /* 7 · medición */
  items.push(['ok', 'Mide contra el costo por resultado, no contra los likes',
    'La única métrica que decide es el costo por venta o por lead. Si no la estás mirando, el IC más alto del lote no significa nada.']);

  const malos = items.filter(i => i[0] === 'bad').length;
  return { items, malos, ganadores: piezas.filter(p => p.ic >= 70).length };
}

function vdCardExito(ex){
  const color = ex.malos ? '#f0a0a4' : '#5ee9a8';
  return `
  <div class="card" style="border-color:${ex.malos ? '#4b2029' : '#24402f'};margin-bottom:14px">
    <div class="row" style="margin-bottom:10px">
      <div>
        <h3 style="font-size:15px">Antes de publicar</h3>
        <div class="hint">Lo que decide si estas piezas dan resultado. ${ex.malos ? '<b style="color:#f0a0a4">'+ex.malos+' punto(s) crítico(s)</b>' : '<b style="color:#5ee9a8">todo en orden</b>'}</div>
      </div>
    </div>
    ${ex.items.map(([estado, titulo, texto]) => `
      <div style="display:flex;gap:10px;padding:9px 0;border-bottom:1px solid #171d2c">
        <div style="flex:none;width:8px;height:8px;border-radius:50%;margin-top:6px;background:${
          estado==='ok'?'#5ee9a8':estado==='warn'?'#f2cf6a':'#f0a0a4'}"></div>
        <div><b style="font-size:13px">${vdEsc(titulo)}</b>
          <div style="font-size:12.5px;color:#94a0bb;line-height:1.6">${vdEsc(texto)}</div></div>
      </div>`).join('')}
  </div>`;
}

/* ============================================================
   FLUJO GUIADO · 5 pasos
   ============================================================ */
function vdPasos(c){
  const b = c.brief || {};
  const core = ['producto','avatar','dolor','promesa'].filter(k => String(b[k]||'').trim()).length;
  return [
    { n:1, icono:'📝', titulo:'Briefing',     tab:'brief',   hecho:core===4,
      texto:'Cuéntale el negocio: qué vende, a quién, la promesa y la prueba.' },
    { n:2, icono:'🔍', titulo:'Investigación', tab:'inv',     hecho:!!c.research,
      texto:'Copia el prompt, tráelo de Arena y carga el resultado.' },
    { n:3, icono:'📦', titulo:'Entrega',       tab:'entrega', hecho:(c.piezas||[]).length>0,
      texto:'Revisa las 7 piezas, su procedencia y el PDF.' }
  ];
}

function vdStepper(c){
  const pasos = vdPasos(c);
  const actual = pasos.find(p => !p.hecho) || pasos[pasos.length-1];
  return `
  <div class="stepper">
    ${pasos.map(p => `
      <button class="paso ${p.hecho?'hecho':''} ${p.n===actual.n && !p.hecho?'actual':''}"
              data-act="tab" data-id="${p.tab}" title="${vdEsc(p.texto)}">
        <span class="num">${p.hecho?'✓':p.icono}</span>
        <span class="lbl">${vdEsc(p.titulo)}</span>
      </button>`).join('<span class="flecha">→</span>')}
  </div>`;
}

/* ---------- bienvenida ---------- */
function vdViewBienvenida(){
  return `
  <div style="max-width:760px;margin:10px auto">
    <div style="text-align:center;margin-bottom:26px">
      <h1 class="page" style="margin-bottom:6px">AdForge</h1>
      <div class="sub" style="letter-spacing:.14em;text-transform:uppercase;font-size:12.5px;color:#cf9f42">Content &amp; Ads Studio</div>
      <div class="sub">Del briefing a las piezas listas para publicar. Contenido y anuncios, en el mismo taller.</div>
    </div>

    <div class="card">
      ${[
        ['Briefing','Cuéntale el negocio: qué vende, a quién, con qué promesa y qué prueba tiene. Cinco minutos.'],
        ['Investigación','Copias el prompt, lo pegas en Arena y traes el resultado. La app lo lee y arma el expediente del mercado.'],
        ['Entrega','Recibes 7 anuncios con gancho, copy, guion, prompts, procedencia y su Índice de Confianza.']
      ].map(([t,d],i)=>`
        <div style="display:flex;gap:14px;padding:12px 0;border-bottom:1px solid #171d2c">
          <div style="flex:none;width:26px;height:26px;border-radius:50%;border:1px solid #e3b23c;color:#e3b23c;
                      display:grid;place-items:center;font-size:12px;font-weight:700">${i+1}</div>
          <div><b style="font-size:13.5px">${t}</b>
            <div style="font-size:12.5px;color:#94a0bb;line-height:1.6;margin-top:2px">${d}</div></div>
        </div>`).join('')}
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px">
        <button class="btn" data-act="nuevo">Empezar con un cliente</button>
        <button class="btn ghost" data-act="demo">Ver una demo ya hecha</button>
      </div>
      <div class="hint" style="margin-top:12px">No necesitas instalar nada, ni crear cuenta, ni conectar llaves.</div>
    </div>
  </div>`;
}

/* ---------- guía completa (botón ?) ---------- */
function vdViewGuia(){
  return `
  <div class="crumb"><a href="#" data-act="home" style="color:#8d99b5;text-decoration:none">Clientes</a> &nbsp;/&nbsp; Guía</div>
  <div class="card">
    <h2 style="font-size:20px;margin:0 0 6px">Cómo se usa, paso por paso</h2>
    <div class="hint" style="margin-bottom:18px">Tres pasos. Si te pierdes, vuelve a esta página.</div>

    <div class="paso-item">
      <div class="paso-num">1</div>
      <div><b class="paso-tit">📝 Briefing</b>
        <div class="hint-sm">Pestaña <b>Briefing</b>. Rellena el nombre del cliente, qué vende, el precio, el país, a quién le habla,
        el dolor, el deseo, la promesa y el mecanismo. Los campos con ★ suben el Índice de Confianza: no los dejes vacíos.</div>
      </div>
    </div>

    <div class="paso-item">
      <div class="paso-num">2</div>
      <div><b class="paso-tit">🔍 Investigación</b>
        <div class="hint-sm" style="margin-bottom:8px">Pestaña <b>Investigación</b>. Tres movimientos:</div>
        <ol class="pasos-lista">
          <li>Pulsa <b>📋 Copiar el prompt</b>. Lleva dentro todo el briefing.</li>
          <li>Pulsa <b>↗ Abrir Arena</b>, pega el prompt y elige ahí la IA que quieras.</li>
          <li>Copia la respuesta y pégala en el cuadro. Pulsa <b>▸ Cargar y generar las piezas</b>.</li>
        </ol>
        <div class="hint-sm" style="margin-top:8px">Si Arena responde con texto y no con datos, pídele: <i>«devuelve solo el JSON»</i>.</div>
      </div>
    </div>

    <div class="paso-item" style="border-bottom:none">
      <div class="paso-num">3</div>
      <div><b class="paso-tit">📦 Entrega</b>
        <div class="hint-sm">Recibes <b>7 piezas</b> ordenadas por probabilidad. Dale clic a cualquiera para verla completa:
        ganchos, copy, guion, CTAs, prompts de imagen y video, métrica de corte, procedencia y desglose del IC.
        Con <b>Imprimir / PDF</b> salen todas abiertas y con todos los detalles.</div>
      </div>
    </div>

    <div class="note" style="margin-top:18px">
      <b>¿Qué es el IC?</b> Una nota de 0 a 100 sobre la probabilidad de que la pieza funcione.
      En la pestaña Entrega tienes la explicación completa con las bandas A/B/C/D y cómo subirlo.
    </div>
    <div class="note">
      <b>Tus datos viven en este navegador.</b> Nada se sube a internet. Usa <b>Exportar base (.json)</b> una vez por semana como respaldo.
    </div>

    <div style="margin-top:18px"><button class="btn ghost" data-act="home">← Volver a clientes</button></div>
  </div>`;
}


/* ============================================================
   ¿Qué es el IC?
   ============================================================ */
function vdCardIC(){
  return `
  <details class="resumen" style="margin-bottom:14px">
    <summary>❓ ¿Qué es el IC y por qué importa?<span class="f">▾</span></summary>
    <div style="padding:14px 2px 4px;font-size:14px;color:#dfe6f3;line-height:1.75">
      <p style="margin:0 0 10px">El <b>IC (Índice de Confianza)</b> es una nota de <b>0 a 100</b> que estima la probabilidad de que esa pieza funcione,
      calculada con lo que sabemos del mercado y de tu negocio. No es una promesa: es un orden de prioridad para decidir qué producir primero.</p>
      <div class="tw" style="margin:12px 0"><table>
        <thead><tr><th>Banda</th><th>Rango</th><th>Qué significa</th><th>Qué hacer</th></tr></thead>
        <tbody>
          <tr><td><span class="pill pA">A</span></td><td>85 – 100</td><td>Lo más probable del lote</td><td>Producir primero</td></tr>
          <tr><td><span class="pill pB">B</span></td><td>70 – 84</td><td>Sólida, con margen de mejora</td><td>Segunda tanda</td></tr>
          <tr><td><span class="pill pC">C</span></td><td>55 – 69</td><td>Apuesta: enseña algo</td><td>Probar con presupuesto bajo</td></tr>
          <tr><td><span class="pill pD">D</span></td><td>0 – 54</td><td>Poco probable hoy</td><td>Guardar para más adelante</td></tr>
        </tbody>
      </table></div>
      <p style="margin:0 0 8px"><b>Cómo se calcula</b> (los cinco ingredientes):</p>
      <ul class="pasos-lista" style="margin-bottom:12px">
        <li><b>Longevidad · 30%</b>: cuántos días llevan activos los anuncios de ese ángulo. Si un anuncio lleva 60 días, está funcionando.</li>
        <li><b>Escalado · 20%</b>: cuántas variantes del mismo copy tienen. Muchas variantes = el anuncio rinde.</li>
        <li><b>Orgánico · 20%</b>: el rendimiento del contenido viral del mismo ángulo en TikTok, Instagram o YouTube.</li>
        <li><b>Tu prueba · 15%</b>: si tienes testimonios, fotos o demostración. Sin prueba, la promesa no se sostiene.</li>
        <li><b>Encaje · 15%</b>: que el briefing esté completo (los campos ★).</li>
      </ul>
      <p style="margin:0"><b>Qué lo baja:</b> afirmaciones riesgosas para Meta, ofertas sin garantía y datos ★ sin rellenar.
      <b>Qué lo sube:</b> registrar anuncios reales del ángulo y completar el briefing. Por eso una pieza <i>estimada</i> siempre vale menos que una <i>verificada</i>.</p>
    </div>
  </details>`;
}

/* ---------- pintar el guion como línea de tiempo ---------- */
function vdGuionHTML(p){
  const t = vdTokens({brief: p.brief || {}, id: p.id});
  const g = p.guionCompleto;
  if(!g) return (p.guion||[]).map(l=>vdEsc(l)).join('<br>');
  return `
  <div class="guionmeta">
    <span class="tag">${vdEsc(g.duracion)}</span>
    <span class="tag">${vdEsc(g.estructura)}</span>
  </div>
  <div class="guiontabla">
    ${g.bloques.map(b => `
      <div class="gbloque">
        <div class="gt">
          <b>${vdEsc(b.t)}</b>
          <span>${vdEsc(b.nombre)}</span>
        </div>
        <div class="gc">
          <div><em>Qué se ve</em>${vdEsc(b.ve)}</div>
          ${b.dice && b.dice !== '—' ? `<div><em>Qué se dice</em>${/^[«"]/.test(b.dice) ? vdEsc(b.dice) : '«' + vdEsc(b.dice) + '»'}</div>` : ''}
          ${b.texto && b.texto !== '—' ? `<div><em>Texto en pantalla</em>${vdEsc(b.texto)}</div>` : ''}
        </div>
      </div>`).join('')}
  </div>
  <div class="guioncols">
    <div>
      <b class="gtitle">Cómo grabarlo</b>
      <ul>${g.produccion.map(x=>`<li>${vdEsc(x)}</li>`).join('')}</ul>
    </div>
    <div>
      <b class="gtitle">Qué evitar</b>
      <ul class="evitar">${g.errores.map(x=>`<li>${vdEsc(x)}</li>`).join('')}</ul>
    </div>
  </div>`;
}
