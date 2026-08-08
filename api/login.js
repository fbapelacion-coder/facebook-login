// ==========================================================
//  Función serverless de Vercel  ->  /api/login
//  Recibe el formulario, guarda el registro en la base de
//  datos (Neon Postgres) y muestra qué método se usó.
//
//  NOTA DIDÁCTICA: aquí la contraseña se guarda en TEXTO PLANO.
//  Esto es a propósito para la práctica, pero es justo lo que
//  NO se debe hacer en un sistema real: si roban la base de
//  datos, todas las contraseñas quedan expuestas. Lo correcto
//  es guardarlas hasheadas (bcrypt).
// ==========================================================

import { neon } from "@neondatabase/serverless";

// Vercel inyecta DATABASE_URL automáticamente al instalar Neon.
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  const metodo = req.method; // "POST" o "GET"

  // Según el método, los datos llegan en un lugar distinto:
  const datos = metodo === "POST" ? req.body : req.query;

  const email = datos?.email || "";
  const password = datos?.password || "";

  // Guardar el registro en la base de datos (contraseña en texto plano).
  // Se reutiliza la columna password_hash que ya existe en la tabla.
  let guardado = false;
  try {
    await sql`
      INSERT INTO registros (correo, password_hash)
      VALUES (${email}, ${password})
    `;
    guardado = true;
  } catch (error) {
    console.log("Error al guardar en la base de datos:", error);
  }

  // ----- Página de respuesta (didáctica) -----
  const estado = guardado
    ? "✅ Registro guardado en la base de datos."
    : "⚠️ No se pudo guardar (revisa la conexión a la base de datos).";

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Datos recibidos</title>
  <style>
    body {
      font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
      background: #f0f2f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    .caja {
      background: #fff;
      padding: 32px 40px;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,.15);
      max-width: 540px;
      width: 90%;
    }
    h1 { color: #1877f2; margin-top: 0; }
    .metodo {
      display: inline-block;
      background: #1877f2;
      color: #fff;
      padding: 4px 12px;
      border-radius: 6px;
      font-weight: 600;
    }
    .estado {
      margin-top: 16px;
      padding: 10px 14px;
      background: #e7f5e9;
      border-radius: 8px;
      font-weight: 600;
    }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    td { padding: 10px 8px; border-bottom: 1px solid #eee; }
    td.campo { font-weight: 600; width: 130px; color: #606770; }
    .nota { margin-top: 20px; font-size: 14px; color: #606770; }
    a { color: #1877f2; text-decoration: none; font-weight: 600; }
    code { word-break: break-all; }
  </style>
</head>
<body>
  <div class="caja">
    <h1>Datos recibidos</h1>
    <p>Método usado: <span class="metodo">${metodo}</span></p>
    <p class="estado">${estado}</p>

    <table>
      <tr><td class="campo">Correo</td><td>${email || "(vacío)"}</td></tr>
      <tr><td class="campo">Contraseña</td><td>${password || "(vacío)"}</td></tr>
    </table>

    <p class="nota">
      Con <b>POST</b> los datos viajan en el cuerpo de la petición
      y no aparecen en la URL. Con <b>GET</b> viajan en la URL,
      así: <code>?email=...&amp;password=...</code>
    </p>

    <p>
      <a href="/api/registros">Ver registros guardados →</a><br />
      <a href="/">← Volver</a>
    </p>
  </div>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}
