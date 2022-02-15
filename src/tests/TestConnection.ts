import {GET} from "../net/NETEssentials";

export const requestWikipedia = async () => {
    const resMain = await GET('https://en.wikipedia.org/wiki/Main_Page')
    if(!resMain)
        return false
    return await GET('https://en.wikipedia.org/wiki/Bring_Me_the_Horizon');
}