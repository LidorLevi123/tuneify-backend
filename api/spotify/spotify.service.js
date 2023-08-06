import config from 'dotenv'

export const spotifyService = {
    getAccessToken
}

console.log(process.env)

async function getAccessToken() {

    try {
        // Encode client credentials (Client ID and Client Secret)
        const credentials = `${config.clientId}:${config.clientSecret}`
        const encodedCredentials = btoa(credentials)
        // Make a POST request to the token endpoint
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${encodedCredentials}`,
                },
            }
        )
        // Extract and return the access token from the response
        const { data } = response
        const accessToken = data.access_token
        const expiresIn = data.expires_in

        return accessToken
    } catch (error) {
        console.error(
            'Error retrieving access token:',
            error.response ? error.response.data : error.message
        )
        throw error
    }
}