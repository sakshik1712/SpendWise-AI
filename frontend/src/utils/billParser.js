// src/utils/billParser.js
export const parseBillText = (text) => {
  const lines = text.split("\n");
  let title = lines[1] || "Bill"; // pick shop name or first item as title
  let totalLine = lines.find((l) => l.toLowerCase().includes("total"));
  let amount = 0;
  if (totalLine) {
    const match = totalLine.match(/[\d.,]+/);
    if (match) {
      amount = parseFloat(match[0].replace(",", "."));
    }
  }
  return {
    title,
    category: "Food", // or implement category detection
    amount,
    date: new Date().toISOString().slice(0, 10)
  };
};
