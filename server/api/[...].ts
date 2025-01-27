import type { H3Event, HTTPMethod } from "h3";
import { FetchError } from "ofetch";

const API_URL = "http://localhost:8000";

export default defineEventHandler(async (event) => {
    const route = event.context.params?._; // Ruta que se está solicitando
    const query = getQuery(event); // Parámetros de la query
    const method: HTTPMethod = event.method; // Método HTTP
    const requestHeaders = getHeaders(event); // Headers de la solicitud
    const token = getCookie(event, "token"); // Token de sesión
    const refreshToken = getCookie(event, "refresh_token");

    // Configurar encabezados base
    const headers: Record<string, string> = {
        "Content-Type": requestHeaders["content-type"] || "application/json",
        "Accept": "application/json",
    };

    // Verificar si la ruta no es "menu" para agregar el token
    if (route !== 'menu' && token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const reqOpts: Record<string, unknown> = {
        method,
        headers,    
        query,
    };

    // Si la ruta es "menu", evitar agregar el token
    if (route === 'menu') {
        const url = `${API_URL}/public/menu/`;
        console.log(`Fetching public menu from: ${url}`);
        // Realiza la solicitud exactamente como el navegador lo haría
        return await $fetch(url, {
            method: "GET", // Método explícito
        });
    }
    

    if (["POST", "PUT", "PATCH"].includes(method)) {
        if (headers["Content-Type"] === "application/json") {
            reqOpts.body = await readBody(event);
        } else {
            reqOpts.body = await readRawBody(event, false);
        }
    }

    try {
        let url = `${API_URL}/${route}/`;

        const response = await $fetch(url, reqOpts);
        return response;
    } catch (error) {
        if (error instanceof FetchError) {
            setResponseStatus(event, error.statusCode);
            if (error.statusCode === 401 && refreshToken) {
                // Si el token ha expirado, intenta refrescarlo
                const refreshed = await refreshAccessToken(refreshToken);
                if (refreshed) {
                    headers["Authorization"] = `Bearer ${refreshed.accessToken}`;
                    const retryResponse = await $fetch(url, reqOpts);
                    return retryResponse;
                }
            }
            return error.data;
        }
        setResponseStatus(event, 500);
        return { error: JSON.stringify(error) };
    }
});
