const mongoose = require('mongoose')

async function connectDB(mongoUri) {
  if (!mongoUri) {
    throw new Error('MONGO_URI is required')
  }

  await mongoose.connect(mongoUri)

  console.log('✅ MongoDB connected')
}

module.exports = connectDB
