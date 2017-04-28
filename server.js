const path = require('path')
const cors = require('cors')
const express = require('express')
const moment = require('moment')
const pollerService = require('./poller')
const app = express()
const port = process.argv.PORT || 9000
const stages = {
  finished: [4],
  active: [1, 2, 3],
  proposed: [0]
}

app.disable('x-powered-by')

app.set('json spaces', 2)
app.set('view engine', 'pug')

app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))

app.get('/:type(finished|active|proposed)?', (req, res, next) => {
  const { type } = req.params
  const proposals = filterProposals(type)
  if (!proposals) {
    next('route')
    return
  }
  res.render('index.pug', { proposals, moment })
})

app.get('/proposals/:type(finished|active|proposed)?', (req, res, next) => {
  const { type } = req.params
  const proposals = filterProposals(type)
  if (!proposals) {
    next('route')
    return
  }
  res.json(proposals)
})

app.listen(port, () =>
  console.log(`app listening on port ${ port }`)
)

pollerService.poll()

function filterProposals(type) {
  const proposals = pollerService.get()
  if (!proposals) {
    return null
  }
  if (type) {
    return proposals.filter(proposal =>
      stages[type].includes(proposal.stage)
    )
  }
  return proposals
}
