// server/api/me.ts
const API_URL = "http://localhost:8000"

export default defineEventHandler(async (event) => {
    const backendUrl = `${API_URL}/auth/users/me/`
    const token = getCookie(event, "token")
    
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    } as any

    if (token) headers["Authorization"] = `${token}`

    try {
        return await $fetch(backendUrl, {
            method: "GET",
            headers
        })
    } catch(error) {
        return { error: "No autorizado" }
    }
})