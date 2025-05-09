import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { vin, make, model, zip, phone, titleInHand } = req.body;

  if (!vin || !make || !model || !zip || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const client = new Client({
    connectionString: process.env.NILE_DB_URI,
    user: process.env.NILE_DB_USER,
    password: process.env.NILE_DB_PASSWORD,
    database: process.env.NILE_DB_NAME,
  });

  try {
    await client.connect();
    const insertText = `INSERT INTO ${process.env.NILE_DB_COLLECTION} (vin, make, model, zip, phone, title_in_hand) VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [vin, make, model, zip, phone, titleInHand];
    await client.query(insertText, values);
    await client.end();
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Nile DB Insert Error:", error);
    return res.status(500).json({ error: "Database error" });
  }
}
