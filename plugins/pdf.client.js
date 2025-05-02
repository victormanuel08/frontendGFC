import * as pdfjsLib from "pdfjs-dist/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js"; // Ajusta la versión correcta

export default defineNuxtPlugin(() => {
  return {
    provide: {
      pdfjs: pdfjsLib
    }
  };
});
