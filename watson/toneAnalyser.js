const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3')

const toneAnalyser = new ToneAnalyzerV3({
  version: '2018-10-15',
  iam_apikey: process.env.WATSON_TONE_API_KEY,
  url: process.env.WATSON_TONE_URL
})

var textInput = 'Ahoy, world!'

var toneParams = {
  'tone_input': { 'text': textInput },
  'content_type': 'application/json'
}

toneAnalyser.tone(toneParams, function (error, toneAnalysis) {
  if (error) {
    console.log(error)
  } else {
    console.log(JSON.stringify(toneAnalysis, null, 2))
  }
})

module.exports = () => ''
