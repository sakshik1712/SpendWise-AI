const express = require("express");
const multer = require("multer");
const router = express.Router();
const Tesseract = require("tesseract.js");
const fs = require("fs");

// Configure multer for file upload
const upload = multer({ dest: "uploads/" });

/**
 * Helper: Safely parse amounts from text
 */
const parseAmount = (str) => {
  if (!str) return 0;
  str = str.replace(/,/g, "."); // Normalize comma to dot
  const match = str.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

/**
 * Extract total amount using multiple regex patterns
 */
const extractTotal = (text) => {
  const regexes = [
    /total inc.*?([\d.,]+)/i,
    /total[:\s]*\$?([\d.,]+)/i,
    /amount[:\s]*\$?([\d.,]+)/i,
    /balance[:\s]*\$?([\d.,]+)/i,
    /visa[:\s]*\$?([\d.,]+)/i,
    /mastercard[:\s]*\$?([\d.,]+)/i,
  ];

  for (const r of regexes) {
    const match = text.match(r);
    if (match) return parseAmount(match[1]);
  }

  // Fallback: take last number found
  const numbers = text.match(/[\d,.]+/g);
  if (numbers && numbers.length > 0) {
    return parseAmount(numbers[numbers.length - 1]);
  }

  return 0;
};

/**
 * Extract date in common formats
 */
const extractDate = (text) => {
  const dateRegexes = [
    /\b(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})\b/,
    /\b(\d{4}[\/.-]\d{1,2}[\/.-]\d{1,2})\b/,
  ];

  for (const r of dateRegexes) {
    const match = text.match(r);
    if (match) return new Date(match[1]).toISOString().slice(0, 10);
  }

  return new Date().toISOString().slice(0, 10);
};

/**
 * Extract shop name (default "Scanned Bill")
 */
const extractShopName = (text) => {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Could try to use first line, but defaulting to "Scanned Bill"
  return "Scanned Bill";
};

/**
 * Endpoint: Scan a single bill
 */
router.post("/scan", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const { path } = req.file;

    // Run OCR
    const result = await Tesseract.recognize(path, "eng", {
      logger: (m) => console.log(m),
    });
    const text = result.data.text;

    // Extract info
    const total = extractTotal(text);
    const shopName = extractShopName(text);
    const date = extractDate(text);

    res.json({
      title: shopName,
      category: "General", // Future: ML-based categorization
      total,
      date,
      rawText: text, // Full OCR text for debugging
    });

    // Delete uploaded file after processing
    fs.unlinkSync(path);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to scan bill" });
  }
});

/**
 * Endpoint: Scan multiple bills
 */
router.post("/scan-multiple", upload.array("files"), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  try {
    const results = [];

    for (const file of req.files) {
      const { path } = file;

      const result = await Tesseract.recognize(path, "eng", {
        logger: (m) => console.log(m),
      });
      const text = result.data.text;

      results.push({
        title: "Scanned Bill",
        category: "General",
        total: extractTotal(text),
        date: extractDate(text),
        rawText: text,
      });

      // Delete after processing
      fs.unlinkSync(path);
    }

    res.json({ bills: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to scan bills" });
  }
});

module.exports = router;
