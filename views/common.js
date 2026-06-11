export async function request(url, method, bodyData = null) {
    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: bodyData ? JSON.stringify(bodyData) : null
    }

    try {
        const response = await fetch(url, options);

        if(!response.ok) {
            throw new Error('API responded with: ' + response.status);
        }

        return await response.json()
    } catch (error) {
        console.error(`Network or connection error: ${error}`)
    }
}