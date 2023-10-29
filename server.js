const app = require('./src/app')

const PORT = process.env.PORT || 5055

const server = app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`))
})