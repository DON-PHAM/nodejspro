'use strict'

const _ = require('lodash')

//Get Info data response use lodash

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

module.exports = {
    getInfoData
}