// api/[...].ts
import type { H3Event, HTTPMethod } from "h3"
import { FetchError } from "ofetch"
import { jwtDecode } from "jwt-decode"

export const API_URL = "http://localhost:8000"

export default defineEventHandler(async (event) => {
    const route = event.context.params?._ || ""
    const query = getQuery(event)
    const method: HTTPMethod = event.method
    const requestHeaders = getHeaders(event)
    
    const refreshToken = getCookie(event, "refresh_token")
    const accessToken = getCookie(event, "token")

    if (route.startsWith("public/menu") || route.startsWith("media/")) {
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        
        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken)
                const currentTime = Date.now() / 1000
                if (decodedToken.exp > currentTime) {
                    headers["Authorization"] = `${accessToken}`
                }
            } catch (error) {
                console.error("Error decodificando el token:", error)
            }
        }
        
        return await $fetch(`${API_URL}/${route}/`, { headers })
    }

    const headers = {
        "Content-Type": requestHeaders["content-type"] || "application/json",
        "Accept": "application/json",
    } as any

    if (accessToken) headers["Authorization"] = `${accessToken}`

    const reqOpts: Record<string, unknown> = {
        method,
        headers,
        query,
    }

    if (["POST", "PUT", "PATCH"].includes(method)) {
        reqOpts.body = headers["Content-Type"] === "application/json"
            ? await readBody(event)
            : await readRawBody(event, false)
    }

    try {
        return await $fetch(`${API_URL}/${route}/`, reqOpts)
    } catch (error) {
        if (error instanceof FetchError) {
            setResponseStatus(event, error.statusCode)
            
            if (error.statusCode === 401 && refreshToken) {
                await refreshToken()
                headers["Authorization"] = `Bearer ${useAuthTokensStorage().accessToken.value}`
                return await $fetch(`${API_URL}/${route}/`, reqOpts)
            }
            return error.data
        }
        setResponseStatus(event, 500)
        return { error: "Error interno del servidor" }
    }
})