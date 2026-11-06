/* ============================================================
   Persistencia local. Sin servidor, sin cuenta, sin internet.
   Guarda en el navegador y permite exportar/importar toda la base.
   ============================================================ */
const VD_KEY = 'vd_research_os_v1';

const vdDB = {
  data: { version:1, creado:new Date().toISOString(), clientes: [] },
  disponible: true,

  load(){
    try{
      const raw = localStorage.getItem(VD_KEY);
      if(raw){
        const p = JSON.parse(raw);
        if(p && p.clientes) this.data = p;
      }
    }catch(e){
      this.disponible = false;
      console.warn('Sin almacenamiento disponible. La app funciona, pero no guarda.', e);
    }
    return this.data;
  },

  save(){
    if(!this.disponible) return false;
    try{
      this.data.actualizado = new Date().toISOString();
      localStorage.setItem(VD_KEY, JSON.stringify(this.data));
      return true;
    }catch(e){
      this.disponible = false;
      return false;
    }
  },

  uid(){ return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2,6); },

  clientes(){ return this.data.clientes; },

  cliente(id){ return this.data.clientes.find(c => c.id === id); },

  crear(nombre, brief){
    const c = {
      id: this.uid(),
      nombre: nombre || 'Cliente sin nombre',
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
      ia: 'Arena',
      estado: 'nuevo',
      brief: brief || vdBriefVacio(),
      ads: [], kws: [], viral: [], rev: [], piezas: []
    };
    this.data.clientes.unshift(c);
    this.save();
    return c;
  },

  eliminar(id){
    this.data.clientes = this.data.clientes.filter(c => c.id !== id);
    this.save();
  },

  duplicar(id){
    const c = this.cliente(id); if(!c) return null;
    const copia = JSON.parse(JSON.stringify(c));
    copia.id = this.uid();
    copia.nombre = c.nombre + ' (copia)';
    copia.creado = new Date().toISOString();
    this.data.clientes.unshift(copia);
    this.save();
    return copia;
  },

  exportar(){
    return JSON.stringify(this.data, null, 2);
  },

  importar(txt){
    const p = JSON.parse(txt);
    if(!p || !p.clientes) throw new Error('El archivo no tiene el formato esperado.');
    this.data = p;
    this.save();
    return p.clientes.length;
  },

  resetear(){
    this.data = { version:1, creado:new Date().toISOString(), clientes: [] };
    try{ localStorage.removeItem(VD_KEY); }catch(e){}
  }
};

function vdBriefVacio(){
  return {
    producto:'', precio:'', avatar:'', pais:'México', promesa:'', objetivo:'Ventas',
    presupuesto:'', subnicho:'', dolor:'', deseo:'', mecanismo:'', referencias:'',
    restricciones:'', garantia:'', prueba:[], produccion:[]
  };
}

/* ---------- datos de demostración ---------- */
function vdDemo(){
  const c = vdDB.crear('Visión Digital (demo)', {
    producto:'Programa online de movilidad para espalda',
    precio:'97 USD',
    avatar:'Mujeres de 35 a 50 años que se despiertan con dolor de espalda, ya probaron estiramientos y creen que es la edad',
    pais:'México',
    promesa:'Volver a moverte sin dolor en 21 días con 10 minutos al día',
    objetivo:'Ventas',
    presupuesto:'900',
    subnicho:'dolor lumbar en mujeres de 35 a 50',
    dolor:'despertarse con dolor de espalda y no poder agacharse',
    deseo:'volver a moverse sin dolor y jugar con sus hijos',
    mecanismo:'método de 3 fases sin impacto articular',
    referencias:'@fisio_real, @muevete.mejor',
    restricciones:'salud: sin promesas de curación ni antes/después explícito',
    garantia:'30 días de garantía',
    prueba:['testimonio','demo'],
    produccion:['video','ugc']
  });
  c.estado = 'investigando';
  c.ads = [
    {pagina:'Centro Movilidad MX', pais:'MX', dias:112, variantes:8, objetivo:'Ventas', formato:'Video UGC', angulo:'Identidad', viral:82, fit:5},
    {pagina:'Espalda Sana', pais:'MX', dias:74, variantes:5, objetivo:'Mensajes', formato:'Video UGC', angulo:'Costo de la inacción', viral:71, fit:4},
    {pagina:'Rehab Total', pais:'MX', dias:95, variantes:11, objetivo:'Ventas', formato:'Testimonio', angulo:'Prueba social', viral:77, fit:4},
    {pagina:'Fisio en Casa', pais:'MX', dias:31, variantes:2, objetivo:'Ventas', formato:'Video demo', angulo:'Demostración pura', viral:58, fit:5}
  ];
  c.kws = [
    {termino:'cómo quitar el dolor de espalda sin pastillas', fuente:'IA', intencion:'Informativa', uso:'Gancho'},
    {termino:'ejercicios para dolor lumbar en casa', fuente:'Google', intencion:'Informativa', uso:'Cuerpo'},
    {termino:'por qué me duele la espalda al despertar', fuente:'AnswerThePublic', intencion:'Informativa', uso:'Objeción'}
  ];
  c.viral = [
    {red:'TikTok', cuenta:'@fisio_real', views:820000, likes:74000, comments:1900, shares:6100, saves:21000, dias:14, formato:'Video UGC', angulo:'Identidad'},
    {red:'Instagram', cuenta:'@muevete.mejor', views:145000, likes:12800, comments:640, shares:2100, saves:8900, dias:9, formato:'Video UGC', angulo:'Costo de la inacción'}
  ];
  c.rev = [{
    url:'', gancho:'"Tu espalda no se arregla con pastillas. Se arregla con estos 3 movimientos."', arquetipo:'Contraintuitivo',
    promesa:'Alivio perceptible en 10 minutos al día durante 7 días', mecanismo:'3 fases: descompresión, activación, sostenimiento',
    prueba:'Demostración en cámara + testimonio de 30 s', objeciones:'"no tengo tiempo" al segundo 12',
    estructura:'0-3 gancho · 3-8 promesa · 8-15 mecanismo · 15-22 objeción · 22-30 CTA',
    cta:'"Comenta ESPALDA y te mando la rutina"', formato:'Video UGC vertical', porque:'Rompe la creencia dominante y da una acción barata de probar'
  }];
  /* expediente de ejemplo: simula una investigación ya hecha */
  c.research = vdInvestigar(c);
  c.research.porIA = true;
  c.research.ia = 'Arena (demo)';
  c.ads = [
    {pagina:'Agencia Hispana Demo', pais:'US', dias:47, variantes:5, objetivo:'Prospectos',
     formato:'Vídeo UGC', angulo:'Costo de la inacción', nota:'', origen:'manual'},
    {pagina:'Marketing Latina Co', pais:'US', dias:31, variantes:3, objetivo:'Mensajes',
     formato:'Testimonio', angulo:'Prueba social', nota:'', origen:'manual'}
  ];
  c.kws = c.research.kws.slice(0, 8).map(k => ({...k}));

  c.piezas = vdBuildPieces(c, 7);
  vdDB.save();
  return c;
}
