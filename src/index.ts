import {CRAWLER} from "../../globalutils/ConsoleNames";
import {requestWikipedia} from "./tests/TestConnection";

console.log(`${CRAWLER} Initializing.`)

const init = async () => {
    console.log(`${CRAWLER} Testing connection to Wikipedia...`)
    if(!(await requestWikipedia())) {
        console.log(`${CRAWLER} Error while establishing connection. Wikipedia down?`)
        process.exit(0);
    }
    console.log(`${CRAWLER} Tests ran successfully.`)
}

init()