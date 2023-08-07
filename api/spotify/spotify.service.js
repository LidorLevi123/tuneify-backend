import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export const spotifyService = {
    getAccessToken
}

async function getAccessToken() {
    try {
        // Encode client credentials (Client ID and Client Secret)
        const credentials = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
        const encodedCredentials = Buffer.from(credentials).toString('base64')
        
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

        return data.access_token
    } catch (err) {
        console.error(
            'Error retrieving access token:',
            err.response ? err.response.data : err.message
        )
        throw err
    }
}