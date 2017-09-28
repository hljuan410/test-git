module.exports = function(token, query) {
  let data = {}
  try {
    data = require('../../data/' + token)(query)
  } catch (error) {}
  return new Promise((resolve, reject) => {
    resolve(data)
  })
}