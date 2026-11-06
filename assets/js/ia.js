/* ============================================================
   Conexiones de IA por usuario
   Cada persona conecta SU cuenta en SU navegador. Las llaves
   nunca salen de este equipo: se guardan en localStorage y se
   usan solo para llamar a la API que tú elijas.
   ============================================================ */

const VD_PROVEEDORES = [
  { id:'openai', nombre:'OpenAI', tipo:'openai', base:'https://api.openai.com/v1/chat/completions',
    modelos:['gpt-5','gpt-4.1','gpt-4o'], alta:'platform.openai.com/api-keys', nota:'Pago por uso.' },
  { id:'anthropic', nombre:'Anthropic · Claude', tipo:'anthropic', base:'https://api.anthropic.com/v1/messages',
    modelos:['claude-sonnet-4-5','claude-opus-4-1','claude-haiku-4-5'], alta:'console.anthropic.com', nota:'Pago por uso.' },
  { id:'gemini', nombre:'Google Gemini', tipo:'gemini', base:'https://generativelanguage.googleapis.com/v1beta/models',
    modelos:['gemini-2.5-pro','gemini-2.5-flash'], alta:'aistudio.google.com/apikey', nota:'Tiene nivel gratuito.' },
  { id:'openrouter', nombre:'OpenRouter', tipo:'openai', base:'https://openrouter.ai/api/v1/chat/completions',
    modelos:['anthropic/claude-sonnet-4.5','openai/gpt-5','google/gemini-2.5-pro','x-ai/grok-4','deepseek/deepseek-chat'],
    alta:'openrouter.ai/keys', nota:'Una llave, muchos modelos: ideal para comparar.' },
  { id:'custom', nombre:'Compatible OpenAI (Arena, Groq, LM Studio…)', tipo:'openai', base:'',
    modelos:[''], alta:'', nota:'Escribe la URL base de la API.' }
];

const VD_IA_SECCIONES = [
  ['investigacion','Investigación','Barrido del nicho, anuncios y ángulos.'],
  ['redaccion','Redacción','Copys, ganchos y guiones.'],
  ['analisis','Análisis','Ingeniería inversa y diagnóstico.']
];

/* ---------- almacenamiento ---------- */
const VD_IA_KEY = 'vd_ia_v1';
let vdIAConn = { conexiones:[], activa:{ investigacion:null, redaccion:null, analisis:null } };
let vdIAError = '';

function vdIACargar(){
  try{
    const raw = localStorage.getItem(VD_IA_KEY);
    if(raw) vdIAConn = JSON.parse(raw);
    if(!vdIAConn.conexiones) vdIAConn.conexiones = [];
    if(!vdIAConn.activa) vdIAConn.activa = { investigacion:null, redaccion:null, analisis:null };
  }catch(e){ vdIAError = 'No se pudieron leer las conexiones guardadas.'; }
  return vdIAConn;
}
function vdIAGuardar(){
  try{ localStorage.setItem(VD_IA_KEY, JSON.stringify(vdIAConn)); }
  catch(e){ vdIAError = 'Este navegador no permite guardar las llaves.'; }
}
function vdIAProv(id){ return VD_PROVEEDORES.find(p => p.id === id); }
function vdIAGet(id){ return vdIAConn.conexiones.find(c => c.id === id); }

function vdIAConectar(provId, llave, modelo, etiqueta, baseUrl){
  const p = vdIAProv(provId); if(!p) return null;
  const id = 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
  const conn = {
    id, prov: provId, llave: (llave||'').trim(), modelo: (modelo||p.modelos[0]||'').trim(),
    etiqueta: (etiqueta||'').trim() || (p.nombre + (modelo ? ' · ' + modelo : '')),
    base: (baseUrl||p.base||'').trim(), estado:'sin-probar', creado: new Date().toISOString()
  };
  vdIAConn.conexiones.push(conn);
  const libres = VD_IA_SECCIONES.map(s => s[0]).filter(k => !vdIAConn.activa[k]);
  if(libres.length) vdIAConn.activa[libres[0]] = id;
  vdIAGuardar();
  return conn;
}
function vdIABorrar(id){
  vdIAConn.conexiones = vdIAConn.conexiones.filter(c => c.id !== id);
  VD_IA_SECCIONES.forEach(s => { if(vdIAConn.activa[s[0]] === id) vdIAConn.activa[s[0]] = null; });
  vdIAGuardar();
}
function vdIAAsignar(seccion, id){ vdIAConn.activa[seccion] = id || null; vdIAGuardar(); }
function vdIADe(seccion){ return vdIAGet(vdIAConn.activa[seccion]); }
function vdIAHayAlguna(){ return vdIAConn.conexiones.length > 0; }

