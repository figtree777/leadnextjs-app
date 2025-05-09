import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

import crypto from "crypto";

function validateToken(token: string | undefined) {
  if (!token) return false;
  // For demo: token is a hash generated in admin-auth
  // In real use, you would store/verify sessions in a DB or use JWTs
  return typeof token === "string" && token.length === 64;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Server-side auth: check Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.replace("Bearer ", "");
  if (!validateToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const client = new Client({
    connectionString: process.env.NILE_DB_URI,
    user: process.env.NILE_DB_USER,
    password: process.env.NILE_DB_PASSWORD,
    database: process.env.NILE_DB_NAME,
  });

  try {
    await client.connect();
    const selectText = `SELECT id, vin, make, model, zip, phone, title_in_hand, submitted_at FROM ${process.env.NILE_DB_COLLECTION} ORDER BY submitted_at DESC`;
    const result = await client.query(selectText);
    await client.end();
    return res.status(200).json({ leads: result.rows });
  } catch (error: any) {
    console.error("Nile DB Query Error:", error);
    return res.status(500).json({ error: "Database error" });
  }
}
