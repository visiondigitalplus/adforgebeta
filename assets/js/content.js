/* ============================================================
   Diccionario creativo: ángulos, arquetipos, formatos, guiones.
   Fuente: docs/07. Si cambias aquí, cambia el diccionario también.
   ============================================================ */

const VD_ANGULOS = [
  'Resultado rápido','Evitar dolor o error','Curiosidad / misterio','Prueba social','Contra-narrativa',
  'Autoridad','Antes/Después implícito','Costo de la inacción','Precio / valor','Identidad',
  'Historia personal','Demostración pura','Objeción directa','Comparativa','Miedo a perder',
  'Pertenencia','Estatus','Micro-especificidad','Oferta / urgencia'
];

const VD_FORMATOS = ['Video UGC','Video demo','Testimonio','Carrusel','Estático'];

const VD_CONCIENCIA = [
  '1 · Inconsciente','2 · Consciente del problema','3 · Consciente de la solución',
  '4 · Consciente del producto','5 · Listo para comprar'
];

const VD_ARQ = {
  contraintuitivo: t => `Deja de hacer lo de siempre. Es la causa real de esto: ${t.dolor}.`,
  directo:        t => `Si te está pasando esto, es para ti: ${t.dolor}.`,
  misterio:       t => `Nadie te dice esto sobre ${t.nicho}.`,
  antesdespues:   t => `Hace 30 días estaba así. Hoy buscaba esto: ${t.deseo}.`,
  prueba:         t => `+300 personas ya empezaron. Y todas querían lo mismo: ${t.deseo}.`,
  autoridad:      t => `Lo que los especialistas dicen de ${t.nicho} y casi nadie aplica.`,
  costo:          t => `Cada mes que pasa esto sale más caro. Y el motivo es este: ${t.dolor}.`,
  contra:         t => `Las soluciones típicas para ${t.nicho} no funcionan. Te explico por qué.`,
  demo:           t => `Mira esto en 20 segundos: ${t.meca}.`,
  historia:       t => `Yo también empecé así: ${t.dolor}. Hoy busco esto: ${t.deseo}.`,
  espejo:         t => `¿Por qué sigue pasando esto? La respuesta está aquí: ${t.dolor}.`,
  micro:          t => `El error del segundo 4 que arruina ${t.nicho}.`,
  curiosidad:     t => `Esto es lo que nadie te muestra: ${t.dolor}.`
};

