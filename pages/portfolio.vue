<template>
    <div class="modern-portfolio">
        <!-- Hero con gradiente corporativo -->
        <section class="portfolio-hero">
            <div class="hero-content">
                <div class="logo-container">
                    <img src="/static/logo-bce-light.png" alt="BCE S.A.S." class="logo">
                </div>
                <h1>Soluciones <span>Contables</span> con Visión Estratégica</h1>
                <p class="hero-subtitle">Expertos en transformar desafíos financieros en oportunidades de crecimiento
                </p>
                <div class="hero-buttons">
                    <button class="primary-btn" @click="navigateToContact">Contactar Expertos</button>
                    <button class="secondary-btn" @click="scrollToServices">Ver Servicios</button>
                </div>
            </div>
            <div class="hero-decoration">
                <div class="decoration-circle"></div>
                <div class="decoration-line"></div>
            </div>
        </section>

        <!-- Servicios con acordeón mejorado -->
        <section class="services-section" ref="servicesSection">
            <div class="container">
                <h2 class="section-title">Nuestros <span>Servicios Especializados</span></h2>
                <p class="section-subtitle">Soluciones integrales adaptadas a sus necesidades específicas</p>

                <div class="services-accordion">
                    <div class="service-category" v-for="(category, catIndex) in serviceCategories" :key="catIndex">
                        <div class="category-header" @click="toggleCategory(catIndex)"
                            :class="{ 'active': category.open }">
                            <div class="header-content">
                                <div class="category-icon">
                                    <i :class="category.icon"></i>
                                </div>
                                <h3>{{ category.name }}</h3>
                            </div>
                            <i :class="['fas', category.open ? 'fa-minus' : 'fa-plus']"></i>
                        </div>

                        <div class="category-content" :class="{ 'open': category.open }">
                            <div class="service-item" v-for="(service, servIndex) in category.services" :key="servIndex"
                                @click.stop="toggleService(catIndex, servIndex)">
                                <div class="service-header">
                                    <h4>{{ service.title }}</h4>
                                    <i :class="['fas', service.open ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
                                </div>

                                <div class="service-details" :class="{ 'expanded': service.open }">
                                    <div class="detail-content">
                                        <p class="service-description">{{ service.description }}</p>

                                        <div class="detail-sections">
                                            <div class="detail-section" v-if="service.features">
                                                <h5><i class="fas fa-check-circle"></i> Características</h5>
                                                <ul>
                                                    <li v-for="(feature, featIndex) in service.features"
                                                        :key="featIndex">
                                                        <i class="fas fa-circle"></i> {{ feature }}
                                                    </li>
                                                </ul>
                                            </div>

                                            <div class="detail-section" v-if="service.benefits">
                                                <h5><i class="fas fa-star"></i> Beneficios</h5>
                                                <ul>
                                                    <li v-for="(benefit, benIndex) in service.benefits" :key="benIndex">
                                                        <i class="fas fa-circle"></i> {{ benefit }}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="service-image" v-if="service.image">
                                        <img :src="service.image" :alt="service.title">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Resto de secciones (metodología, casos de éxito, CTA) -->
        <!-- ... -->
    </div>
</template>

<script setup>
import { ref } from 'vue'