/* ---------- llamada a la API ---------- */
async function vdIALlamar(conn, prompt, opts){
  opts = opts || {};
  if(!conn) throw new Error('No hay una IA conectada en esta sección.');
  if(!conn.llave) throw new Error('Esta conexión no tiene llave.');
  const p = vdIAProv(conn.prov) || { tipo:'openai' };
  const sys = opts.sistema || 'Eres un estratega senior de Meta Ads. Respondes en español, concreto y sin relleno.';
  const tokens = opts.tokens || 4000;
  let url, headers, body;

  if(p.tipo === 'anthropic'){
    url = conn.base || p.base;
    headers = { 'content-type':'application/json', 'x-api-key': conn.llave,
      'anthropic-version':'2023-06-01', 'anthropic-dangerous-direct-browser-access':'true' };
    body = { model: conn.modelo, max_tokens: tokens, system: sys,
             messages:[{ role:'user', content: prompt }] };
  } else if(p.tipo === 'gemini'){
    const base = conn.base || p.base;
    url = base + '/' + conn.modelo + ':generateContent?key=' + encodeURIComponent(conn.llave);
    headers = { 'content-type':'application/json' };
    body = { contents:[{ parts:[{ text: sys + '\n\n' + prompt }] }] };
  } else {
    url = conn.base || p.base;
    if(!url) throw new Error('Falta la URL base de la API en esta conexión.');
    headers = { 'content-type':'application/json', 'Authorization':'Bearer ' + conn.llave };
    body = { model: conn.modelo, messages:[{ role:'system', content: sys },{ role:'user', content: prompt }],
             max_tokens: tokens };
  }

  let res;
  try{
    res = await fetch(url, { method:'POST', headers, body: JSON.stringify(body) });
  }catch(e){
    throw new Error('No se pudo conectar con ' + (conn.prov || 'la API') + '. Causas habituales: (1) abriste el archivo con doble clic y el navegador bloquea el origen; ' +
      '(2) la llave no es válida y el proveedor no devuelve la cabecera de permiso, así que el navegador lo muestra como error de red; ' +
      '(3) no hay internet. Prueba desde el servidor local o desde GitHub Pages.');
  }
  const txt = await res.text();
  let json = null; try{ json = JSON.parse(txt); }catch(e){}

  if(!res.ok){
    const msg = (json && (json.error && (json.error.message || json.error)) || txt || '').toString().slice(0, 240);
    if(res.status === 401 || res.status === 403) throw new Error('Llave rechazada (' + res.status + '). ' + msg);
    if(res.status === 429) throw new Error('Límite o saldo agotado (' + res.status + '). Revisa tu cuenta o cambia de IA.');
    throw new Error('Error ' + res.status + ': ' + msg);
  }

  if(p.tipo === 'anthropic') return (json.content && json.content[0] && json.content[0].text) || '';
  if(p.tipo === 'gemini'){
    const c = json && json.candidates && json.candidates[0];
    return (c && c.content && c.content.parts && c.content.parts.map(x => x.text).join('')) || '';
  }
  return (json && json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content) || '';
}

async function vdIAProbar(conn){
  try{
    const r = await vdIALlamar(conn, 'Responde solo con la palabra: conectado', { tokens: 20 });
    conn.estado = 'ok'; conn.ultimo = new Date().toISOString(); conn.error = '';
    vdIAGuardar();
    return { ok:true, texto: (r||'').trim().slice(0,40) };
  }catch(e){
    conn.estado = 'error'; conn.error = e.message; conn.ultimo = new Date().toISOString();
    vdIAGuardar();
    return { ok:false, texto: e.message };
  }
}

/* ---------- comparar dos IA con la misma tarea ---------- */
async function vdIAComparar(prompt, ids){
  return Promise.all(ids.map(async id => {
    const conn = vdIAGet(id);
    const t0 = Date.now();
    try{
      const texto = await vdIALlamar(conn, prompt, { tokens: 1500 });
      return { id, nombre: conn ? conn.etiqueta : id, ok:true, texto, ms: Date.now() - t0 };
    }catch(e){
      return { id, nombre: conn ? conn.etiqueta : id, ok:false, texto: e.message, ms: Date.now() - t0 };
    }
  }));
}

