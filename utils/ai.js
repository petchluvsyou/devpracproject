const axios = require('axios');
require('dotenv').config();  // Correctly load environment variables

// Use environment variables for API URL and API token
const API_URL = 'https://api-inference.huggingface.co/models/distilgpt2';// You can change the model as needed
const API_TOKEN = process.env.HUGGING_FACE_API_KEY;  // Retrieve API key from environment variables

// Function to call Hugging Face API for travel suggestions based only on provider's location
const getTravelSuggestions = async (provider) => {
  try {
    // Extract the province and region fields from the provider
    const providerLocation = `${provider.province}, ${provider.region}`;  // Only use province and region

    // Create a prompt for the AI to suggest travel destinations based on the provider's location
    const prompt = `Suggest a travel destination based on the following provider location: ${providerLocation}`;

    // Send a request to the Hugging Face API
    const response = await axios.post(API_URL, {
      inputs: prompt,  // Pass the complete prompt to the Hugging Face API
    }, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`  // Use the API token from environment variables
      }
    });

    // Log the response from Hugging Face for debugging
    console.log('Hugging Face Response:', response.data);

    // Return the suggestions from the AI model
    return response.data[0].generated_text;
  } catch (error) {
    console.error('Error fetching travel suggestions:', error);
    return 'Sorry, we could not generate travel suggestions at the moment.';
  }
};

module.exports = getTravelSuggestions;
