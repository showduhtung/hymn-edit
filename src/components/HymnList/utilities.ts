import { DragEvent } from "react";
import JSZip from "jszip";
import { HymnType, VerseType } from "../../types";

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

type DownloadHymnType = {
  lang: string;
  num: string;
  title: string;
  verses: OriginalVerseType[];
};
type OriginalVerseType = Omit<VerseType, "updatedHtml">;

export function downloadAsZip(datas: DownloadHymnType[]) {
  const zip = new JSZip();

  // Add JSON data to zip
  datas.forEach((data, index) => {
    const jsonStr = JSON.stringify(data, null, 2);
    zip.file(`${datas[index].num}.json`, jsonStr);
  });

  // Generate zip and initiate download
  zip.generateAsync({ type: "blob" }).then((blob) => {
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "download.zip"; // Change to your desired zip filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  });
}
