const express = require('express')
const cors = require('cors')
require('dotenv').config()

const connectDB = require('./config/db')
const healthRoutes = require('./routes/healthRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/', healthRoutes)

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

async function start() {
  try {
    await connectDB(MONGO_URI)
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('❌ Server startup error:', error && error.message ? error.message : error)
    process.exit(1)
  }
}

start()