/* ---------- extraer JSON de una respuesta libre ---------- */
function vdParseJSON(txt){
  if(!txt) return null;
  let s = String(txt).trim();
  s = s.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  if(a < 0 || b <= a) return null;
  try{ return JSON.parse(s.slice(a, b + 1)); }catch(e){ return null; }
}

/* ---------- investigación con IA ---------- */
function vdIAPromptInvestigacion(c){ return vdPromptInvestigacion(c); }

/* fusiona un JSON de investigación (venga de una API o pegado a mano) */
function vdFusionarInvestigacion(c, data, etiqueta){
  const pais = (c.brief && c.brief.pais) || 'México';
  const base = vdInvestigar(c);           // expediente local como red de seguridad

  const consultas = (data.consultas || []).map(x => {
    const q = vdShort(x.q || '', 6);
    return { q, tipo: x.tipo || 'nicho', ads: vdLinkAdLibrary(q, pais), tiktok: vdLinkTikTok(q),
             instagram: vdLinkInstagram(q), youtube: vdLinkYouTube(q), trends: vdLinkTrends(q, pais) };
  }).filter(x => x.q);

  const angulos = (data.angulos || [])
    .filter(a => VD_ANGULOS.indexOf(a.angulo) >= 0)
    .map(a => ({ angulo: a.angulo, razon: a.razon || '', fuerza: Math.max(0, Math.min(100, Number(a.fuerza) || 60)) }));

  const anuncios = (data.anuncios || []).filter(a => a.pagina).map(a => ({
    pagina: a.pagina, pais: (a.pais || 'MX').toUpperCase().slice(0,2),
    dias: Number(a.dias) || 0, variantes: Number(a.variantes) || 0,
    objetivo: a.objetivo || '?', formato: a.formato || 'Estático',
    angulo: VD_ANGULOS.indexOf(a.angulo) >= 0 ? a.angulo : 'Identidad',
    nota: a.nota || '',
    /* si la IA lo comprobó en la Biblioteca y lo marcó [VERIFICADO], cuenta como evidencia real */
    origen: /\[?verificad/i.test(a.nota || '') && !/estimad/i.test(a.nota || '') ? 'manual' : 'ia'
  }));

  const research = {
    generado: new Date().toISOString(), pais, ia: etiqueta, porIA: true,
    consultas: consultas.length ? consultas : base.consultas,
    kws: (data.terminos || []).length ? data.terminos : base.kws,
    angulos: angulos.length ? angulos : base.angulos,
    competidores: base.competidores,
    resumen: (consultas.length || angulos.length)
      ? 'Investigación generada por ' + etiqueta + ' a partir de tu briefing: ' + consultas.length +
        ' consultas, ' + (data.terminos||[]).length + ' términos y ' + angulos.length + ' ángulos.' +
        (anuncios.length ? ' Propuso ' + anuncios.length + ' anuncios (sin verificar).' : ' No propuso anuncios: verifícalos con los enlaces.')
      : base.resumen
  };
  const viral = (data.viral || []).filter(v => v.cuenta || v.red).map(v => ({
    red: v.red || 'TikTok', cuenta: v.cuenta || '', views: Number(v.views) || 0,
    likes: Number(v.likes) || 0, comments: Number(v.comments) || 0, shares: Number(v.shares) || 0,
    saves: Number(v.saves) || 0, dias: Number(v.dias) || 0,
    angulo: VD_ANGULOS.indexOf(v.angulo) >= 0 ? v.angulo : 'Identidad'
  }));

  const reversa = (data.reversa || []).map(r => ({
    cuenta: r.cuenta || '', gancho: r.gancho || '', arquetipo: r.arquetipo || '',
    promesa: r.promesa || '', mecanismo: r.mecanismo || '', prueba: r.prueba || '',
    objeciones: r.objeciones || '', estructura: r.estructura || '', cta: r.cta || '',
    formato: r.formato || '', porque: r.porque || ''
  }));

  return { ok:true, research, anuncios, viral, reversa };
}

async function vdInvestigarConIA(c, conn){
  const txt = await vdIALlamar(conn, vdIAPromptInvestigacion(c), { tokens: 4000 });
  const data = vdParseJSON(txt);
  if(!data) return { ok:false, crudo: txt };
  return vdFusionarInvestigacion(c, data, conn.etiqueta);
}
