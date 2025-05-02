import Swal from 'sweetalert2';

export const handleResponse = async (response: Response) => {
    console.log('handleResponse', JSON.stringify(response));
    try {
        const data = await response.json();
        
        if (!response.ok) {
            const errorMessages = data.messages ? data.messages.map((msg: any) => msg.message).join(' | ') : data.detail || 'Error desconocido';
            Swal.fire({
                title: 'Error',
                text: errorMessages,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            throw new Error(errorMessages);
        }

        return data;
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al procesar la solicitud.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        throw error;
    }
};
