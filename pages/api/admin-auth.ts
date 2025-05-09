import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "changeme";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "sessionsecret";

function generateToken() {
  return crypto.createHmac('sha256', SESSION_SECRET).update(Date.now().toString()).digest('hex');
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body;
  if (password === ADMIN_SECRET) {
    // For demo: token is just a hash, not a JWT/session
    const token = generateToken();
    res.status(200).json({ success: true, token });
  } else {
    res.status(401).json({ success: false });
  }
}
