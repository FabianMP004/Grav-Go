# Grav-Go — Delivery Universitario

Página demo creada a partir de la imagen de referencia. Colores primarios: negro y anaranjado. El área grande a la derecha es para colocar el logo de la app (puedes reemplazarla por `logo.png`).

Contenido:
- `index.html` — página principal
- `styles.css` — estilos
- `app.js` — lógica de formulario y simulación de rastreo

Cómo ejecutar localmente (PowerShell):

1) Abrir una terminal en la carpeta del proyecto:

```powershell
cd "c:\Users\fabia\Dropbox\PC\Desktop\GITHUB\Semestre 6\Grav-Go"
```

2) Servir un servidor estático simple (opcional, recomendado por CORS y rutas):

Si tienes Python instalado:

```powershell
python -m http.server 8000
```

Luego abre en el navegador: `http://localhost:8000`.

Si usas Node.js puedes instalar `http-server`:

```powershell
npm install -g http-server
http-server -p 8000
```

Conectar a la API real de PedidosYa

- El `app.js` contiene una simulación. Para usar la API real debes conocer el endpoint, el método de autenticación y el esquema de respuestas de PedidosYa.
- Posibles pasos:
	1. Obtener credenciales (token) desde el backend seguro — NO ponga tokens sensibles en el frontend.
	2. Crear un endpoint en tu servidor que haga la llamada a PedidosYa (evita exponer credenciales y problemas de CORS). El frontend consulta tu servidor.
	3. Procesar la respuesta y devolver al cliente sólo la información necesaria (estado, ETA, etc.).

Ejemplo rápido (backend) — pseudocódigo:

```
GET /api/track?order=12345  -> El servidor llama a PedidosYa con token privado y responde con el estado
```

Notas y siguientes pasos recomendados

- Reemplaza el espacio circular `app-logo-large` por tu logo real (`<img src="logo.png">`) para que coincida con tu identidad.
- Añade validaciones y seguridad en el backend, sobre todo para llamadas a la API de PedidosYa.
- Implementa WebSockets o polling para recibir actualizaciones en tiempo real del estado del pedido.
- Agrega un pequeño backend que reciba notificaciones o que re-consulte la API para actualizar el estado y notificar a los repartidores.

Si quieres, puedo:
- Integrar un ejemplo de backend en Node.js/Express que haga proxy a la API de PedidosYa.
- Mejorar los estilos (fuentes, tipografías, microanimaciones) o añadir una versión móvil optimizada.
# Grav-Go