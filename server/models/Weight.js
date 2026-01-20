const mongoose = require('mongoose')

const weightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    required: true,
  },
  dateKey: {
    type: String,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

weightSchema.index(
  { userId: 1, dateKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      dateKey: { $type: 'string' },
    },
  },
)

module.exports = mongoose.model('Weight', weightSchema, 'bodyweights')