/* Plan del lote: [ángulo, formato, conciencia, arquetipo1, arquetipo2, perfil, rangos de evidencia] */
const VD_PLAN = [
  {a:'Identidad',f:'Video UGC',c:'3 · Consciente de la solución',q1:'historia',q2:'espejo',tier:'A',ev:[98,100],es:[94,100],eo:[92,99],en:[94,100]},
  {a:'Costo de la inacción',f:'Video UGC',c:'2 · Consciente del problema',q1:'costo',q2:'micro',tier:'A',ev:[96,100],es:[90,98],eo:[88,96],en:[92,99]},
  {a:'Prueba social',f:'Testimonio',c:'4 · Consciente del producto',q1:'prueba',q2:'antesdespues',tier:'A',ev:[95,100],es:[88,97],eo:[86,95],en:[90,98]},
  {a:'Demostración pura',f:'Video demo',c:'4 · Consciente del producto',q1:'demo',q2:'micro',tier:'A',ev:[94,100],es:[86,96],eo:[85,94],en:[88,97]},
  {a:'Objeción directa',f:'Estático',c:'4 · Consciente del producto',q1:'espejo',q2:'directo',tier:'B',ev:[72,86],es:[38,58],eo:[64,84],en:[76,90]},
  {a:'Curiosidad / misterio',f:'Carrusel',c:'3 · Consciente de la solución',q1:'misterio',q2:'curiosidad',tier:'B',ev:[70,84],es:[36,56],eo:[62,82],en:[74,88]},
  {a:'Contra-narrativa',f:'Video UGC',c:'3 · Consciente de la solución',q1:'contra',q2:'contraintuitivo',tier:'C',ev:[42,60],es:[10,30],eo:[56,76],en:[58,78]},
  {a:'Resultado rápido',f:'Carrusel',c:'2 · Consciente del problema',q1:'antesdespues',q2:'curiosidad',tier:'B',ev:[68,82],es:[34,52],eo:[60,80],en:[72,86]},
  {a:'Objeción directa',f:'Video UGC',c:'4 · Consciente del producto',q1:'espejo',q2:'directo',tier:'B',ev:[66,80],es:[32,50],eo:[58,78],en:[70,85]},
  {a:'Autoridad',f:'Carrusel',c:'3 · Consciente de la solución',q1:'autoridad',q2:'contra',tier:'B',ev:[64,80],es:[30,48],eo:[56,76],en:[68,84]},
  {a:'Curiosidad / misterio',f:'Estático',c:'1 · Inconsciente',q1:'misterio',q2:'micro',tier:'C',ev:[50,66],es:[20,38],eo:[52,72],en:[62,80]},
  {a:'Historia personal',f:'Video UGC',c:'1 · Inconsciente',q1:'historia',q2:'antesdespues',tier:'C',ev:[48,64],es:[18,36],eo:[50,70],en:[60,78]},
  {a:'Precio / valor',f:'Estático',c:'5 · Listo para comprar',q1:'directo',q2:'prueba',tier:'C',ev:[46,62],es:[16,34],eo:[48,68],en:[58,76]},
  {a:'Micro-especificidad',f:'Video UGC',c:'3 · Consciente de la solución',q1:'micro',q2:'curiosidad',tier:'D',ev:[34,52],es:[10,26],eo:[42,62],en:[52,70]}
];

const VD_CTAS = {
  'Ventas':['Compra hoy y recibe el bonus sin costo','Ver precios y garantía'],
  'Prospectos':['Reserva tu diagnóstico sin costo','Descarga la guía completa'],
  'Mensajes':['Escríbenos "QUIERO" y te paso el plan','Manda un mensaje y te digo si aplica a tu caso'],
  'Tráfico':['Mira la comparación completa','Lee el desglose paso a paso'],
  'Interacción':['Comenta "GUÍA" y te la envío','Guarda esto para cuando lo necesites'],
  'Reconocimiento':['Conoce cómo trabajamos','Sigue para ver la siguiente fase']
};

const VD_IMG_ARTE = [
  'fotografía documental realista, sin retoque evidente',
  'estilo editorial limpio, fondo neutro con sombra suave',
  'plano publicitario en contexto real de uso',
  'composición minimalista con mucho aire y un solo sujeto'
];
const VD_IMG_LUZ = ['luz natural de ventana','luz suave de estudio con rebote','luz cálida de tarde, contraste bajo','luz lateral dramática pero amable'];
const VD_IMG_PAL = ['paleta neutra con un acento dorado','tonos tierra y beige','paleta fría con acento cálido','blancos cálidos y sombras profundas'];

function vdTokens(exp){
  const b = exp.brief || {};
  return {
    nicho: b.subnicho || b.producto || 'tu categoría',
    producto: b.producto || 'tu producto',
    dolor: b.dolor || b.avatar || 'tu problema',
    deseo: b.deseo || b.promesa || 'el resultado que buscas',
    meca: b.mecanismo || 'nuestro método',
    promesa: b.promesa || 'el resultado que prometes',
    pais: b.pais || 'tu país',
    precio: b.precio || 'el precio',
    avatar: b.avatar || 'tu cliente'
  };
}

