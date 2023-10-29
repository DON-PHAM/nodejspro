require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const {default: helmet} = require('helmet')
const app = express()

console.log(`Process::`, process.env)
//init middleware 
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({extends: true}))

//init db
require('./dbs/init.mongodb')
//init routes
app.use('',require('./routes'))

//handling error

module.exports = app