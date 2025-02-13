const API_URL = "http://localhost:8000";


export default defineEventHandler(async (event) => {
    const backendUrl = `${API_URL}/auth/users/me/`;
    const token = getCookie(event, "token");
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    } as any

    

    if (getCookie(event, "token")) {
        headers["Authorization"] = `${token}`;
    }
    //headers

    console.log("➡️ URL solicitada:", event.node.req.url);
    console.log("➡️ Ruta evaluada:", backendUrl);
    console.log("🔑 Token de acceso:", getCookie(event, "token"));
    console.log("🔑 headers: ", headers)

    try {
        const response = await $fetch(backendUrl, {
            method: "GET",
            headers
        })
        console.log("🛠️ Respuesta del servidor:", response);
        return response;
    } catch(error) {
        console.error("❌ Error en la solicitud:", error);
        return { error: "No autorizado", detalles: error };
    }
});

