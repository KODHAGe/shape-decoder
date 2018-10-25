# Shape-decoder

A microservice for providing a single-input (and multimodal in the future) API for several emotion and sentiment detection services. The initial version will support natural language understanding platforms by Google, IBM and Microsoft.

## Getting Started

The microservice is built on Zeit Micro. For local development ``micro-dev`` is used. Better documentation for getting started will be added once closer to a publicly usable release 🙈. 

### Prerequisites

You'll need to create credentials for all services you wish to use. Take a gander at .env.example for the latest list of services supported and where to register for them. Things you'll likely want:

```
IBM Watson credentials from https://www.ibm.com/cloud/

Google credentials from https://console.cloud.google.com/

Microsoft Azure credentials from https://azure.microsoft.com/en-us/services/cognitive-services/
```

### Installing

Once you've set up credentials locally, you should be able to

```
npm install
```

and

```
npm run dev
```

To enable the service on localhost:3000. Now you can make POST-requests to endpoints at
```
/watson/toneAnalyzer/ for Watson Tone Analyser
/watson/naturalLanguageUnderstanding/ for Watson NLU
/google/naturalLanguage/ for Google NL
/azure/textAnalytics/ for Azure TA
/analyse-text-raw for running all at once
/analyse-text for running all at once through a parser function
```
Endpoints expect requests to contain a JSON-body with a parameter text containing the text to analyze.

## Deployment

Deployment instructions for Zeit will be added.

## Built With

* [Zeit Micro](https://github.com/zeit/micro) - Microservice framework

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
