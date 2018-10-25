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

async function sentiment (text) {
  let document = createDocument(text)
  try {
    let response = await client.analyzeSentiment({ document: document })
    return response
  } catch (error) {
    console.log(error)
  }
}

async function syntax (text) {
  let document = createDocument(text)
  try {
    let response = await client.analyzeSyntax({ document: document })
    return response
  } catch (error) {
    console.log(error)
  }
}

async function entitySentiment (text) {
  let document = createDocument(text)
  try {
    let response = await client.analyzeEntitySentiment({ document: document })
    return response
  } catch (error) {
    console.log(error)
  }
}

async function all (text) {
  console.log('Running all Google Cloud NL analyses')
  let all = {
    sentiment: await sentiment(text),
    syntax: await syntax(text),
    entitySentiment: await entitySentiment(text)
  }
  return all
}

module.exports = {
  all: all,
  sentiment: sentiment,
  syntax: syntax,
  entitySentiment: entitySentiment
}
