const axios = require("axios");
require("dotenv").config();

const API_URL = "https://api-inference.huggingface.co/models/distilgpt2";
const API_TOKEN = process.env.HUGGING_FACE_API_KEY;

const getTravelSuggestions = async (provider) => {
  try {
    const providerLocation = `${provider.province}, ${provider.region}`;

    const prompt = `Suggest a travel destination based on the following provider location: ${providerLocation}`;

    const response = await axios.post(
      API_URL,
      {
        inputs: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      },
    );

    console.log("Hugging Face Response:", response.data);

    return response.data[0].generated_text;
  } catch (error) {
    console.error("Error fetching travel suggestions:", error);
    return "Sorry, we could not generate travel suggestions at the moment.";
  }
};

module.exports = getTravelSuggestions;
