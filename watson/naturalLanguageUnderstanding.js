const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1')
const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2018-10-15',
  iam_apikey: process.env.WATSON_NLU_API_KEY,
  url: process.env.WATSON_NLU_URL
})

function entityParams (text) {
  if (text) {
    return {
      'text': text,
      'features': {
        'entities': {
          'emotion': true,
          'sentiment': true,
          'limit': 3
        }
      }
    }
  } else {
    console.log('ERROR: No text input.')
    return false
  }
}

function keywordParams (text) {
  if (text) {
    return {
      'text': text,
      'features': {
        'keywords': {
          'emotion': true,
          'sentiment': true,
          'limit': 3
        }
      }
    }
  } else {
    console.log('ERROR: No text input.')
    return false
  }
}

function allParams (text) {
  if (text) {
    return {
      'text': text,
      'features': {
        'entities': {
          'emotion': true,
          'sentiment': true,
          'limit': 3
        },
        'keywords': {
          'emotion': true,
          'sentiment': true,
          'limit': 3
        }
      }
    }
  } else {
    console.log('ERROR: No text input.')
    return false
  }
}

function getAnalysis (params, text) {
  return new Promise((resolve, reject) => {
    let parameters = params(text)
    naturalLanguageUnderstanding.analyze(parameters, function (err, response) {
      if (err) {
        console.log('error:', err)
        reject(err)
      } else {
        console.log(JSON.stringify(response, null, 2))
        resolve(JSON.stringify(response, null, 2))
      }
    })
  })
}

function all (text) {
  return new Promise((resolve, reject) => {
    resolve(getAnalysis(allParams, text))
  })
}

function keywords (text) {
  return new Promise((resolve, reject) => {
    getAnalysis(keywordParams, text)
  })
}

function entities (text) {
  return new Promise((resolve, reject) => {
    getAnalysis(entityParams, text)
  })
}

module.exports = {
  all: all,
  keywords: keywords,
  entities: entities
}
