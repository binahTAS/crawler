import {CRAWLER} from "../../globalutils/ConsoleNames";
import {requestWikipedia} from "./tests/TestConnection";
import {crawl} from "./net/Scraper";

console.log(`${CRAWLER} Initializing.`)

const init = async () => {
    console.log(`${CRAWLER} Testing connection to Wikipedia...`)
    if(!(await requestWikipedia())) {
        console.log(`${CRAWLER} Error while establishing connection. Wikipedia down?`)
        process.exit(0);
    }
    console.log(`${CRAWLER} Tests ran successfully.`)
    console.log(`${CRAWLER} Starting crawler...`)
    await crawl('https://en.wikipedia.org/wiki/Bring_Me_the_Horizon')
}

init().then(r => {
    console.log(`${CRAWLER} Exiting...`)
})