'use strict'

const setupDatabase = require('./lib/db')
const setupAgentModel = require('./models/metric')
const setupMetricModel = require('./models/agent')

module.exports = async function (config) {
  const sequelize = setupDatabase(config)
  const agentModel = setupAgentModel(config)
  const metricModel = setupMetricModel(config)

  agentModel.hasMany(metricModel)
  metricModel.belongsTo(agentModel)

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true })
  }

  const Agent = {}
  const Metric = {}

  return {
    Agent, Metric
  }
}
