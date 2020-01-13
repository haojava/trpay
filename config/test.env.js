'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  API_URL:'"https://lmonline-test.e-tianrong.com/gw"',
  PAY_URL:'"https://lmonline-test.e-tianrong.com"',
  WXMP_APPID:'"wxe8dcf4e63b937ac4"'
})

