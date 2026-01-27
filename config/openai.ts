import {AzureOpenAI} from "openai"


export const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: process.env.AZURE_OPENAI_VERSION,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
});