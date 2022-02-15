import {GET} from "../net/NETEssentials";
import {specialTagRegex} from "../../../globalutils/PageUtils";

export const requestWikipedia = async () => {
    const resMain = await GET('https://en.wikipedia.org/wiki/Main_Page')
    if(!resMain)
        return false
    return await GET('https://en.wikipedia.org/wiki/Bring_Me_the_Horizon');
}

export const testRegex = () => {
    return specialTagRegex.test('/wiki/Jlehrcalpoly/course_wizard/Grading')
}