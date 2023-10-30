import type { ChangeEvent } from "react";

export function splitByBreakLine(html: string) {
  return html
    .split("<br>")
    .map((line) => line.trim())
    .map((line) => line.replaceAll("<b>", "").replaceAll("</b>", ""));
}

export function joinByBreakLine(html: string[], shouldBold: boolean = false) {
  return html
    .map((line) => {
      // TODO bug- will capitalize the apostrophe in "F, instead of F
      const first = shouldBold ? `<b>${line[0]}</b>` : line[0];
      return `${first}${line.slice(1)}`;
    })
    .join("<br>");
}

export function autofocusLastCharacter(e: ChangeEvent<HTMLTextAreaElement>) {
  // [UX] on focus isn't allowing for double click to highlight
  const val = e.target.value;
  e.target.value = "";
  e.target.value = val;
}
