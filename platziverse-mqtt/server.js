'use strict'

const debug = require('debug')('platziverse:mqtt')
const mosca = require('mosca')
const redis = require('redis')
const chalk = require('chalk')
const db = require('platziverse-db')

const backend = {
  type: 'redis',
  redis,
  return_buffers: true
}

const settings = {
  port: 1883,
  backend
}

const config = {
  database: process.env.DB_NAME || 'platziverse',
  username: process.env.DB_USER || 'platzi',
  password: process.env.DB_PASS || 'platzi',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: s => debug(s)
}

const server = new mosca.Server(settings)

server.on('clientConnected', client => {
  debug(`Client connected ${client.id}`)
})

server.on('clientDisconnected', client => {
  debug(`Client disconnected ${client.id}`)
})

server.on('published', (packet, client) => {
  debug(`Recieved: ${packet.topic}`)
  debug(`Payload: ${packet.payload}`)
})

server.on('ready', () => {
  console.log(`${chalk.green('[platziverse-mqtt]')} server is running`)
})

server.on('error', handleFatalError)

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

server.on('uncaughtException', handleFatalError)
server.on('unhanledException', handleFatalError)
