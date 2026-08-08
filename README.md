# Réplica de login de Facebook — práctica POST / GET

Práctica de diseño web para demostrar el envío de datos de un
formulario por los métodos POST y GET, desplegada en Vercel.

## Estructura

```
facebook-login/
├── index.html        Front (réplica del login)
├── style.css         Estilos: tipografía y distribución
├── api/
│   └── login.js      Back: función serverless que recibe el formulario
└── img/              Aquí van tus imágenes
```

## Imágenes que hay que reemplazar

En la carpeta `img/` coloca tus archivos con estos nombres (o cambia
el `src` en `index.html`):

- `logo-facebook.png` — logo azul de Facebook
- `cojin.png`, `skater.png`, `post.png`, `persona.png` — el collage
- `meta.png` — logo de Meta

## POST vs GET

En `index.html`, en la etiqueta `<form>`, cambia el atributo `method`:

- `method="POST"` → los datos van en el cuerpo, no se ven en la URL
- `method="GET"`  → los datos van en la URL: `?email=...&password=...`

La función `api/login.js` detecta el método automáticamente y muestra
qué datos llegaron y por cuál vía.

## Desplegar en Vercel

1. Sube esta carpeta a un repo de GitHub.
2. En Vercel: **Add New → Project** e importa el repo.
3. Sin configuración extra: Vercel sirve el HTML estático desde la raíz
   y convierte `api/login.js` en la ruta `/api/login`. Deploy y listo.

Para probar en local con la CLI:

```
npm i -g vercel
vercel dev
```
