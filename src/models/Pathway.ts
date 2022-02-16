import {model, Schema} from "mongoose";

const pathwaySchema = new Schema({
    "host": {
        type: String,
        required: true
    },
    "runId": {
        type: Number,
        required: true
    }
})

export const Pathway = model('pathways', pathwaySchema)