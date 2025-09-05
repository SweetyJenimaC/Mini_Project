import path from "path";
import fs from "fs/promises";
import formidable from "formidable";
import { getDb } from "../../../lib/db";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const db = getDb();

  if (req.method === "POST") {
    try {
      const uploadDir = path.join(process.cwd(), "public", "schoolImages");
      await fs.mkdir(uploadDir, { recursive: true });

      const form = formidable({
        multiples: false,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        keepExtensions: true,
      });

      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

      // required fields
      const required = ["name", "address", "city", "state", "contact", "email_id"];
      for (const f of required) {
        if (!fields[f] || String(fields[f]).trim() === "") {
          return res.status(400).json({ ok: false, error: `Missing field: ${f}` });
        }
      }

      // basic email validation
      const email = String(fields.email_id);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ ok: false, error: "Invalid email format" });
      }

      if (!files.image) {
        return res.status(400).json({ ok: false, error: "Image is required" });
      }

      const imgFile = Array.isArray(files.image) ? files.image[0] : files.image;
      const ext = path.extname(imgFile.originalFilename || imgFile.newFilename || "");
      const safeBase = (fields.name || "school").toString().replace(/\W+/g, "-").toLowerCase();
      const fileName = `${Date.now()}-${safeBase}${ext || ""}`;
      const destPath = path.join(uploadDir, fileName);

      // move uploaded temp file to public/schoolImages
      await fs.rename(imgFile.filepath, destPath);

      const imagePath = `/schoolImages/${fileName}`;

      const { name, address, city, state, contact, email_id } = fields;

      await db.execute(
        `INSERT INTO schools (name, address, city, state, contact, image, email_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, address, city, state, String(contact), imagePath, email_id]
      );

      return res.status(201).json({ ok: true, image: imagePath });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: "Server error" });
    }
  }

  if (req.method === "GET") {
    try {
      const [rows] = await db.execute(
        "SELECT id, name, address, city, image FROM schools ORDER BY id DESC"
      );
      return res.status(200).json({ ok: true, data: rows });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: "Server error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end("Method Not Allowed");
}
