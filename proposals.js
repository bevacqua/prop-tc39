const { sortBy } = require('lodash')
const { concurrent } = require('contra')
const moment = require('moment')
const request = require('request')
const cheerio = require('cheerio')
const rchampionseparator = /,\s*|\s+(?:,\s*)?(?:and|&)\s+/

function fetchAll (done) {
  concurrent({
    proposed: fetchProposed,
    active: fetchActive,
    finished: fetchFinished
  }, fetchedAll(done))
}

function fetchedAll (done) {
  return (err, result) => {
    if (err) {
      done(err)
      return
    }
    const proposals = sortProposals([
      ...result.proposed,
      ...result.active,
      ...result.finished,
    ])
    done(null, proposals)
  }
}

function fetchProposed (done) {
  fetch('https://github.com/tc39/proposals/blob/master/stage-0-proposals.md', parseProposed, done)
}
function fetchActive (done) {
  fetch('https://github.com/tc39/proposals/blob/master/README.md', parseActive, done)
}
function fetchFinished (done) {
  fetch('https://github.com/tc39/proposals/blob/master/finished-proposals.md', parseFinished, done)
}

function fetch(resource, parse, done) {
  request(resource, parseThenPoll)
  function parseThenPoll (err, res, html) {
    if (err) {
      done(err)
      return
    }
    done(null, parse(html))
  }
}

function parseActive(html) {
  const $ = cheerio.load(html)
  return sortProposals(
    $('#readme table')
      .eq(0)
      .find('tbody tr')
      .toArray()
      .map(tr => {
        const $tr = $(tr)
        const readyToAdvance = $tr.find('td:nth-child(1)').text().trim() === '🚀'
        const $title = $tr.find('td:nth-child(2)')
        const $titleLink = $title.find('a')
        const titleHtml = ($titleLink.length ? $titleLink : $title).html().trim()
        const href = $titleLink.attr('href')
        const champions = $tr.find('td:nth-child(3)').text().trim().split(rchampionseparator)
        const stage = parseInt($tr.find('td:nth-child(4)').text().trim())
        return {
          titleHtml,
          href,
          stage,
          champions,
          readyToAdvance
        }
      })
  )
}

function parseProposed(html) {
  return parseActive(html) // for now TC39 has the same table schema for active proposals and stage 0 proposals
}

function parseFinished(html) {
  const $ = cheerio.load(html)
  return sortProposals(
    $('#readme table')
      .eq(0)
      .find('tbody tr')
      .toArray()
      .map(tr => {
        const $tr = $(tr)
        const $title = $tr.find('td:nth-child(1)')
        const $titleLink = $title.find('a')
        const titleHtml = ($titleLink.length ? $titleLink : $title).html().trim()
        const href = $titleLink.attr('href')
        const champions = $tr.find('td:nth-child(2)').text().trim().split(rchampionseparator)
        const meeting = moment.utc($tr.find('td:nth-child(3)').text().trim(), 'MMMM YYYY')
        const meetingHref = $tr.find('td:nth-child(3) a').attr('href')
        const publicationYear = parseInt($tr.find('td:nth-child(4)').text().trim())
        const stage = 4
        return {
          titleHtml,
          href,
          stage,
          champions,
          meeting,
          meetingHref,
          publicationYear
        }
      })
  )
}

function sortProposals (proposals) {
  return sortBy(proposals, proposal => {
    if (proposal.publicationYear) {
      return -proposal.publicationYear
    }
    const stage = proposal.stage * 2
    const readiness = proposal.readyToAdvance ? 1 : 0
    const reverse = -1
    return (stage + readiness) * reverse
  })
}

module.exports = {
  fetchAll,
  fetchFinished,
  fetchActive,
  fetchProposed
}
