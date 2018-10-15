// WORKS BUT NEEDS PROMISIFYING
const language = require('@google-cloud/language')

const client = new language.LanguageServiceClient()

function createDocument (text) {
  if (text) {
    return {
      content: text,
      type: 'PLAIN_TEXT'
    }
  } else {
    console.log('ERROR: No text input.')
    return false
  }
}

function sentiment (text) {
  let document = createDocument(text)
  client.analyzeSentiment({ document: document })
    .then(results => {
      const sentiment = results[0].documentSentiment
      console.log(`Text: ${text}`)
      console.log(`Sentiment score: ${sentiment.score}`)
      console.log(`Sentiment magnitude: ${sentiment.magnitude}`)
      return sentiment
    })
    .catch(err => {
      console.error('ERROR:', err)
    })
}

function syntax (text) {
  let document = createDocument(text)
  client.analyzeSyntax({ document: document })
    .then(results => {
      const syntax = results[0]
      console.log('Parts of speech:')
      syntax.tokens.forEach(part => {
        console.log(`${part.partOfSpeech.tag}: ${part.text.content}`)
        console.log(`Morphology:`, part.partOfSpeech)
      })
      return syntax
    })
    .catch(err => {
      console.error('ERROR:', err)
    })
}

function entitySentiment (text) {
  let document = createDocument(text)
  client.analyzeEntitySentiment({ document: document })
    .then(results => {
      const entities = results[0].entities

      console.log(`Entities and sentiments:`)
      entities.forEach(entity => {
        console.log(`  Name: ${entity.name}`)
        console.log(`  Type: ${entity.type}`)
        console.log(`  Score: ${entity.sentiment.score}`)
        console.log(`  Magnitude: ${entity.sentiment.magnitude}`)
      })
    })
    .catch(err => {
      console.error('ERROR:', err)
    })
}

function all (text) {
  console.log('Running all Google Cloud NL analyses')
  sentiment(text)
  syntax(text)
  entitySentiment(text)
}

module.exports = {
  all: all,
  sentiment: sentiment,
  syntax: syntax,
  entitySentiment: entitySentiment
}
