require('dotenv').config()

/* ═════════════════
  Text analytics 
═════════════════ */

/* ------- IBM Watson APIs ------- */

// Tone Analyzer
//require('./watson/toneAnalyser.js')

// Natural Language Understanding
//require('./watson/naturalLanguageUnderstanding.js')

/* ------- Google Cloud APIs ------- */

// Cloud Natural Language
let gnl = require('./google/naturalLanguage.js')
gnl.all('Ahoy, world!')

/* ------- Microsoft Azure APIs ------- */

// Text Analytics
//let ata = require('./azure/textAnalytics.js')
//ata.all()