// Datos de servicios (similar al anterior pero con imágenes añadidas)
const serviceCategories = ref([
    {
        name: 'Asesoría Contable y Financiera',
        icon: 'fas fa-calculator',
        open: false,
        services: [
            {
                title: 'Contabilidad Integral',
                description: 'Implementamos sistemas contables completos que incluyen registro detallado de operaciones, conciliaciones bancarias automatizadas y generación de estados financieros bajo Normas Internacionales de Información Financiera (NIIF). Nuestro equipo se adapta a las necesidades específicas de su organización, ya sea pyme o gran empresa.',
                features: [
                    'Elaboración de balances generales, estados de resultados y flujos de efectivo',
                    'Conciliaciones bancarias mensuales con reportes de discrepancias',
                    'Análisis de ratios financieros (liquidez, endeudamiento, rentabilidad)',
                    'Reportes personalizados para la junta directiva',
                    'Plataforma digital para acceso en tiempo real',
                    'Cierre contable mensual y anual'
                ],
                benefits: [
                    'Información financiera confiable y auditada',
                    'Cumplimiento normativo con las NIIF y regulaciones locales',
                    'Reducción de hasta 40% en costos del departamento contable',
                    'Toma de decisiones estratégicas basada en datos reales',
                    'Detección temprana de irregularidades contables',
                    'Integración con sistemas ERP empresariales'
                ],
                image: '/static/services/contabilidad-integral.jpg',
                open: false
            },
            {
                title: 'Planeación Financiera Estratégica',
                description: 'Desarrollamos modelos financieros predictivos y planes estratégicos a 3-5 años que se alinean con los objetivos de crecimiento de su organización, incluyendo proyecciones de flujo de caja, análisis de escenarios y recomendaciones de estructura de capital óptima.',
                features: [
                    'Modelos financieros personalizados en Excel y herramientas especializadas',
                    'Análisis de escenarios (pesimista, base, optimista)',
                    'Proyecciones de flujo de caja detalladas',
                    'Recomendaciones de estructura de capital y financiamiento',
                    'Planes de inversión y crecimiento estratégico',
                    'Valuación de empresas y proyectos'
                ],
                benefits: [
                    'Visibilidad financiera a mediano y largo plazo',
                    'Optimización del uso de recursos financieros',
                    'Preparación para contingencias económicas',
                    'Atracción de inversionistas con documentos profesionales',
                    'Alcance de metas financieras con menor riesgo',
                    'Alineación entre finanzas y objetivos estratégicos'
                ],
                image: '/static/services/planeacion-financiera.jpg',
                open: false
            }
        ]
    },
    {
        name: 'Asesoría Tributaria y Fiscal',
        icon: 'fas fa-file-invoice-dollar',
        open: false,
        services: [
            {
                title: 'Planeación Tributaria Estratégica',
                description: 'Diseñamos estrategias fiscales personalizadas que permiten optimizar su carga tributaria dentro del marco legal vigente, considerando todas las variables relevantes para su sector y tipo de organización, incluyendo regímenes especiales y tratamientos preferenciales.',
                features: [
                    'Análisis de estructura tributaria óptima',
                    'Planificación anual de obligaciones fiscales',
                    'Optimización de impuestos (renta, IVA, industria y comercio)',
                    'Estrategias para regímenes especiales (Zonas Francas, RENTA)',
                    'Revisión de retenciones en la fuente',
                    'Elaboración de calendarios tributarios'
                ],
                benefits: [
                    'Reducción legal de la carga fiscal entre 15-30%',
                    'Prevención de contingencias y multas tributarias',
                    'Cumplimiento normativo garantizado',
                    'Ahorros fiscales significativos año tras año',
                    'Estructuración de operaciones fiscalmente eficientes',
                    'Actualización permanente en reformas tributarias'
                ],
                image: '/static/services/planeacion-tributaria.jpg',
                open: false
            },
            {
                title: 'Consultoría en Impuestos Internacionales',
                description: 'Asesoría especializada en operaciones transfronterizas, aplicación de tratados para evitar la doble tributación, precios de transferencia y cumplimiento de obligaciones reportables en múltiples jurisdicciones, con enfoque en normativas OCDE y regulaciones locales.',
                features: [
                    'Análisis de tratados internacionales de doble tributación',
                    'Documentación de precios de transferencia (Local File, Master File)',
                    'Optimización de estructuras internacionales',
                    'Cumplimiento de reporting internacional (CbCR, FATCA, CRS)',
                    'Asesoría en impuestos a la repatriación de utilidades',
                    'Planificación fiscal para empresas multinacionales'
                ],
                benefits: [
                    'Mitigación de riesgos fiscales globales',
                    'Eficiencia en operaciones internacionales',
                    'Cumplimiento con regulaciones multilaterales',
                    'Reducción de costos en operaciones transfronterizas',
                    'Defensa ante requerimientos de autoridades fiscales',
                    'Armonización de políticas fiscales entre filiales'
                ],
                image: '/static/services/impuestos-internacionales.jpg',
                open: false
            }
        ]
    },
    {
        name: 'Auditoría y Control',
        icon: 'fas fa-search-dollar',
        open: false,
        services: [
            {
                title: 'Auditoría Externa Independiente',
                description: 'Realizamos auditorías financieras bajo Normas Internacionales de Auditoría (NIA) que brindan seguridad y confianza a accionistas, inversionistas y entes de control sobre la veracidad de su información financiera, con enfoque en riesgos y controles clave.',
                features: [
                    'Auditoría de estados financieros bajo NIA',
                    'Enfoque basado en riesgos operacionales y financieros',
                    'Evaluación de controles internos contables',
                    'Pruebas sustantivas de saldos y transacciones',
                    'Informes con hallazgos y recomendaciones de mejora',
                    'Asesoría en remediación de hallazgos'
                ],
                benefits: [
                    'Cumplimiento con requisitos regulatorios y legales',
                    'Mejora continua de procesos financieros',
                    'Mayor credibilidad ante inversionistas y bancos',
                    'Detección oportuna de áreas de mejora operativa',
                    'Preparación para procesos de due diligence',
                    'Certificación de estados financieros para juntas directivas'
                ],
                image: '/static/services/auditoria-externa.jpg',
                open: false
            },
            {
                title: 'Auditoría Forense e Investigación de Fraudes',
                description: 'Servicios especializados en la detección, investigación y prevención de fraudes financieros, malversación de fondos y conductas irregulares dentro de las organizaciones, utilizando técnicas forenses y herramientas tecnológicas avanzadas.',
                features: [
                    'Análisis forense de transacciones sospechosas',
                    'Investigación de irregularidades financieras',
                    'Recuperación de activos malversados',
                    'Pruebas periciales para procesos legales',
                    'Diseño de controles antifraude',
                    'Capacitación en ética corporativa'
                ],
                benefits: [
                    'Protección de activos y patrimonio organizacional',
                    'Disuasión de conductas fraudulentas internas',
                    'Soporte probatorio para acciones legales',
                    'Refuerzo de la cultura de integridad corporativa',
                    'Reducción de pérdidas por fraudes',
                    'Mejora de los controles internos'
                ],
                image: '/static/services/auditoria-forense.jpg',
                open: false
            }
        ]
    },
    {
        name: 'Consultoría Especializada',
        icon: 'fas fa-lightbulb',
        open: false,
        services: [
            {
                title: 'Implementación de NIIF',
                description: 'Transición completa a Normas Internacionales de Información Financiera, incluyendo diagnóstico de brechas, diseño de políticas contables, capacitación al personal y acompañamiento en los primeros cierres bajo el nuevo marco normativo.',
                features: [
                    'Diagnóstico de brechas NIIF vs normativa local',
                    'Manuales de políticas contables bajo NIIF',
                    'Capacitación a equipos financieros y operativos',
                    'Reclasificación de activos, pasivos y patrimonio',
                    'Acompañamiento en primeros cierres NIIF',
                    'Preparación de notas a los estados financieros'
                ],
                benefits: [
                    'Información financiera comparable internacionalmente',
                    'Cumplimiento con requisitos regulatorios para empresas listadas',
                    'Mejor acceso a fuentes de financiamiento internacional',
                    'Mayor transparencia en la información financiera',
                    'Valuación de activos bajo estándares globales',
                    'Preparación para procesos de fusión y adquisición'
                ],
                image: '/static/services/niff-implementacion.jpg',
                open: false
            },
            {
                title: 'Transformación Digital Financiera',
                description: 'Asesoría integral en la implementación de tecnologías para la automatización y optimización de procesos financieros y contables, incluyendo selección de ERP, herramientas de business intelligence y flujos de trabajo digitalizados.',
                features: [
                    'Diagnóstico de madurez digital del área financiera',
                    'Selección e implementación de sistemas ERP financieros',
                    'Automatización de procesos contables y de reportes',
                    'Dashboards ejecutivos con business intelligence',
                    'Migración de datos históricos a nuevas plataformas',
                    'Integración entre sistemas financieros y operativos'
                ],
                benefits: [
                    'Reducción de hasta 80% en tiempos de procesamiento',
                    'Mayor precisión en información financiera (error <0.1%)',
                    'Ahorros significativos en costos operativos',
                    'Información en tiempo real para la toma de decisiones',
                    'Eliminación de procesos manuales y redundantes',
                    'Escalabilidad para el crecimiento empresarial'
                ],
                image: '/static/services/transformacion-digital.jpg',
                open: false
            }
        ]
    }
])

