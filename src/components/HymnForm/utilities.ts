import { ChangeEvent } from "react";

export function splitByBreakLine(html: string) {
  return html
    .split("<br>")
    .map((line) => line.trim())
    .map((line) => line.replaceAll("<b>", "").replaceAll("</b>", ""));
}

export function joinByBreakLine(html: string[]) {
  return html.map((line) => `<b>${line[0]}</b>${line.slice(1)}`).join("<br>");
}

export function autofocusLastCharacter(e: ChangeEvent<HTMLTextAreaElement>) {
  const val = e.target.value;
  e.target.value = "";
  e.target.value = val;
}
