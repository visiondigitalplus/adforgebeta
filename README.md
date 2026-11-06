# AdForge · Content & Ads Studio
### Una herramienta de **Visión Digital**

Sistema para investigar el mercado, generar anuncios ganadores de Meta y entregarlos rankeados por probabilidad de rendir.
Funciona **en tu computadora** y **en la nube (GitHub)**, con el mismo código y sin instalar nada.

---

## 1. Probarla ahora mismo

### Opción rápida (la más simple)
Abre el archivo **`app-completa.html`** con doble clic. Se abre en tu navegador y ya está funcionando.
Ese archivo tiene todo dentro: estilos, lógica y el logo. No necesita internet, ni instalar nada, ni servidor.

> Puedes copiarlo a un pendrive o enviarlo por WhatsApp y funciona igual.

### Opción con servidor local (recomendada para trabajo diario)
Algunos navegadores guardan mejor los datos cuando la app corre en un servidor local.

- **Mac:** doble clic en `start-local.command` (la primera vez, si no abre, clic derecho → Abrir).
- **Windows:** doble clic en `start-local.bat` (necesita Python instalado; si no lo tienes, usa la opción rápida).
- **Manual:** abre una terminal en esta carpeta y escribe `python3 -m http.server 8080`, luego entra a `http://localhost:8080`.

---

## 2. Publicarla en GitHub (para usarla desde cualquier lugar)

El repositorio ya viene preparado con la publicación automática configurada. No necesitas saber programar ni usar la terminal: todo se hace desde la web de GitHub.

