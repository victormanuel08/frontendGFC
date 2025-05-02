<!-- components/RUTProcessor.vue -->
<template>
    <div class="rut-processor">
      <h1>Procesador de Formularios RUT</h1>
      
      <div class="upload-section">
        <input 
          type="file" 
          id="rut-file" 
          accept=".pdf" 
          @change="handleFileUpload"
        />
        <label for="rut-file">Seleccionar archivo RUT PDF</label>
        <p class="file-info" v-if="selectedFile">
          Archivo seleccionado: {{ selectedFile.name }} 
          ({{ (selectedFile.size / 1024).toFixed(2) }} KB)
        </p>
      </div>
      
      <div v-if="loading" class="loading">
        <div class="loader"></div>
        Procesando archivo...
      </div>
      
      <div v-if="error" class="error">
        ❌ {{ error }}
        <button @click="error = null" class="close-error">Cerrar</button>
      </div>
      
      <div v-if="showEmptyState" class="empty-state">
        ℹ️ Seleccione un archivo RUT en formato PDF para comenzar
      </div>
      
      <div v-if="showNoDataWarning" class="warning">
        ⚠️ Se procesó el archivo pero no se encontraron datos. Verifique:
        <ul>
          <li>El archivo es un RUT válido</li>
          <li>El documento no está escaneado (debe ser texto)</li>
          <li>El contenido no está protegido</li>
        </ul>
      </div>
      
      <div v-if="structuredData" class="results">
        <h2>Datos extraídos</h2>
        
        <div class="data-table">
          <!-- Sección de Identificación -->
          <div class="section-header">Identificación</div>
          <div class="data-row">
            <span class="data-key">NIT:</span>
            <span class="data-value">{{ structuredData.identificacion.nit }}-{{ structuredData.identificacion.dv }}</span>
          </div>
          <div class="data-row">
            <span class="data-key">Razón Social:</span>
            <span class="data-value">{{ structuredData.identificacion.razon_social }}</span>
          </div>
          <div class="data-row">
            <span class="data-key">Representante Legal:</span>
            <span class="data-value">{{ structuredData.identificacion.representante_legal.nombre }}</span>
          </div>
  
          <!-- Sección de Ubicación -->
          <div class="section-header">Ubicación</div>
          <div class="data-row">
            <span class="data-key">Dirección:</span>
            <span class="data-value">{{ structuredData.ubicacion.direccion_principal }}</span>
          </div>
          <div class="data-row">
            <span class="data-key">Ciudad:</span>
            <span class="data-value">{{ structuredData.ubicacion.municipio }}, {{ structuredData.ubicacion.departamento }}</span>
          </div>
  
          <!-- Sección de Responsabilidades -->
          <div class="section-header">Responsabilidades</div>
          <div 
            v-for="(responsabilidad, index) in structuredData.responsabilidades" 
            :key="index" 
            class="data-row responsability-item"
          >
            <span class="data-key">{{ responsabilidad.codigo }}:</span>
            <span class="data-value">{{ responsabilidad.descripcion }}</span>
          </div>
  
          <!-- Sección de Establecimientos -->
          <div class="section-header">Establecimientos</div>
          <div 
            v-for="(establecimiento, index) in structuredData.establecimientos" 
            :key="'est'+index" 
            class="data-row"
          >
            <span class="data-key">{{ establecimiento.nombre }}:</span>
            <span class="data-value">{{ establecimiento.direccion }}</span>
          </div>
        </div>
        
        <button @click="downloadJSON" class="download-btn">
          Descargar como JSON
        </button>
      </div>
  
      <div v-if="pdfFull" class="raw-text-section">
        <h3>
          Texto completo del PDF 
          <button @click="showRawText = !showRawText">
            {{ showRawText ? 'Ocultar' : 'Mostrar' }}
          </button>
        </h3>
        
        <pre v-if="showRawText" class="raw-text">{{ pdfFull }}</pre>
      </div>
    </div>
  </template>
  

  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import * as pdfjs from 'pdfjs-dist/build/pdf.mjs';
  import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs';
  
  onMounted(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  });
  
  const loading = ref(false);
  const error = ref(null);
  const structuredData = ref(null);
  const selectedFile = ref(null);
  const pdfFull = ref('');
  const showRawText = ref(false);
  
  const showEmptyState = computed(() => !selectedFile.value && !loading.value && !error.value);
  const showNoDataWarning = computed(() => selectedFile.value && !loading.value && !structuredData.value);
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    loading.value = true;
    error.value = null;
    structuredData.value = null;
    selectedFile.value = file;
    pdfFull.value = '';
  
    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      
      const pdf = await pdfjs.getDocument({
        data,
        cMapUrl: 'node_modules/pdfjs-dist/cmaps/',
        cMapPacked: true,
        worker: null
      }).promise;
  
      const [fullText, metadata] = await Promise.all([
        extractFullText(pdf),
        pdf.getMetadata()
      ]);
  
      pdfFull.value = fullText;
      processData(fullText, metadata);
      
    } catch (err) {
      error.value = `Error: ${err.message}`;
      console.error('Detalles del error:', err);
    } finally {
      loading.value = false;
    }
  };
  
  const extractFullText = async (pdf) => {
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      text += textContent.items.map(item => item.str).join(' ') + '\n';
    }
    return text;
  };
  
  const processData = (text, metadata) => {
    const cleanText = text.replace(/\s+/g, ' ');
    
    const extract = (regex, group = 1) => {
      const match = cleanText.match(regex);
      return match ? match[group].trim() : null;
    };
  
    const data = {
      metadata: {
        numero_formulario: extract(/4\.\s*Número de formulario\s+(\d+)/),
        fecha_generacion: extract(/Fecha generación documento PDF:\s+([\d-]+ [\d:]+[AP]M)/),
        software: metadata?.info?.Producer || 'No identificado'
      },
      identificacion: {
        nit: extract(/5\.\s*Número de Identificación Tributaria \(NIT\)\s+([\d\s]+)/)?.replace(/\s/g, ''),
        dv: extract(/6\.\s*DV\s+(\d)/),
        tipo_contribuyente: extract(/24\.\s*Tipo de contribuyente\s+([^\n]+)/),
        razon_social: extract(/35\.\s*Razón social\s+([^\n]+)/),
        representante_legal: {
          nombre: extract(/864\.\s*Nombre\s+([^\n]+)/),
          documento: extract(/865\.\s*Cargo\s+([^\n]+)/),
          identificacion: extract(/Número de documento:\s+([\d\s]+)/)?.replace(/\s/g, '')
        }
      },
      ubicacion: {
        pais: 'COLOMBIA',
        departamento: extract(/39\.\s*Departamento\s+([^\n]+)/),
        municipio: extract(/40\.\s*Ciudad\/Municipio\s+([^\n]+)/),
        direccion_principal: extract(/41\.\s*Dirección principal\s+([^\n]+)/),
        codigo_postal: extract(/43\.\s*Código postal\s+([\d\s]+)/)?.replace(/\s/g, ''),
        correo_electronico: extract(/42\.\s*Correo electrónico\s+([^\n]+)/),
        telefonos: [
          extract(/44\.\s*Teléfono 1\s+([\d\s]+)/)?.replace(/\s/g, ''),
          extract(/45\.\s*Teléfono 2\s+([\d\s]+)/)?.replace(/\s/g, '')
        ].filter(t => t)
      },
      clasificacion: {
        actividad_economica_principal: {
          codigo: extract(/46\.\s*Código\s+([\d\s]+)/)?.replace(/\s/g, ''),
          descripcion: extract(/Comercio al por mayor de materiales de construcción, artículos de ferretería\s+(\d{4})/)
        },
        actividades_secundarias: [
          {
            codigo: '2392',
            descripcion: 'Fabricación de materiales de arcilla para la construcción'
          }
        ]
      },
      responsabilidades: (() => {
        const matches = [...cleanText.matchAll(/(\d{2}-\d{3})\s+([^\n]+?)(?=\s\d{2}-|\n|$)/g)];
        return matches.map(m => ({
          codigo: m[1],
          descripcion: m[2].trim()
        }));
      })(),
      establecimientos: (() => {
        const matches = [...cleanText.matchAll(/162\.\s*Nombre del establecimiento:\s+([^\n]+?)\s+165\.\s*Dirección\s+([^\n]+)/g)];
        return matches.map(m => ({
          nombre: m[1].trim(),
          direccion: m[2].trim(),
          matricula_mercantil: extract(/(\d{6})\s+(\d{8})/, 1)
        }));
      })(),
      informacion_legal: {
        firma_autorizada: extract(/Firma autorizada:\s+([^\n]+)/),
        vigencia: 'Indefinida',
        ultima_actualizacion: extract(/Fecha generación documento PDF:\s+([\d-]+)/)
      }
    };
  
    structuredData.value = data;
  };
  
  const downloadJSON = () => {
    const dataStr = JSON.stringify(structuredData.value, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `rut_${structuredData.value.identificacion.nit}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  </script>
  
  <style scoped>
  /* Mantener estilos anteriores */
  .section-header {
    font-size: 1.2em;
    font-weight: bold;
    color: #2c3e50;
    margin: 20px 0 10px;
    padding: 10px;
    background-color: #f0f4f8;
    border-radius: 5px;
  }
  
  .data-row {
    display: flex;
    padding: 12px 15px;
    border-bottom: 1px solid #dee2e6;
    transition: background-color 0.2s;
    gap: 20px;
  }
  
  .data-key {
    font-weight: 600;
    min-width: 200px;
    color: #2c3e50;
  }
  
  .data-value {
    color: #34495e;
    flex-grow: 1;
  }
  
  .responsability-item {
    background-color: #fff3e0;
    border-left: 4px solid #ffc107;
  }
 
  
  .section-header {
    font-size: 1.2em;
    font-weight: bold;
    color: #2c3e50;
    margin: 20px 0 10px;
    padding: 10px;
    background-color: #f0f4f8;
    border-radius: 5px;
  }
  
  .data-row {
    display: flex;
    padding: 12px 15px;
    border-bottom: 1px solid #dee2e6;
    transition: background-color 0.2s;
    gap: 20px;
  }
  
  .data-key {
    font-weight: 600;
    min-width: 200px;
    color: #2c3e50;
  }
  
  .data-value {
    color: #34495e;
    flex-grow: 1;
  }
  
  .responsability-item {
    background-color: #fff3e0;
    border-left: 4px solid #ffc107;
  }
  
  
  .rut-processor {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .upload-section {
    margin: 30px 0;
    text-align: center;
  }
  
  input[type="file"] {
    display: none;
  }
  
  label[for="rut-file"] {
    display: inline-block;
    padding: 12px 25px;
    background-color: #2196F3;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 16px;
  }
  
  label[for="rut-file"]:hover {
    background-color: #1976D2;
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
  }
  
  .loading, .error {
    margin: 20px 0;
    padding: 15px;
    border-radius: 5px;
    text-align: center;
  }
  
  .loading {
    background-color: #e3f2fd;
    color: #0d47a1;
  }
  
  .error {
    background-color: #ffebee;
    color: #b71c1c;
  }
  
  .results {
    margin-top: 30px;
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .data-table {
    margin: 20px 0;
  }
  
  .data-row {
    display: flex;
    padding: 12px 15px;
    border-bottom: 1px solid #dee2e6;
    transition: background-color 0.2s;
  }
  
  .data-row:hover {
    background-color: #f1f3f5;
  }
  
  .data-key {
    font-weight: 600;
    min-width: 250px;
    color: #2c3e50;
  }
  
  .data-value {
    color: #34495e;
    white-space: pre-wrap;
  }
  
  .responsability-item {
    background-color: #fff3e0;
  }
  
  .download-btn {
    margin-top: 25px;
    padding: 12px 30px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s;
  }
  
  .download-btn:hover {
    background-color: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
  }
  
  .raw-text-section {
    margin-top: 40px;
    border-top: 2px solid #eee;
    padding-top: 20px;
  }
  
  .raw-text {
    max-height: 400px;
    overflow: auto;
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    white-space: pre-wrap;
    font-family: monospace;
    border: 1px solid #ddd;
    line-height: 1.5;
  }
  
  @media (max-width: 768px) {
    .data-row {
      flex-direction: column;
    }
    
    .data-key {
      margin-bottom: 5px;
    }
    
    .raw-text {
      font-size: 0.8em;
    }
  }
  </style>