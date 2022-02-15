import {GET} from "./NETEssentials";
import {hrefRegex, specialTagRegex} from "../../../globalutils/PageUtils";
import config from '../../config.json'
import {CRAWLER} from "../../../globalutils/ConsoleNames";
let depth = 0;
let scanned = 0;

export const crawl = async (url: string) => {
    const dom = await GET(url);
    let matches;
    do {
        matches = hrefRegex.exec(dom)
        if(matches && matches[1].startsWith('/wiki/') && !specialTagRegex.test(matches[1])) {
            if(`${config.wikiUrl}${matches[1]}` !== url) {
                scanned++;
                //console.log(`${(`${config.wikiUrl}${matches[1]}` === url)} || ${config.wikiUrl}${matches[1]} || ${url}`)
                console.log(`${CRAWLER} Layer ${depth}/${scanned} (${scanned - depth})| ${matches[1]}`)

                depth++;
                await crawl(`${config.wikiUrl}${matches[1]}`)
            }
        }
    } while (matches);
    depth--;
}