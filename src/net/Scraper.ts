import {GET} from "./NETEssentials";
import {hrefRegex} from "../../../globalutils/PageUtils";
import config from '../../config.json'
import {Pathway} from "../models/Pathway";
import {WebSocket} from 'ws'

export const crawlWeb = async (url: string, to: string, run: string, socket: WebSocket, found: string, depth: number, scanned: number) => {

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
                await crawlWeb(`${config.wikiUrl}${matches[1]}`, to, run, socket, found, depth, scanned)
            }
        }
    } while (matches)
    depth--;
}