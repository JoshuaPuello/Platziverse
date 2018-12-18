'use strict'

const debug = require('debug')('platziverse:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const db = require('./')

const prompt = inquirer.createPromptModule()

async function setup () {
  const answer = await prompt([
    {
      type: 'confirm',
      name: 'setup',
      message: 'This will destroy your db, are you sure?'
    }
  ])

  if (!answer.setup) {
    return console.log('Nothing happened')
  }

  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.USER || 'platzi',
    password: process.env.PASS || 'platzi',
    host: process.env.HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }

  await db(config).catch(handleFatalError)

  console.log('Success!')
  process.exit(0)
}

function handleFatalError (err) {
  console.log(`${chalk.red('[fatal error]')} ${err.message}`)
  console.log(err.stack)
  process.exit(1)
}

setup()
