import axios from 'axios'
import {CRAWLER} from "../../../globalutils/ConsoleNames";

export const GET = async (url: string) => {
    return await axios.get(url).then((response) => {
        return response.data
    })
        .catch(err => {
            console.log(`${CRAWLER} ${err}`)
        })
}