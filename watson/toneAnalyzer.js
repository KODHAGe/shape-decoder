const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3')

const toneAnalyzer = new ToneAnalyzerV3({
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
  return new Promise((resolve, reject) => {
    let toneParams = createParams(text)
    toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
      if (error) {
        reject(error)
      } else {
        console.log(JSON.stringify(toneAnalysis, null, 2))
        resolve(JSON.stringify(toneAnalysis, null, 2))
      }
    })
  })
}

function all (text) {
  return new Promise((resolve) => {
    resolve(tone(text))
  })
}

module.exports = {
  all: all,
  tone: tone
}