### Paso 1 · Crear la cuenta y el repositorio
1. Entra a [github.com](https://github.com) y crea una cuenta (o inicia sesión).
2. Arriba a la derecha: **+ → New repository**.
3. Nombre: `meta-ads-research-os`. Marca **Public**. Pulsa **Create repository**.

### Paso 2 · Subir los archivos
1. En el repositorio vacío, pulsa **uploading an existing file** (o **Add file → Upload files**).
2. Arrastra **todo el contenido de esta carpeta** (la carpeta `assets`, y los archivos `index.html`, `app-completa.html`, `README.md`, `start-local.bat`, `start-local.command`, `construir.py`, `.gitignore`).
   - Importante: sube la carpeta `assets` **con sus subcarpetas** `css` y `js` dentro.
   - La carpeta `.github` es opcional subirla por arrastre; si no aparece, no pasa nada: se usa el paso 3-B.
3. Abajo, pulsa **Commit changes**.

### Paso 3 · Activarla como página web
**3-A (con publicación automática, si subiste la carpeta `.github`)**
1. Ve a **Settings → Pages**.
2. En *Source*, elige **GitHub Actions**. Listo: cada vez que cambies algo, se publica solo.

**3-B (la forma simple, sin Actions)**
1. Ve a **Settings → Pages**.
2. En *Source*, elige **Deploy from a branch**.
3. Branch: **main** · carpeta: **/ (root)** · **Save**.
4. Espera un minuto y recarga: arriba aparecerá tu enlace.

### Paso 4 · Tu enlace
Quedará así:

```
https://TU-USUARIO.github.io/meta-ads-research-os/
```

Ese enlace lo puedes abrir desde el celular, la tablet o cualquier computadora, y mandarlo a quien quieras.

---

## 3. Cómo se usa (cinco minutos)

1. **Clientes → + Nuevo cliente.** Ponle nombre.
2. **Briefing.** Llena los 7 datos obligatorios (los que tienen `*`). Los que tienen `★` son opcionales pero **suben el Índice de Confianza de todas las piezas**.
3. **Investigación.** Pulsa **Investigar este nicho** y verás el proceso en vivo (6 etapas). El sistema arma solo:
   - **13–16 consultas** para la Biblioteca de Anuncios de Meta, ya filtradas por tu país y por estado *Activo*, con enlaces directos.
   - **Términos de búsqueda** clasificados por intención.
   - **8 ángulos detectados** con su razón y su fuerza.
   - Enlaces de comprobación a Meta, TikTok, Instagram, YouTube y Google Trends.

   Abre los enlaces, verifica y anota lo que confirmes en las tablas de abajo: eso convierte el IC de **estimado** en **verificado**.
   También hay un botón para **copiar el prompt de investigación** y correrlo en tu IA con acceso a internet.
4. **Entrega.** Salen 7 anuncios ordenados de mayor a menor probabilidad, con gancho, copy, guion, CTAs, prompts de imagen y video, métrica de corte y compliance.
   Cada pieza trae un bloque de **“De dónde salió esta pieza”**: el ángulo, el término que la origina, el estado de su evidencia y los enlaces para comprobarlo a mano.
5. **Imprimir / PDF.** Genera el documento limpio para enviar al cliente. También puedes copiar el Markdown o descargar el JSON.

---

## 4. Dónde se guardan los datos

En **este navegador** (almacenamiento local). No se envía nada a ningún servidor: tus clientes y sus briefings no salen de tu computadora.

Consecuencias prácticas:
- Si borras los datos del navegador, se pierde todo → **usa “Exportar base (.json)”** de vez en cuando.
- Para trabajar en otra computadora: exporta la base y usa **Importar base** allí.
- En la versión publicada en GitHub, los datos viven en **ese** navegador, no en GitHub. La nube sirve el programa, no tu información.

---

## 5. Estructura del proyecto

```
meta-ads-research-os/
├── app-completa.html      ← la app entera en un archivo (doble clic y listo)
├── index.html             ← la misma app, con archivos separados (para GitHub)
├── assets/
│   ├── css/app.css        ← estilos
│   └── js/
│       ├── logo.js        ← logo incrustado
│       ├── content.js     ← diccionario: 19 ángulos, 13 arquetipos, guiones, prompts
│       ├── ic.js          ← motor del Índice de Confianza
│       ├── store.js       ← guardado, clientes, exportar/importar
│       ├── generator.js   ← armado del lote de 7 / 14 piezas
│       ├── ui.js          ← pantallas
│       └── app.js         ← navegación y eventos
├── construir.py           ← vuelve a generar app-completa.html
├── start-local.command    ← abrir con servidor local (Mac)
├── start-local.bat        ← abrir con servidor local (Windows)
└── .github/workflows/     ← publicación automática en GitHub Pages
```

**Si modificas algo** en `assets/`, ejecuta `python3 construir.py` para regenerar `app-completa.html`.
Si solo usas GitHub, no hace falta: allí se sirve `index.html` con los archivos separados.

---

## 6. Cómo personalizar

| Qué quieres cambiar | Dónde |
|---|---|
| Ángulos, arquetipos de gancho, guiones, prompts | `assets/js/content.js` |
| Fórmula del IC, penalizaciones, bandas | `assets/js/ic.js` |
| Textos de las pantallas | `assets/js/ui.js` |
| Colores y tipografía | `assets/css/app.css` (variables al inicio) |
| Logo | `assets/js/logo.js` (o ejecuta `construir.py` tras reemplazarlo) |

---

## 7. Límites conocidos de esta versión

- **Sin conexión a Meta.** Un archivo HTML en el navegador no puede leer la Biblioteca de Anuncios (Meta no lo permite y su API solo expone anuncios políticos). Por eso el sistema automatiza todo lo demás: genera las consultas, los términos, los ángulos y los enlaces de verificación. La confirmación de cada anuncio la haces en un clic.
  *La automatización total requiere un servidor propio o un agente con navegador (siguiente versión).*
- **Sin multiusuario.** Los datos son de este navegador; no se comparten entre personas ni entre dispositivos.
- **Sin registro de resultados todavía.** El IC se calcula con la evidencia del mercado; la siguiente versión añade Hook Rate y CPA reales por pieza para recalibrar.
- **La IA no está conectada.** El selector de IA queda registrado en cada expediente y los prompts se generan listos para pegar en la herramienta elegida.

Estos cuatro puntos son exactamente el contenido de la siguiente versión.

---

*AdForge · Content & Ads Studio · Visión Digital*

## Conectar tu IA (opcional)

Cada persona usa **su propia cuenta** en **su propio navegador**. No hay servidor de Visión Digital en medio: la llamada va del navegador a la API que tú elijas.

1. Arriba a la derecha, pulsa **Conexiones**.
2. Elige proveedor: **OpenAI**, **Anthropic (Claude)**, **Google Gemini**, **OpenRouter** o cualquier API **compatible con OpenAI** (Arena, Groq, LM Studio…).
3. Pega tu llave, escribe el modelo y pulsa **Conectar y probar**.
4. Asigna qué IA usa cada sección: **Investigación**, **Redacción** y **Análisis** pueden ser distintas.
5. Si una se queda sin saldo, añade otra y cámbiala solo en esa sección.
6. Con **dos o más conectadas** puedes usar **Comparar**: la misma tarea en las dos, lado a lado.

**La llave se guarda en el localStorage de este navegador.** Nunca se sube a GitHub ni a ningún servidor nuestro. Si abres el archivo con doble clic (`file://`), algunos proveedores rechazan la llamada por seguridad: en ese caso usa el servidor local (`start-local`) o la versión publicada en GitHub Pages.

**Cada persona paga su propio consumo.** Si compartes la app con un cliente o con tu equipo, cada uno conecta su cuenta: tú no gastas por ellos y ellos no ven tu llave.

## Abrir la IA sin llaves (2 clics)

En **Investigación** → **Abrir en la IA ↗**: eliges ChatGPT, Claude, Gemini, Perplexity, Copilot o Grok y se abre en otra pestaña **con el prompt ya escrito**. Solo pulsas enviar.

Cuando responda: copias su respuesta (Ctrl/Cmd + C) y vuelves a la app → **Traer del portapapeles**. La app lee el portapapeles, extrae el JSON, lo valida y genera las 7 piezas.

Sin llaves, sin contraseñas, sin costo de API.

## Modo puente: usar una IA sin llaves

Si no quieres configurar una llave (o quieres usar un modelo al que no tienes acceso por API):

1. En **Investigación**, pulsa **Copiar prompt para IA**.
2. Pégalo en el chat de la IA que quieras (Arena, ChatGPT, Claude, Gemini).
3. Copia la respuesta completa —aunque venga con explicaciones o en bloque de código— y pulsa **Pegar respuesta**.
4. El sistema busca el JSON dentro del texto, lo valida, descarta los ángulos que no existen y genera las 7 piezas.

Funciona con cualquier IA que sepa devolver JSON. No hay llaves, no hay costo de API.

## Meta: qué se puede y qué no

| Quiero… | ¿Se puede? | Cómo |
|---|---|---|
| Ver los anuncios activos de mi competencia con datos automáticos | **No** | Meta no expone los anuncios comerciales por API. Solo políticos (API de Biblioteca de Anuncios) y, en la UE, todos por la DSA. |
| Ver los anuncios de mi competencia con mis ojos | **Sí** | Los enlaces de verificación de cada consulta y de cada pieza. Un clic. |
| Que una IA lea esos anuncios y los analice | **Depende** | Si tu modelo tiene navegación web, sí. Si no, te dará una estimación: la app la marca como *propuesta por IA, sin verificar*. |
| Traer los resultados reales de **mis** campañas (gasto, leads, costo, hook rate) | **Sí** | Meta Marketing API con un token de tu cuenta. El panel ya guarda el token; la lectura se activa en la siguiente versión. |

La regla de la casa: **un dato propuesto por IA nunca cuenta como verificado**. Baja el IC, no lo sube. Solo lo que confirmas a mano en la Biblioteca de Anuncios convierte una pieza en *verificada*.

