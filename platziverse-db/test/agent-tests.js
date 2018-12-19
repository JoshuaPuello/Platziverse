'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const agentFixture = require('./fixtures/agent')

let single = Object.assign({}, agentFixture.single)
let id = 1
let AgentStub = null
let db = null
let sandbox = null

let config = {
  logging: function () {
  }
}

let MetricStub = {
  belongsTo: sandbox.spy()
}

test.beforeEach(async () => {
  sandbox = sinon.sandbox.create()
  AgentStub = {
    hasMany: sandox.spy()
  }
  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })
  db = await setupDatabase(config)
})

test.afterEach(() => {
  sandbox && sinon.sandbox.restore()
})

test('make it pass', t => {
  t.truthy(db.Agent, 'Agent service should exist')
})

test.serial('Setup', t => {
    t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
    t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the model')
    t.true(MetricStub.belongsTo.called, 'MetricModel.belongsTo was executed')
    t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the model')
})

test.serial('Agent#findById', async t => {
    let agent = await db.Agent.findById(id)

    t.deepEqual(agent, agentFixture.byId(id), 'should be the same')
})