const toggleCategory = (catIndex) => {
    serviceCategories.value[catIndex].open = !serviceCategories.value[catIndex].open
}

const toggleService = (catIndex, servIndex) => {
    serviceCategories.value[catIndex].services[servIndex].open =
        !serviceCategories.value[catIndex].services[servIndex].open
}

const scrollToServices = () => {
    document.querySelector('.services-section').scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
/* Estilos modernos para el hero */
.portfolio-hero {
    background: linear-gradient(135deg, #1a4b7a 0%, #6699CC 100%);
    color: white;
    padding: 120px 0;
    position: relative;
    overflow: hidden;
}

.hero-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    z-index: 2;
    text-align: center;
}

.logo {
    height: 80px;
    margin-bottom: 30px;
}

.portfolio-hero h1 {
    font-size: 3.2rem;
    font-weight: 700;
    margin-bottom: 20px;
    line-height: 1.2;
}

.portfolio-hero h1 span {
    color: #FFD700;
    /* Dorado para contraste */
    font-weight: 600;
}

.hero-subtitle {
    font-size: 1.4rem;
    max-width: 700px;
    margin: 0 auto 40px;
    opacity: 0.9;
}

.hero-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
}

.hero-decoration .decoration-circle {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255, 215, 0, 0.1);
    top: -150px;
    right: -150px;
}

