import type { ChangeEvent } from "react";

export function splitByBreakLine(html: string) {
  return html
    .split("<br>")
    .map((line) => line.trim())
    .map((line) => line.replaceAll("<b>", "").replaceAll("</b>", ""));
}

export function joinByBreakLine(html: string[]) {
  return html
    .map((line) => {
      const isFirstAlpha = /[A-Za-z]/.test(line[0]);
      const [first, second] = [
        isFirstAlpha ? line[0].toUpperCase() : line[0],
        isFirstAlpha ? line[1] : line[1].toUpperCase(),
      ];

      return `${first}${second}${line.slice(2)}`;
    })
    .join("<br>");
}

export function autofocusLastCharacter(e: ChangeEvent<HTMLTextAreaElement>) {
  // [UX] on focus isn't allowing for double click to highlight
  const val = e.target.value;
  e.target.value = "";
  e.target.value = val;
}
