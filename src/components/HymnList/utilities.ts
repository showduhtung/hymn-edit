import { DragEvent } from "react";
import { HymnType } from "../../App";

export function withPreventDefaults(
  fn?: (e: DragEvent<HTMLUListElement>) => void
) {
  // stops the UI from opening files into the browser window
  return (e: DragEvent<HTMLUListElement>) => {
    e.preventDefault();
    e.stopPropagation();
    fn?.(e);
  };
}

export function readFileAsync(file: File): Promise<HymnType> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Error reading the file"));
    reader.readAsText(file);
  });
}