function vdGuion(formato, t, ctas){
  if(formato==='Video demo') return [
    `0-2 s · RESULTADO: el "después" en pantalla, sin explicación todavía.`,
    `2-6 s · PROBLEMA: "${t.dolor}" dicho en las palabras del cliente.`,
    `6-14 s · DEMOSTRACIÓN: ${t.meca} paso a paso, con las manos y el producto en cuadro.`,
    `14-20 s · PRUEBA: dato o mini-testimonio que confirma lo que se acaba de ver.`,
    `20-28 s · CTA: "${ctas[0]}" + oferta y garantía en pantalla.`
  ];
  if(formato==='Testimonio') return [
    `0-3 s · GANCHO: la frase más fuerte del testimonio, a cámara, sin introducción.`,
    `3-8 s · CONTEXTO: quién es y cómo estaba antes ("${t.dolor}").`,
    `8-14 s · PUNTO DE GIRO: qué probó y por qué desconfiaba (objeción real).`,
    `14-20 s · RESULTADO: qué cambió, con detalle concreto y medible.`,
    `20-26 s · RECOMENDACIÓN: a quién se lo diría y por qué.`,
    `26-32 s · CTA: "${ctas[0]}".`
  ];
  if(formato==='Carrusel') return [
    `Slide 1 · Portada-gancho: titular de máximo 7 palabras, una sola idea.`,
    `Slide 2 · Síntoma: cómo se siente hoy "${t.dolor}" (escena concreta).`,
    `Slide 3 · Por qué lo típico falla: la objeción en palabras del cliente.`,
    `Slide 4 · Mecanismo: ${t.meca} en 3 pasos numerados.`,
    `Slide 5 · Prueba: resultado, dato o testimonio (una sola prueba, grande).`,
    `Slide 6 · Oferta: ${t.promesa}.`,
    `Slide 7 · CTA: "${ctas[0]}" + garantía.`
  ];
  if(formato==='Estático') return [
    `Titular (máx. 7 palabras): el gancho completo, sin adorno.`,
    `Subtítulo de apoyo: la promesa con plazo ("${t.promesa}").`,
    `Prueba en una línea: dato, cifra o número de clientes.`,
    `CTA sobre la imagen y CTA en el copy: el mismo verbo, no dos distintos.`,
    `Dirección de arte: un solo sujeto, contraste alto, legible en miniatura.`
  ];
  return [
    `0-3 s · GANCHO: primera frase a cámara, movimiento desde el frame 1.`,
    `3-8 s · PROMESA: qué cambia y en cuánto tiempo ("${t.promesa}").`,
    `8-15 s · MECANISMO: ${t.meca} en 3 pasos, sin jerga.`,
    `15-22 s · PRUEBA + OBJECIÓN: se derriba la objeción principal con evidencia real.`,
    `22-30 s · CTA: "${ctas[0]}" + cierre con la oferta.`
  ];
}

function vdPromptImg(formato, t, i){
  const ratio = (formato==='Estático'||formato==='Carrusel') ? '4:5' : '9:16';
  const sujeto = formato==='Testimonio'
    ? `persona real del público objetivo (${t.avatar.slice(0,70)}) en su entorno cotidiano`
    : formato==='Video demo'
      ? `manos usando ${t.producto} en primer plano, movimiento real`
      : `persona del público objetivo (${t.avatar.slice(0,70)}) en una escena reconocible de su día`;
  return `${VD_IMG_ARTE[i%VD_IMG_ARTE.length]}: ${sujeto}, ${VD_IMG_LUZ[i%VD_IMG_LUZ.length]}, ${VD_IMG_PAL[i%VD_IMG_PAL.length]}, plano ${formato==='Carrusel'?'medio vertical':'medio'}, formato ${ratio}. Negativos: sin texto, sin logos, sin marcas de agua, sin manos deformes, sin piel plástica.`;
}

function vdPromptVid(formato, t){
  return `Escena 1 (0-3 s): ${formato==='Video demo'?'resultado ya visible, cámara en mano, sin trípode':'rostro real mirando a cámara, gesto genuino, movimiento desde el primer frame'}. Escena 2 (3-8 s): contexto del problema, plano medio, luz natural. Escena 3 (8-15 s): ${t.meca} en 3 cortes de 1,5 s con subtítulos quemados. Cierre: producto + CTA en pantalla. Audio: voz real, sin locución publicitaria.`;
}

