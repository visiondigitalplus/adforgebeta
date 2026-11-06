# Prueba en vivo · Meta Ads Research OS
_Ejecutada el 6/11/2026, 14:53:17 sobre la app compilada (`app-completa.html`, 156 KB)._

> La app se ejecutó completa: conexión de IA, investigación, generación de las 7 piezas y las cinco vistas. La respuesta del modelo se simuló con una carga realista (no había llave real en este entorno). Todo lo demás es el código de producción.

## 1 · Los cuatro proveedores, comprobados de verdad
Petición real desde fuera del navegador contra cada API, con el encabezado de origen que usaría la app publicada:

| Proveedor | Respuesta al preflight | ¿El navegador puede llamarlo? |
|---|---|---|
| OpenAI | `200` · `access-control-allow-origin: <origen>` | Sí |
| Anthropic | `200` · `access-control-allow-origin: *` (exige la cabecera `anthropic-dangerous-direct-browser-access`) | Sí |
| Google Gemini | `400` con `access-control-allow-origin: <origen>` (el 400 es por la llave falsa, no por CORS) | Sí |
| OpenRouter | `204` · `access-control-allow-origin: *` | Sí |

Y las llaves inválidas devuelven el error correcto: OpenAI `401 Incorrect API key provided`, Gemini `400 API key not valid`. La app los muestra tal cual.

## 2 · Conexión de IA
| Comprobación | Resultado |
|---|---|
| Conectar proveedor | OK — «Mi OpenAI (prueba)», gpt-5 |
| Probar conexión | OK — respuesta: "conectado" |
| Guardado en el navegador | OK — clave `vd_ia_v1`, la llave no sale del equipo |
| Asignación por sección | Investigación → Mi OpenAI |

## 3 · Investigación automática
Expediente generado:
- **14 consultas** verificables
- **12 términos** clasificados por intención
- **6 ángulos** detectados
- **3 anuncios** propuestos (marcados como *sin verificar*)

### Ángulos detectados por la IA
| Fuerza | Ángulo | Razón |
|---|---|---|
| 93 | **Costo de la inacción** | El dueño de negocio hispano suele llevar meses sin vender por redes; mostrar el dinero que se pierde cada semana golpea directo. |
| 89 | **Prueba social** | El nicho está lleno de promesas; un caso con nombre, ciudad y número de leads compra credibilidad al instante. |
| 85 | **Identidad** | Los anuncios genéricos no muestran dueños hispanos reales: identificarse gana la primera mirada. |
| 84 | **Demostración pura** | Enseñar la pantalla del embudo de WhatsApp con leads entrando demuestra que el mecanismo existe. |
| 78 | **Objeción directa** | La objeción #1 es "ya probé Facebook y no sirve"; nombrarla antes de que la piense desactiva el filtro. |
| 74 | **Resultado rápido** | Con $5 al día el resultado es lento: solo funciona si se promete un plazo realista de 14 días. |

### Primeras 6 consultas (con su enlace real de la Biblioteca de Anuncios)
- «agencia de publicidad para negocios hispanos» → [Meta Ads](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=agencia%20de%20publicidad%20para%20negocios%20hispanos&search_type=keyword_unordered&media_type=all)
- «marketing digital para latinos en usa» → [Meta Ads](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=marketing%20digital%20para%20latinos%20en%20usa&search_type=keyword_unordered&media_type=all)
- «cómo conseguir clientes por facebook» → [Meta Ads](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=c%C3%B3mo%20conseguir%20clientes%20por%20facebook&search_type=keyword_unordered&media_type=all)
- «no vendo por redes sociales» → [Meta Ads](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=no%20vendo%20por%20redes%20sociales&search_type=keyword_unordered&media_type=all)
- «clientes todos los días whatsapp» → [Meta Ads](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=clientes%20todos%20los%20d%C3%ADas%20whatsapp&search_type=keyword_unordered&media_type=all)
- «embudo de ventas whatsapp» → [Meta Ads](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=embudo%20de%20ventas%20whatsapp&search_type=keyword_unordered&media_type=all)

## 4 · Las 7 piezas
**IC medio: 74**

| # | Ángulo | Formato | IC | Banda | Evidencia |
|---|---|---|---|---|---|
| 1 | Identidad | Video UGC | **85** | A | estimada |
| 2 | Costo de la inacción | Video UGC | **84** | B | propuesta por IA |
| 3 | Prueba social | Testimonio | **84** | B | propuesta por IA |
| 4 | Demostración pura | Video demo | **84** | B | estimada |
| 5 | Objeción directa | Estático | **66** | C | propuesta por IA |
| 6 | Curiosidad / misterio | Carrusel | **64** | C | estimada |
| 7 | Contra-narrativa | Video UGC | **54** | D | estimada |

### Gancho y procedencia de la pieza #2 (Costo de la inacción)
**Los 3 ganchos generados:**
1. Cada mes que pasa esto sale más caro. Y el motivo es este: pocas o cero ventas por falta de publicidad.
2. El error del segundo 4 que arruina publicidad en redes para negocios hispanos.
3. Si te está pasando esto, es para ti: pocas o cero ventas por falta de publicidad.

> **Copy:** Cada mes que pasa esto sale más caro. Y el motivo es este: pocas o cero ventas por falta de publicidad. Campañas segmentadas + embudo de WhatsApp. Clientes potenciales y ventas según el objetivo.

**Procedencia:** De dónde salió esta pieza Ángulo: Costo de la inacción — El dueño de negocio hispano suele llevar meses sin vender por redes; mostrar el dinero que se pierde cada semana golpea directo. Término que la origina: «agencia de publicidad para latinos en estados unidos» (Google, Comercial) Estado de la evidencia: Propuesta por IA, sin verificar : Agencia Hispana Demo. Abre los enlaces y confirma en la Biblioteca de Anuncios antes de dar esta pieza por buena. Formato: Video UGC · Nivel de conciencia: 2 · Consciente del problema Comprobar ahora: Meta Ads ↗ TikTok ↗ Google ↗

## 5 · Integridad del dato
- Los 3 anuncios propuestos por la IA **no** cuentan como verificados: el IC sigue siendo conservador.
- La pieza lo dice con claridad: *«Propuesta por IA, sin verificar»*.
- Cuando registres a mano un anuncio con 30+ días, esa pieza pasa a **verificada** y su IC sube.

## 6 · Vistas renderizadas
Inicio · Conexiones · Briefing · Investigación · Entrega — todas sin errores.