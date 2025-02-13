import type { H3Event, HTTPMethod } from "h3";
import { FetchError } from "ofetch";
import { jwtDecode } from "jwt-decode"; // Asegúrate de tener instalada esta biblioteca

export const API_URL = "http://localhost:8000";

export default defineEventHandler(async (event) => {
    // 🔍 Obtener información clave
    const route = event.context.params?._ || ""; // Evitar undefined
    const query = getQuery(event);
    const method: HTTPMethod = event.method;
    const requestHeaders = getHeaders(event);
    
    const refreshToken = getCookie(event, "refresh_token");
    const accessToken = getCookie(event, "token");

    // 🔥 Log para depurar
    console.log("➡️ URL solicitada:", event.node.req.url);
    console.log("➡️ Ruta evaluada:", route);
    
    // 🔓 Permitir cualquier ruta en `api/public/`
    if (route.startsWith("public/menu") || route.startsWith("media/")) {
        console.log("✅ Acceso sin autenticación:", route);

        // Verificar si el token está disponible y es válido
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        };
        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken);
                const currentTime = Date.now() / 1000; // Tiempo actual en segundos
                if (decodedToken.exp > currentTime) {
                    headers["Authorization"] = `${accessToken}`;
                } else {
                    console.log("⛔ Token expirado.");
                }
            } catch (error) {
                console.error("Error decodificando el token:", error);
            }
        }
        
        return await $fetch(`${API_URL}/${route}/`, { headers });
    }

    // 🔒 Verificar autenticación para rutas privadas
    // Configurar headers
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    if (accessToken) {
        headers["Authorization"] = `${accessToken}`;
    }

    console.log("🔑 Token de acceso:", accessToken);

    const reqOpts: Record<string, unknown> = {
        method,
        headers,
        query,
    };

    // Manejar métodos que envían datos en el body
    if (["POST", "PUT", "PATCH"].includes(method)) {
        reqOpts.body = headers["Content-Type"] === "application/json"
            ? await readBody(event)
            : await readRawBody(event, false);
    }

    try {
        let url = `${API_URL}/${route}/`;
        console.log("🌍 Fetch a:", url);
        console.log("🔧 Opciones:", reqOpts);
        const response = await $fetch(url, reqOpts);
        return response;
    } catch (error) {
        if (error instanceof FetchError) {
            setResponseStatus(event, error.statusCode);
            console.error("⚠️ FetchError:", error.statusCode, error.data);
            
            // Intentar refrescar token si expira
            if (error.statusCode === 401 && refreshToken) {
                const refreshed = await refreshAccessToken(refreshToken);
                if (refreshed) {
                    headers["Authorization"] = `Bearer ${refreshed.accessToken}`;
                    return await $fetch(url, reqOpts);
                }
            }
            return error.data;
        }
        setResponseStatus(event, 500);
        console.error("❌ Error inesperado:", error);
        return { error: JSON.stringify(error) };
    }
});
