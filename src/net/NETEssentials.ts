import axios from 'axios'

export const GET = async (url: string) => {
    return await axios.get(url).then((response) => {
        return response.data
    })
}