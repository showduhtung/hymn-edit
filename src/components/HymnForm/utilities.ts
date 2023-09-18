export function splitByBreakLine(html: string) {
  return html
    .split("<br>")
    .map((line) => line.trim())
    .map((line) => line.replaceAll("<b>", "").replaceAll("</b>", ""));
}

export function joinByBreakLine(html: string[]) {
  return html.map((line) => `<b>${line[0]}</b>${line.slice(1)}`).join("<br>");
}
