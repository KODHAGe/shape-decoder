const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1')
const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2018-10-15',
  iam_apikey: process.env.WATSON_NLU_API_KEY,
  url: process.env.WATSON_NLU_URL
})

var textInput = 'Ahoy, world!'

var parameters = {
  'text': textInput,
  'features': {
    'entities': {
      'emotion': true,
      'sentiment': true,
      'limit': 2
    },
    'keywords': {
      'emotion': true,
      'sentiment': true,
      'limit': 2
    }
  }
}

naturalLanguageUnderstanding.analyze(parameters, function (err, response) {
  if (err) {
    console.log('error:', err)
  } else {
    console.log(JSON.stringify(response, null, 2))
  }
})

module.exports = () => ''
