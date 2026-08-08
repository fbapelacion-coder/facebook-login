// ==========================================================
//  Función serverless de Vercel  ->  /api/registros
//  Lee y muestra todos los registros guardados en la base
//  de datos, para ver en la demo que sí se están guardando.
// ==========================================================

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  let filas = [];
  try {
    filas = await sql`
      SELECT id, correo, password_hash, fecha
      FROM registros
      ORDER BY id DESC
      LIMIT 50
    `;
  } catch (error) {
    console.log("Error al leer la base de datos:", error);
  }

  // Armar las filas de la tabla
  const filasHtml = filas
    .map(
      (f) => `
      <tr>
        <td>${f.id}</td>
        <td>${f.correo || ""}</td>
        <td><code>${(f.password_hash || "").slice(0, 25)}...</code></td>
        <td>${new Date(f.fecha).toLocaleString("es-MX")}</td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registros guardados</title>
  <style>
    body {
      font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
      background: #f0f2f5;
      margin: 0;
      padding: 40px 16px;
    }
    .caja {
      background: #fff;
      max-width: 900px;
      margin: 0 auto;
      padding: 28px 32px;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,.15);
    }
    h1 { color: #1877f2; margin-top: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 10px 8px; border-bottom: 1px solid #eee; text-align: left; font-size: 14px; }
    th { color: #606770; }
    code { color: #b33; word-break: break-all; }
    a { color: #1877f2; text-decoration: none; font-weight: 600; }
    .vacio { color: #606770; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="caja">
    <h1>Registros guardados</h1>
    ${
      filas.length
        ? `<table>
             <tr><th>ID</th><th>Correo</th><th>Contraseña (hash)</th><th>Fecha</th></tr>
             ${filasHtml}
           </table>`
        : `<p class="vacio">Todavía no hay registros. Llena el formulario para crear el primero.</p>`
    }
    <p style="margin-top:20px"><a href="/">← Volver al inicio</a></p>
  </div>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}
