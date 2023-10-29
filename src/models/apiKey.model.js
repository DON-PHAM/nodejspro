'use strict'

const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'ApiKey'

const apiKeySchema = new Schema( {
    key: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000','1111','2222']
    }
}, {
    collation: DOCUMENT_NAME,
    timestamps: true
})

module.exports = model(COLLECTION_NAME, apiKeySchema)