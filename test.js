import * as pdfjs from 'pdfjs-dist/build/pdf.mjs';

async function test() {
  const doc = await pdfjs.getDocument({
    url: 'https://www.boyaca.gov.co/wp-content/uploads/2021/10/RUTs.pdf',
    worker: null
  }).promise;
  console.log('Páginas:', doc.numPages);
}

test();