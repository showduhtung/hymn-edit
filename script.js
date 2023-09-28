import fs from "fs/promises";

function processBolding(html, shouldBold) {
  const lines = html.split("<br>");
  const correctedLines = lines.map((line) => {
    const match = line.match(/^<b>(\d+)<\/b>|^(\d+)/);
    if (!match) return line;
    const number = match[1] || match[2];

    if (match[1])
      return shouldBold ? line : line.replace(`<b>${number}</b>`, number);

    return shouldBold ? line.replace(number, `<b>${number}</b>`) : line;
  });
  return correctedLines.join("<br>");
}

async function processFiles() {
  const dir = "./data/hymns/en";
  const files = await fs.readdir(dir);
  files.forEach(async (file) => {
    if (file.includes("DS")) return;
    const filePath = `${dir}/${file}`;

    const { default: initialHymn } = await import(filePath);

    const verses = initialHymn.verses.map((verse) => {
      const shouldBold = verse.label.includes("C");
      return { ...verse, html: processBolding(verse.html, shouldBold) };
    });

    const hymn = { ...initialHymn, verses };

    await fs.writeFile(filePath, JSON.stringify(hymn, null, 2));
  });
}

processFiles();