function vdCompliance(exp){
  const b = exp.brief || {};
  const txt = `${b.producto||''} ${b.subnicho||''} ${b.promesa||''} ${b.mecanismo||''} ${b.restricciones||''}`.toLowerCase();
  if(/(salud|médic|medic|peso|adelgaz|dieta|dolor|enfermedad|cura|terapia|clínic|suplemento|estétic|ansiedad|dérmic)/.test(txt))
    return {nivel:'Alto', pen:6, nota:'Categoría salud: sin promesas de curación, sin resultados garantizados y sin antes/después explícito. Evita atributos personales del tipo "¿tienes sobrepeso?".'};
  if(/(dinero|finanz|inversión|inversion|crédito|credito|préstamo|prestamo|ganar|cripto|trading|forex|rentabilidad|ingresos)/.test(txt))
    return {nivel:'Alto', pen:6, nota:'Categoría financiera: prohibido prometer ingresos o rendimientos garantizados. Usa rangos y agrega disclaimer.'};
  if((b.restricciones||'').trim())
    return {nivel:'Medio', pen:2, nota:'Hay restricciones declaradas en el briefing: revísalas antes de producir.'};
  return {nivel:'Bajo', pen:0, nota:'Sin señales de categoría especial. Verifica igualmente las políticas de Meta antes de publicar.'};
}


/* ============================================================
   GUION COMPLETO por formato
   Cada bloque: tiempo · qué se ve · qué se dice · qué texto va
   ============================================================ */
