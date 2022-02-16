import {GET} from "./NETEssentials";
import {hrefRegex, specialTagRegex} from "../../../globalutils/PageUtils";
import config from '../../config.json'
import {CRAWLER} from "../../../globalutils/ConsoleNames";
import {store} from "../etc/StoringManager";
import {WikiLinks} from "../models/WikiLinks";
import {Pathway} from "../models/Pathway";
import {WebSocket} from 'ws'

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
        if (matches && matches[1].startsWith('/wiki/') && !specialTagRegex.test(matches[1]) && !specialTagRegex.test(url.replace(config.wikiUrl, ''))) {
            if (`${config.wikiUrl}${matches[1]}` !== url && `${config.wikiUrl}${matches[1]}` !== lastLayerURL && `${config.wikiUrl}${matches[1]}` !== secondLastLayerURL) {
                const existing = await WikiLinks.find({host: `${config.wikiUrl}${matches[1]}`}, (err, obj) => {
                    return obj;
                }).clone()

                if (existing.length === 0) {
                    scanned++;
                    //console.log(`${(`${config.wikiUrl}${matches[1]}` === url)} || ${config.wikiUrl}${matches[1]} || ${url}`)

                    await store(url, matches[1])
                    console.log(`${CRAWLER} Layer ${depth}/${scanned} (${scanned - depth}) | ${matches[1]}`)

                    depth++;
                    if (scanned % 2 === 0)
                        lastLayerURL = `${config.wikiUrl}${matches[1]}`
                    else
                        secondLastLayerURL = `${config.wikiUrl}${matches[1]}`
                    await crawl(`${config.wikiUrl}${matches[1]}`)
                }
            } else {
                break;
            }
        }
    } while (matches);
    depth--;
}

export const crawlLight = async (url: string, to: string, run: number) => {
    const dom = await GET(url);
    let matches;

    console.log(`${CRAWLER} Layer ${depth}/${scanned} (${scanned - depth}) | ${url}`)
    do {
        matches = hrefRegex.exec(dom)

        if (matches && matches[1].startsWith('/wiki/')) {

            const pathGone = await Pathway.findOne({runId: run, host: matches[1]})

            if(!pathGone) {
                const path = new Pathway({
                    runId: run,
                    host: matches[1]
                })
                await path.save()

                scanned++;
                console.log(`${CRAWLER} Layer ${depth}/${scanned} (${scanned - depth}) | Processing => ${matches[1]}`)

                if (`${config.wikiUrl}${matches[1]}` === to) {
                    process.exit(1);
                }

                depth++;
                await crawlLight(`${config.wikiUrl}${matches[1]}`, to, run)
            }
        }
    } while (matches)
    depth--;
}

export const crawlWeb = async (url: string, to: string, run: string, socket: WebSocket, found: string) => {

    if(found === to) {
        return
    }

    const dom = await GET(url);
    let matches;

    do {
        matches = hrefRegex.exec(dom)

        if (matches && matches[1].startsWith('/wiki/')) {

            const pathGone = await Pathway.findOne({runId: run, host: matches[1]})

            if(!pathGone) {
                const path = new Pathway({
                    runId: run,
                    host: matches[1]
                })
                await path.save()

                scanned++;
                socket.send(JSON.stringify({
                    layer: depth,
                    scanned: scanned,
                    current: matches[1],
                    finished: false,
                    runId: run
                }))

                if (`${config.wikiUrl}${matches[1]}` === to) {
                    socket.send(JSON.stringify({
                        layer: depth,
                        scanned: scanned,
                        current: matches[1],
                        finished: true,
                        runId: run
                    }))
                    found = to;
                    return
                }

                depth++;
                await crawlWeb(`${config.wikiUrl}${matches[1]}`, to, run, socket, found)
            }
        }
    } while (matches)
    depth--;
}