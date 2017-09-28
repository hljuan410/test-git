const fetch = require('node-fetch')
const list = require('../config/app.config').proxy
const https = require('https')
const {
  stringify
} = require('querystring')

module.exports = function (router) {
  Object.keys(list).forEach(key => {
    router.get(key, async(ctx, next) => {
      let query = stringify(ctx.query)
      let url = list[key] + (query && '?') + query
      console.log('[proxy]', key, '=>', url)
      let data = await fetch(url, {
        agent: new https.Agent({
          rejectUnauthorized: false
        })
      }).then(res => res.text())
      ctx.body = data
    })
  })
}