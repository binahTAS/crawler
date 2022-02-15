import {WikiLinks} from "../models/WikiLinks";

export const store = async (host: string, link: string) => {
    const existing = await WikiLinks.find({host: host},(err, obj) => {
        return obj;
    }).clone()

    if(existing.length === 0) {
        const wl = new WikiLinks({
            host: host,
            links: [link]
        })

        await wl.save()
        return
    }

    const links = existing[0].links;
    for (let i = 0; i < links.length; i++) {
        if(link === links[i])
            return
    }
    existing[0].links.push(link)
    await WikiLinks.findOneAndUpdate({host: host}, existing[0])
}