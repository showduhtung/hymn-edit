export function splitByBreakLine(html: string) {
  return html
    .split("<br>")
    .map((line) => line.trim())
    .map((line) => line.replaceAll("<b>", "").replaceAll("</b>", ""));
}

export function joinByBreakLine(html: string[]) {
  return html.map((line) => `<b>${line[0]}</b>${line.slice(1)}`).join("<br>");
}

export function initiatiateHtml(html: string) {
  return html
    .split("<br>")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((_, idx) => (idx === 0 ? idx + 1 : " "))
    .join("<br>");
}
