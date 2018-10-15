const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3')

const toneAnalyser = new ToneAnalyzerV3({
  version: '2018-10-15',
  iam_apikey: process.env.WATSON_TONE_API_KEY,
  url: process.env.WATSON_TONE_URL
})

function createParams (text) {
  if (text) {
    return {
      'tone_input': { 'text': text },
      'content_type': 'application/json'
    }
  } else {
    console.log('ERROR: No text input.')
    return false
  }
}

function tone (text) {
  let toneParams = createParams(text)
  toneAnalyser.tone(toneParams, function (error, toneAnalysis) {
    if (error) {
      console.log(error)
    } else {
      console.log(JSON.stringify(toneAnalysis, null, 2))
    }
  })
}

function all (text) {
  tone(text)
}

module.exports = {
  all: all,
  tone: tone
}
