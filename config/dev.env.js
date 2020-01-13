'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //API_URL:'"https://api.7glb.com/gw"',
  //PAY_URL:'"https://trpay.7glb.com"',
  API_URL:'"https://lmonline-test.e-tianrong.com/gw"',
  PAY_URL:'"https://lmonline-test.e-tianrong.com"',
  WXMP_APPID:'"wxa446fbfc9116252c"'
})
