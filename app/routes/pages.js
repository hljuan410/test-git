const fetch = require('./lib/fetch')
module.exports = function(router) {
  router.get([
    '/',
    '/:file\.html'
  ], async function(ctx, next) {
    let name = ctx.params.file || 'index'
    let data = await fetch(name, ctx.query)
    let content = await ctx.render(name, data)
    ctx.body = content
  })
}