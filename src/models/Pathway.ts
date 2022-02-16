import {model, Schema} from "mongoose";

const pathwaySchema = new Schema({
    "host": {
        type: String,
        required: true
    },
    "runId": {
        type: String,
        required: true
    }
})

export const Pathway = model('pathways', pathwaySchema)