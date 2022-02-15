import {model, Schema} from "mongoose";

const wikiLinksSchema = new Schema({
    "host": {
        type: String,
        required: true
    },
    "links": {
        type: Array,
        required: true
    }
})

export const WikiLinks = model('WikiLinks', wikiLinksSchema)