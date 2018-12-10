require('dotenv').config()
const { send, json } = require('micro')
const { router, get, post, options } = require('microrouter')
const jwt = require('jwt-simple')
const secret = process.env.JWT_SECRET

const authenticate = async (req, res, callback) => {
  let body = await json(req)
  let token = body.jwt
  try {
    let decoded = jwt.decode(token, secret)
    if (decoded) {
      res.setHeader('Access-Control-Allow-Origin', '*')
      // Add specific authentication scope handling here
      return callback(req, res)
    }
  } catch (err) {
    send(res, 401, 'Authentication failed: ' + err.message)
    return false
  }
}

/* ══════════════════════════════════
    ⚡️Text analysis modules⚡️
══════════════════════════════════ */

/* ------- IBM Watson APIs ------- */

// Tone Analyzer
const wta = require('./watson/toneAnalyzer.js')
let toneAnalyzerResponse = async (req, res) => {
  await authenticate(req, res, async () => {
    let body = await json(req)
    let text = body.text
    let response = await wta.all(text)
    return send(res, 200, response)
  })
}

// Natural Language Understanding
const wnlu = require('./watson/naturalLanguageUnderstanding.js')
let naturalLanguageUnderstandingResponse = async (req, res) => {
  await authenticate(req, res, async () => {
    let body = await json(req)
    let text = body.text
    let response = await wnlu.all(text)
    return send(res, 200, response)
  })
}

/* ------- Google Cloud APIs ------- */

// Cloud Natural Language
const gnl = require('./google/naturalLanguage.js')
let naturalLanguageResponse = async (req, res) => {
  console.log(1)
  await authenticate(req, res, async () => {
    let body = await json(req)
    let text = body.text
    let response = await gnl.all(text)
    return send(res, 200, response)
  })
}

/* ------- Microsoft Azure APIs ------- */

// Text Analytics
const ata = require('./azure/textAnalytics.js')
let textAnalyticsResponse = async (req, res) => {
  await authenticate(req, res, async () => {
    let body = await json(req)
    let text = body.text
    let response = await ata.all(text)
    return send(res, 200, response)
  })
}

/* ------- Combo ------- */

// Returns combined set of emotions, sentiments & entities found in entered document
let allTextEmotionResponses = async (req, res) => {
  let body = await json(req)
  let text = body.text

  let wtaResponse = await wta.all(text)
  // let wnluResponse = await wnlu.all(text)
  let gnlResponse = await gnl.all(text)
  let ataResponse = await ata.all(text)

  let allResponses = {
    'text': text,
    'wta': JSON.parse(wtaResponse),
    // 'wnlu': JSON.parse(wnluResponse),
    'gnl': gnlResponse,
    'ata': ataResponse
  }
  return allResponses
}

// Parses responses from different sources to a neat singular response object
// This will contain application specific logic
let parseResponses = (responsesObject) => {
  let text = responsesObject.text
  let detectedEmotions = responsesObject.wta.document_tone.tones
  let sentiment = responsesObject.ata.sentiment.documents[0].score
  let entities = responsesObject.gnl.entitySentiment[0].entities
  let response = {
    text,
    detectedEmotions,
    sentiment,
    entities
  }
  return response
}

// Sends full raw text analysis JSON
let analyseTextRaw = async (req, res) => {
  await authenticate(req, res, async () => {
    let raw = await allTextEmotionResponses(req, res)
    return send(res, 200, raw)
  })
}

// Sends parsed & processed text analysis JSON
let analyseTextParsed = async (req, res) => {
  await authenticate(req, res, async () => {
    let raw = await allTextEmotionResponses(req, res)
    let parsed = parseResponses(raw)
    return send(res, 200, parsed)
  })
}

async function handlePreflight (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Credentials', false)
  res.setHeader('Access-Control-Max-Age', '86400')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
  send(res, 200)
}

// Manage routes with micro-router❤️
const routes = router(
  get('/', (req, res) => {
    send(res, 200, 'shape-decoder api v1')
  }),
  options('*', handlePreflight),
  post('/watson/toneAnalyzer', toneAnalyzerResponse),
  post('/watson/naturalLanguageUnderstanding', naturalLanguageUnderstandingResponse),
  post('/google/naturalLanguage', naturalLanguageResponse),
  post('/azure/textAnalytics', textAnalyticsResponse),
  post('/analyse-text-raw', analyseTextRaw),
  post('/analyse-text', analyseTextParsed)
)

module.exports = routes
