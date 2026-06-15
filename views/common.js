export async function request(url, method, bodyData = null) {
    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: bodyData ? JSON.stringify(bodyData) : null
    }

    try {
        const response = await fetch(url, options);

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Bir hata oluştu");
        }
        return await response.json()
    } catch (error) {
        console.error(`Network or connection error: ${error}`)
        throw error;
    }
}