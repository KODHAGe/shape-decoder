// WORKS BUT NEEDS PROMISIFYING

const Language = require('azure-cognitiveservices-language')
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials
const key = process.env.AZURE_TEXT_ANALYTICS_KEY_1

const credentials = new CognitiveServicesCredentials(key)
const textAnalyticsApiClient = new Language.TextAnalyticsAPIClient(credentials, 'northeurope')

function createDocument (text) {
  if (text) {
    return {
      'language': 'en',
      'id': '0',
      'text': text
    }
  } else {
    console.log('ERROR: No text input.')
    return false
  }
}

async function keyphrases (text) {
  let document = createDocument(text)
  let result = await textAnalyticsApiClient.keyPhrases({
    documents: [
      document
    ]
  })

  if (result.documents.length > 0) {
    for (let i = 0; i < result.documents.length; i++) {
      let document = result.documents[i]
      console.log(`Document ID: ${document.id}`)
      console.log(`\t Key phrases:`)
      for (let j = 0; j < document.keyPhrases.length; j++) {
        console.log(`\t\t${document.keyPhrases[j]}`)
      }
      return result
    }
  } else {
    console.log('No results data.')
  }
}

async function sentiment (text) {
  let document = createDocument(text)

  let result = await textAnalyticsApiClient.sentiment({
    documents: [
      document
    ]
  })
  if (result.documents.length > 0) {
    for (let i = 0; i < result.documents.length; i++) {
      let document = result.documents[i]
      console.log(`Document ID: ${document.id} , Sentiment Score: ${document.score}`)
    }
    return result
  } else {
    console.log('No results data.')
  }
}

async function all (text) {
  console.log('Running all Azure Text analytics')
  keyphrases(text)
  sentiment(text)
}

module.exports = {
  all: all,
  sentiment: sentiment,
  keyphrases: keyphrases
}
