import Swal from 'sweetalert2';

const API_URL = "http://localhost:8000";

export const handleFetch = async (url: string, options: RequestInit) => {
    try {
        if (!options) {
            throw new Error("Las opciones de la solicitud son indefinidas.");
        }
        if (!options.method) {
            throw new Error("El método de la solicitud es indefinido.");
        }

        const fullUrl = `${API_URL}/${url}`;
        console.log("🌍 URL completa:", fullUrl); // Log de la URL completa
        console.log("🔧 Opciones:", options); // Log de las opciones

        const response = await fetch(fullUrl, options);
        if (!response.ok) {
            const errorText = await response.text(); // Obtener el texto del error completo
            let errorData;
            try {
                errorData = JSON.parse(errorText); // Intentar parsear el JSON
            } catch {
                errorData = { detail: errorText }; // Si no es JSON, usar el texto como detalle
            }

            const action = getAction(options.method); // Obtener la acción (Crear, Actualizar, Eliminar)
            const entity = getEntityFromUrl(url); // Obtener la entidad desde la URL
            const humanizedMessage = humanizeErrorMessage(errorData, action, entity);
            Swal.fire({
                title: 'Error',
                text: humanizedMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            throw new Error(humanizedMessage); // Lanzar el error para manejarlo
        }
        return await response.json();
    } catch (error: any) {
        const errorMessage = error.message || 'Error de red o de servidor';
        Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        throw error; // Volver a lanzar el error para manejarlo
    }
};

function getAction(method: string | undefined): string {
  switch (method) {
    case 'POST':
      return 'Crear';
    case 'PUT':
    case 'PATCH':
      return 'Actualizar';
    case 'DELETE':
      return 'Eliminar';
    default:
      return 'Operar';
  }
}

function getEntityFromUrl(url: string): string {
  const segments = url.split('/');
  return segments.length > 1 ? segments[1] : 'entidad';
}

function humanizeErrorMessage(error: any, action: string, entity: string): string {
  if (typeof error === 'object' && !Array.isArray(error)) {
    return Object.entries(error)
      .map(([key, messages]) => `${action} ${entity}: ${key} - ${(messages as string[]).join(', ')}`)
      .join(' | ');
  }
  return `${action} ${entity}: ${error.detail}`;
}

export default handleFetch;
