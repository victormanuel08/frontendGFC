import { fromPath } from 'pdf2pic';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';
import fs from 'fs';
import path from 'path';

// Configuración para Windows
const __dirname = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const PDF_PATH = path.resolve(__dirname, 'rut.pdf');
const OUTPUT_DIR = path.resolve(__dirname, 'output');

// 1. Definir coordenadas de campos (Ejemplo para NIT y Razón Social)
const CAMPOS = [
  {
    nombre: "NIT",
    x: 150, y: 300, ancho: 400, alto: 50 // Ajustar según tu PDF
  },
  {
    nombre: "Razon_Social",
    x: 150, y: 450, ancho: 600, alto: 50
  }
];

// 2. Convertir PDF a imágenes con manejo de errores
async function convertirPDFaImagenes() {
  try {
    const convert = fromPath(PDF_PATH, {
      density: 300,
      saveFilename: "pagina",
      savePath: path.join(OUTPUT_DIR, 'full'),
      format: "png",
      width: 2480,
      height: 3508
    });
    
    return await convert.bulk(-1);
  } catch (error) {
    throw new Error(`Error en conversión: ${error.message}`);
  }
}

// 3. Recortar regiones con retrasos para evitar EOF
async function recortarRegiones() {
  try {
    const imagenes = fs.readdirSync(path.join(OUTPUT_DIR, 'full'));
    
    for (const imagen of imagenes) {
      const pagina = imagen.match(/pagina-(\d+).png/)[1];
      const imagenPath = path.join(OUTPUT_DIR, 'full', imagen);

      for (const campo of CAMPOS) {
        const outputPath = path.join(OUTPUT_DIR, 'recortes', `pagina-${pagina}_${campo.nombre}.png`);
        
        await sharp(imagenPath)
          .extract({
            left: campo.x,
            top: campo.y,
            width: campo.ancho,
            height: campo.alto
          })
          .toFile(outputPath);

        await new Promise(resolve => setTimeout(resolve, 100)); // Retraso clave
      }
    }
  } catch (error) {
    throw new Error(`Error en recorte: ${error.message}`);
  }
}

// 4. Extraer texto con OCR y limpieza
async function extraerTexto() {
  const worker = await createWorker('spa');
  const resultados = {};

  try {
    const recortes = fs.readdirSync(path.join(OUTPUT_DIR, 'recortes'));
    
    for (const recorte of recortes) {
      const [_, campo] = recorte.match(/pagina-\d+_(.*).png/);
      const texto = await worker.recognize(path.join(OUTPUT_DIR, 'recortes', recorte));
      resultados[campo] = texto.data.text.replace(/[\n\t]/g, ' ').trim();
    }

    return resultados;
  } finally {
    await worker.terminate();
  }
}

// Función principal
async function main() {
  try {
    // Configurar directorios
    fs.mkdirSync(path.join(OUTPUT_DIR, 'full'), { recursive: true });
    fs.mkdirSync(path.join(OUTPUT_DIR, 'recortes'), { recursive: true });

    // Flujo completo
    console.log("🔍 Iniciando procesamiento...");
    await convertirPDFaImagenes();
    console.log("✅ PDF convertido a imágenes");
    
    await recortarRegiones();
    console.log("✂️ Campos recortados");
    
    const datos = await extraerTexto();
    console.log("\n📄 Datos extraídos:");
    console.log(JSON.stringify(datos, null, 2));

  } catch (error) {
    console.error(`\n❌ Error crítico: ${error.message}`);
  }
}

main();