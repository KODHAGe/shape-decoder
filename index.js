require('dotenv').config()
const { send, json } = require('micro')
const { router, get, post } = require('microrouter')

/* ══════════════════════════════════
    ⚡️Text analysis modules⚡️
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
  console.log(text)
  let response = await gnl.all(text)
  send(res, 200, response)
}

/* ------- Microsoft Azure APIs ------- */

// Text Analytics
const ata = require('./azure/textAnalytics.js')
let textAnalyticsResponse = async (req, res) => {
  let text = req.params.text.replace(/\+/g, ' ')
  console.log(text)
  let response = await ata.all(text)
  send(res, 200, response)
}

/* ------- Combo ------- */

// Returns combined set of emotions, sentiments & entities found in entered document
let allTextEmotionResponses = async (req, res) => {
  const body = await json(req)
  const text = body.text

  let wtaResponse = await wta.all(text)
  let wnluResponse = await wnlu.all(text)
  let gnlResponse = await gnl.all(text)
  let ataResponse = await ata.all(text)

  let allResponses = {
    'wta': JSON.parse(wtaResponse),
    'wnlu': JSON.parse(wnluResponse),
    'gnl': gnlResponse,
    'ata': ataResponse
  }
  return allResponses
}

// Parses responses from different sources to a neat singular response object
// This will contain application specific logic
let parseResponses = (responsesObject) => {
  let detectedEmotions = responsesObject.wta.document_tone.tones
  let sentiment = responsesObject.ata.sentiment.documents[0].score
  let response = {
    detectedEmotions,
    sentiment
  }
  return response
}

// Sends full raw text analysis JSON
let analyseTextRaw = async (req, res) => {
  let raw = await allTextEmotionResponses(req, res)
  send(res, 200, raw)
}

// Sends parsed & processed text analysis JSON
let analyseTextParsed = async (req, res) => {
  let raw = await allTextEmotionResponses(req, res)
  let parsed = parseResponses(raw)
  send(res, 200, parsed)
}

// Manage routes with micro-router❤️
const routes = router(
  get('/', (req, res) => {
    send(res, 200, 'shape-decoder api v1')
  }),
  post('/watson/toneAnalyzer/:text', toneAnalyzerResponse),
  post('/watson/naturalLanguageUnderstanding/:text', naturalLanguageUnderstandingResponse),
  post('/google/naturalLanguage/:text', naturalLanguageResponse),
  post('/azure/textAnalytics/:text', textAnalyticsResponse),
  post('/analyse-text-raw', analyseTextRaw),
  post('/analyse-text', analyseTextParsed)
)

module.exports = routes
