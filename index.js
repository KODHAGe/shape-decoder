require('dotenv').config()
const { send } = require('micro')
const { router, get } = require('microrouter')

/* ══════════════════════════════════
    Text analysis
══════════════════════════════════ */

/* ------- IBM Watson APIs ------- */

// Tone Analyzer
const wta = require('./watson/toneAnalyzer.js')
let toneAnalyzerResponse = async (req, res) => {
  let text = req.params.text.replace(/\+/g, ' ')
  let response = await wta.all(text)
  send(res, 200, response)
}

// Natural Language Understanding
const wnlu = require('./watson/naturalLanguageUnderstanding.js')
let naturalLanguageUnderstandingResponse = async (req, res) => {
  let text = req.params.text.replace(/\+/g, ' ')
  let response = await wnlu.all(text)
  send(res, 200, response)
}
/* ------- Google Cloud APIs ------- */

// Cloud Natural Language
const gnl = require('./google/naturalLanguage.js')
let naturalLanguageResponse = async (req, res) => {
  let text = req.params.text.replace(/\+/g, ' ')
  let response = await gnl.all(text)
  send(res, 200, response)
}
/* ------- Microsoft Azure APIs ------- */

// Text Analytics
const ata = require('./azure/textAnalytics.js')
let textAnalyticsResponse = async (req, res) => {
  let text = req.params.text.replace(/\+/g, ' ')
  let response = await ata.all(text)
  send(res, 200, response)
}

const routes = router(
  get('/', (req, res) => {
    send(res, 200, 'shape-decoder api v1')
  }),
  get('/watson/toneAnalyzer/:text', toneAnalyzerResponse),
  get('/watson/naturalLanguageUnderstanding/:text', naturalLanguageUnderstandingResponse),
  get('/google/naturalLanguage/:text', naturalLanguageResponse),
  get('/azure/textAnalytics/:text', textAnalyticsResponse)
)

module.exports = routes