.hero-decoration .decoration-line {
    position: absolute;
    height: 100%;
    width: 1px;
    background: rgba(255, 255, 255, 0.1);
    left: 50%;
    top: 0;
}

/* Estilos modernos para servicios */
.services-section {
    padding: 100px 0;
    background-color: #f9fbfd;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    color: #1a4b7a;
    margin-bottom: 15px;
}

.section-title span {
    color: #cc3333;
}

.section-subtitle {
    text-align: center;
    color: #4a5568;
    font-size: 1.2rem;
    max-width: 700px;
    margin: 0 auto 60px;
}

.services-accordion {
    max-width: 1000px;
    margin: 0 auto;
}

.category-header {
    background: white;
    padding: 20px 25px;
    border-radius: 10px;
    margin-bottom: 15px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.category-header:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.category-header.active {
    background: #1a4b7a;
    color: white;
}

.category-header.active h3 {
    color: white;
}

.category-header.active .category-icon {
    background: white;
    color: #1a4b7a;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 20px;
}

.category-icon {
    width: 50px;
    height: 50px;
    background: #1a4b7a;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: all 0.3s ease;
}

.category-header h3 {
    font-size: 1.3rem;
    margin: 0;
    color: #1a4b7a;
    transition: all 0.3s ease;
}

.category-content {
    max-height: 0;
    overflow: hidden;
    transition: all 0.5s ease;
    padding-left: 70px;
}

.category-content.open {
    max-height: 5000px;
    margin-bottom: 40px;
}

.service-item {
    margin-bottom: 20px;
    border-left: 2px solid #e2e8f0;
    padding-left: 25px;
    position: relative;
}

.service-item::before {
    content: '';
    position: absolute;
    left: -2px;
    top: 0;
    height: 100%;
    width: 2px;
    background: #cc3333;
    transform: scaleY(0);
    transform-origin: top;
    transition: transform 0.5s ease;
}

.service-item:hover::before {
    transform: scaleY(1);
}

.service-header {
    padding: 15px 0;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.service-header h4 {
    font-size: 1.1rem;
    color: #2d3748;
    margin: 0;
    font-weight: 600;
}

.service-header i {
    color: #6699CC;
    transition: all 0.3s ease;
}

.service-details {
    display: flex;
    max-height: 0;
    overflow: hidden;
    transition: all 0.5s ease;
    gap: 30px;
}

.service-details.expanded {
    max-height: 2000px;
    margin-bottom: 30px;
}

.detail-content {
    flex: 2;
}

.service-description {
    color: #4a5568;
    line-height: 1.7;
    margin-bottom: 20px;
}

.detail-sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}

.detail-section h5 {
    color: #1a4b7a;
    font-size: 1rem;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.detail-section h5 i {
    color: #cc3333;
}

.detail-section ul {
    padding-left: 0;
    list-style: none;
}

.detail-section li {
    margin-bottom: 10px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: #4a5568;
}

.detail-section li i {
    color: #6699CC;
    font-size: 0.6rem;
    margin-top: 6px;
}

.service-image {
    flex: 1;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    align-self: flex-start;
}

.service-image img {
    width: 100%;
    height: auto;
    transition: transform 0.5s ease;
}

.service-image:hover img {
    transform: scale(1.05);
}

/* Botones modernos */
.primary-btn,
.secondary-btn {
    padding: 12px 30px;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
}

.primary-btn {
    background: #cc3333;
    color: white;
    border: none;
    box-shadow: 0 4px 15px rgba(204, 51, 51, 0.3);
}

.primary-btn:hover {
    background: #a82a2a;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(204, 51, 51, 0.4);
}

.secondary-btn {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.secondary-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px);
}

/* Responsive */
@media (max-width: 992px) {
    .portfolio-hero h1 {
        font-size: 2.5rem;
    }

    .detail-sections {
        grid-template-columns: 1fr;
    }

    .service-details {
        flex-direction: column;
    }

    .service-image {
        margin-top: 20px;
    }
}

@media (max-width: 768px) {
    .portfolio-hero {
        padding: 80px 0;
    }

    .portfolio-hero h1 {
        font-size: 2rem;
    }

    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }

    .category-content {
        padding-left: 30px;
    }
}

@media (max-width: 576px) {
    .header-content {
        flex-direction: column;
        gap: 10px;
        text-align: center;
    }

    .category-icon {
        margin-bottom: 10px;
    }
}
</style>