function vdGuionCompleto(formato, t, ctas, pieza){
  const g1 = (pieza && pieza.ganchos && pieza.ganchos[0]) || '';
  const g2 = (pieza && pieza.ganchos && pieza.ganchos[1]) || '';

  const base = {
    plano: 'Celular en vertical 9:16, a la altura de los ojos, a un brazo de distancia.',
    luz: 'Luz de ventana o lámpara de frente. Nunca de espaldas.',
    audio: 'Micrófono de corbata o el del celular a 30 cm. Sin música de fondo en los primeros 3 segundos.',
    texto: 'Subtítulos quemados, tamaño grande, en la mitad inferior de la pantalla.'
  };

  if(formato === 'Video demo') return {
    duracion: '25–35 s', estructura: 'Demostración sin rodeos',
    bloques: [
      { t:'0–2 s', nombre:'Resultado primero',
        ve:'El "después" ya funcionando. Manos y producto en cuadro, nada de logos.',
        dice:`«${t.promesa}»`,
        texto:'Texto en pantalla de 4 palabras máximo, arriba y centrado.' },
      { t:'2–6 s', nombre:'El problema en palabras del cliente',
        ve:'Plano del mismo escenario, pero en el "antes". Corte seco, sin transición.',
        dice:`«${t.dolor}»`,
        texto:'Nada. Se deja respirar la imagen.' },
      { t:'6–16 s', nombre:'El mecanismo, paso a paso',
        ve:`${t.meca}, grabado de cerca. Tres cortes, uno por paso. Cada paso en pantalla.`,
        dice:'Explicas qué haces y por qué, sin tecnicismos: "primero…, después…, por último…".',
        texto:'Paso 1 · Paso 2 · Paso 3, numerados en el borde superior.' },
      { t:'16–22 s', nombre:'La prueba',
        ve:'El resultado medible: número, captura, antes/después lado a lado.',
        dice:'Un dato concreto. Un número vale más que un adjetivo.',
        texto:'El número, grande, en el centro.' },
      { t:'22–30 s', nombre:'CTA',
        ve:'Vuelta al plano inicial, ahora con el producto en la mano.',
        dice:`«${ctas[0]}»`,
        texto:'CTA + qué pasa al pulsar. Sin letra pequeña.' }
    ],
    produccion:[base.plano, base.luz, base.audio, base.texto,
      'Graba el mecanismo 3 veces y elige la toma más limpia: la imperfección se nota.'],
    errores:['No empieces presentándote.', 'No pongas música épica: distrae del mecanismo.',
      'No cortes antes de que se entienda el resultado.']
  };

  if(formato === 'Testimonio') return {
    duracion: '30–40 s', estructura: 'Testimonio real, sin guion leído',
    bloques: [
      { t:'0–3 s', nombre:'La frase más fuerte',
        ve:'Cliente a cámara, plano medio, mirando al lente. Empieza a media frase.',
        dice:`La frase más contundente de su testimonio. Ejemplo: «${t.dolor}» ya no es mi problema.`,
        texto:'Cita literal entre comillas, encima del sujeto.' },
      { t:'3–9 s', nombre:'Quién es y cómo estaba',
        ve:'B-roll: su negocio, su casa, su rutina. Sirve para que el público se reconozca.',
        dice:'Nombre, ciudad y en qué situación estaba antes.',
        texto:'Nombre · ciudad · ocupación.' },
      { t:'9–15 s', nombre:'La desconfianza',
        ve:'Vuelta al plano a cámara. Aquí no hay b-roll: la cara sostiene la credibilidad.',
        dice:'Qué le hizo dudar antes de comprar. Que lo diga él, no tú.',
        texto:'Nada durante 2 s: deja que la cara hable.' },
      { t:'15–24 s', nombre:'El resultado concreto',
        ve:'La prueba en pantalla mientras habla: mensaje, número, foto del antes y el después.',
        dice:'Qué cambió y en cuánto tiempo. Con números si existen.',
        texto:'El dato, destacado.' },
      { t:'24–31 s', nombre:'A quién se lo recomienda',
        ve:'Plano abierto con el cliente en su entorno.',
        dice:'«Se lo recomiendo a quien…» — esto segmenta solo.',
        texto:'Nada.' },
      { t:'31–36 s', nombre:'CTA',
        ve:'Cierre en el producto o la marca.',
        dice:`«${ctas[0]}»`,
        texto:'CTA sobre banda de color.' }
    ],
    produccion:[base.plano, base.luz, base.audio, base.texto,
      'No le des el guion al cliente: hazle preguntas y corta. El testimonio leído no vende.'],
    errores:['No pongas al dueño hablando por el cliente.', 'No exageres el resultado: se nota.',
      'No ocultes que es un cliente real.']
  };

  if(formato === 'Carrusel') return {
    duracion: '5 slides', estructura: 'Historia en 5 pasos',
    bloques: [
      { t:'Slide 1', nombre:'Portada-gancho',
        ve:'Imagen fuerte y titular grande. Debe entenderse en 1 segundo sin deslizar.',
        dice:g1,
        texto:'Máximo 7 palabras. Sin logo en el centro.' },
      { t:'Slide 2', nombre:'El síntoma',
        ve:'Escena concreta del dolor, no un icono.',
        dice:`«${t.dolor}»`,
        texto:'Una frase, en primera persona.' },
      { t:'Slide 3', nombre:'Por qué lo típico falla',
        ve:'Comparativa visual simple: lo normal tachado.',
        dice:'La objeción en palabras del cliente, y por qué no aplica aquí.',
        texto:'❌ lo típico · ✅ lo que hacemos' },
      { t:'Slide 4', nombre:'El mecanismo',
        ve:'3 pasos numerados con flechas. Se entiende sin leer el copy.',
        dice:`${t.meca}, en tres pasos.`,
        texto:'1 · 2 · 3' },
      { t:'Slide 5', nombre:'Prueba + CTA',
        ve:'Resultado real y botón visual.',
        dice:`«${t.promesa}»`,
        texto:'CTA claro y qué pasa después.' }
    ],
    produccion:['1080×1350 (4:5) para feed, 1080×1080 si dudas.',
      'Misma tipografía y misma paleta en los 5 slides: parece una sola pieza.',
      'Texto grande: se lee en un móvil a 30 cm.',
      'El slide 1 decide todo: si no frena el scroll, los otros cuatro no existen.'],
    errores:['No repitas el mismo texto en todos los slides.', 'No pongas más de 20 palabras por slide.',
      'No termines sin CTA.']
  };

  if(formato === 'Estático') return {
    duracion: '1 imagen', estructura: 'Cartel que se lee en 3 segundos',
    bloques: [
      { t:'Zona 1 · arriba', nombre:'Titular',
        ve:'Texto grande, 5–7 palabras, alineado a la izquierda.',
        dice:g1,
        texto:'Es lo único que se lee en el feed. Que detenga el scroll.' },
      { t:'Zona 2 · centro', nombre:'Imagen con prueba',
        ve:'Foto real del producto o del resultado. Nada de stock.',
        dice:'—',
        texto:'Si hay número, va aquí y grande.' },
      { t:'Zona 3 · abajo', nombre:'Oferta y CTA',
        ve:'Banda de color con contraste alto.',
        dice:`«${ctas[1]}»`,
        texto:'Qué obtiene, cuánto cuesta y qué hacer.' },
      { t:'Zona 4 · esquina', nombre:'Marca',
        ve:'Logo pequeño, una sola vez.',
        dice:'—',
        texto:'Si el anuncio funciona, la marca se recuerda igual.' }
    ],
    produccion:['1080×1350 (4:5): ocupa más pantalla en el feed.',
      'Contraste alto: fondo oscuro con texto claro o al revés, sin degradados suaves.',
      'Una sola idea por imagen. Si necesitas dos, son dos anuncios.',
      'Deja 14% de margen arriba y abajo: Meta recorta.'],
    errores:['No pongas párrafos.', 'No uses más de dos tipografías.',
      'No escondas el precio si es tu ventaja.']
  };

  /* Video UGC por defecto */
  return {
    duracion: '28–35 s', estructura: 'Historia en primera persona',
    bloques: [
      { t:'0–3 s', nombre:'Gancho',
        ve:'Rostro a cámara, plano medio abierto, sin logo ni intro. Se empieza a media frase.',
        dice:`«${g1}»`,
        texto:'3–5 palabras, arriba. Nunca tapes la boca.' },
      { t:'3–8 s', nombre:'El problema',
        ve:'B-roll del dolor: la escena real, no un icono.',
        dice:`«${t.dolor}» — dicho como lo diría el cliente, no como lo diría una marca.`,
        texto:'Nada. Deja que la imagen hable.' },
      { t:'8–14 s', nombre:'El giro',
        ve:'Corte al hablante. Cambia el tono: de queja a solución.',
        dice:'Qué probó y por qué esta vez fue distinto.',
        texto:'«Hasta que…»' },
      { t:'14–22 s', nombre:'El mecanismo',
        ve:'Manos y pantalla: el mecanismo en acción.',
        dice:`${t.meca}, explicado como se lo contarías a un amigo.`,
        texto:'Los 3 pasos, numerados y pequeños.' },
      { t:'22–28 s', nombre:'La prueba',
        ve:'Resultado real en pantalla: captura, número, foto.',
        dice:`«${t.promesa}»`,
        texto:'El número, grande.' },
      { t:'28–33 s', nombre:'CTA',
        ve:'Vuelta al plano inicial, ahora con seguridad.',
        dice:`«${ctas[0]}»`,
        texto:'CTA + siguiente paso concreto.' }
    ],
    produccion:[base.plano, base.luz, base.audio, base.texto,
      'Graba 3 versiones del gancho y prueba las 3: el primer segundo decide el 80% del resultado.'],
    errores:['No empieces con "hola, soy…".', 'No uses música alta en el gancho.',
      'No expliques el mecanismo antes de que duela el problema.']
  };
}
