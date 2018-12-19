'use strict'

const defaults = require('defaults')
const setupDatabase = require('./lib/db')
const setupAgentModel = require('./models/metric')
const setupMetricModel = require('./models/agent')
const setupAgent = require('./lib/agent')

module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  })

  const sequelize = setupDatabase(config)
  const agentModel = setupAgentModel(config)
  const metricModel = setupMetricModel(config)

  agentModel.hasMany(metricModel)
  metricModel.belongsTo(agentModel)

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true })
  }

  const Agent = setupAgent(agentModel)
  const Metric = {}

  return {
    Agent, Metric
  }
}
