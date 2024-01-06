import type { ChangeEvent } from "react";

export function splitByBreakLine(html: string) {
  return html
    .split("<br>")
    .map((line) => line.trim())
    .map((line) => line.replaceAll("<b>", "").replaceAll("</b>", ""));
}

export function joinByBreakLine(html: string[]) {
  return html
    .map(([first, second, ...rest]) => {
      if (!second) return `<b>${first}</b>`;
      const isFirstAlpha = /[A-Za-z]/.test(first);
      const [modifiedFirst, modifiedSecond] = [
        isFirstAlpha ? `<b>${first}</b>` : first,
        isFirstAlpha ? second : `<b>${second}</b>`,
      ];

      return `${modifiedFirst}${modifiedSecond}${rest.join("")}`;
    })
    .join("<br>");
}

export function autofocusLastCharacter(e: ChangeEvent<HTMLTextAreaElement>) {
  // [UX] on focus isn't allowing for double click to highlight
  const val = e.target.value;
  e.target.value = "";
  e.target.value = val;
}
