function getHealth(req, res) {
  res.json({ status: 'ok', message: 'LiftLog API is running' })
}

module.exports = {
  getHealth,
}
