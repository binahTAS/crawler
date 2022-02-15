import {GET} from "./NETEssentials";
import {hrefRegex, specialTagRegex} from "../../../globalutils/PageUtils";
import config from '../../config.json'
import {CRAWLER} from "../../../globalutils/ConsoleNames";
import {store} from "../etc/StoringManager";
import {WikiLinks} from "../models/WikiLinks";
let depth = 0;
let scanned = 0;

let lastLayerURL = '';
let secondLastLayerURL = ''

export const crawl = async (url: string) => {
    const dom = await GET(url);
    let matches;
    do {
        matches = hrefRegex.exec(dom)

        //check if starts with /wiki/
        //if match matches special urls .../wiki/some:any
        //same for url

        //check if url and match are the same
        //if url and previous url are the same
        if(matches && matches[1].startsWith('/wiki/') && !specialTagRegex.test(matches[1]) && !specialTagRegex.test(url.replace(config.wikiUrl, ''))) {
            if(`${config.wikiUrl}${matches[1]}` !== url && `${config.wikiUrl}${matches[1]}` !== lastLayerURL && `${config.wikiUrl}${matches[1]}` !== secondLastLayerURL) {
                const existing = await WikiLinks.find({host: `${config.wikiUrl}${matches[1]}`},(err, obj) => {
                    return obj;
                }).clone()

                console.log(`${CRAWLER} Layer ${depth}/${scanned} (${scanned - depth}) | Already saved.`)

                if(existing.length === 0) {
                    scanned++;
                    //console.log(`${(`${config.wikiUrl}${matches[1]}` === url)} || ${config.wikiUrl}${matches[1]} || ${url}`)

                    await store(url, matches[1])
                    console.log(`${CRAWLER} Layer ${depth}/${scanned} (${scanned - depth}) | ${matches[1]}`)

                    depth++;
                    if(scanned % 2 === 0)
                        lastLayerURL = `${config.wikiUrl}${matches[1]}`
                    else
                        secondLastLayerURL = `${config.wikiUrl}${matches[1]}`
                    await crawl(`${config.wikiUrl}${matches[1]}`)
                }
            }else {
                console.log(`${CRAWLER} [EXITING] Layer ${depth}/${scanned} (${scanned - depth})`)
                break;
            }
        }
    } while (matches);
    depth--;
}