const proposalsService = require('./proposals')

let cache = null
const get = () => cache

function poll(interval = 60000) {
  proposalsService.fetchAll(updateThenPoll)

  function updateThenPoll (err, proposals) {
    setTimeout(() => poll(), interval)

    if (err) {
      console.error(err)
      return
    }

    cache = proposals
  }
}

module.exports = { poll, get }
