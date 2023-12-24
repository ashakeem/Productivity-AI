import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function generateImagePrompt(name: string) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "As an innovative AI assistant, your role is to craft compelling thumbnail descriptions for my notes. Your output will serve as input for the DALLE API, contributing to the creation of visually striking thumbnails. Emphasize a minimalistic, realistic and relevant in your descriptions to ensure an aesthetically pleasing result.",
        },
        {
          role: "user",
          content: `Please generate a thumbnail description for my notebook titles ${name}`,
        },
      ],
    });

    const data = await response.json();
    const image_description = data.choices[0].message.content;
    return image_description as string;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function generateImage(image_description: string) {
  try {
    const response = await openai.createImage({
      prompt: image_description,
      n: 1,
      size: "256x256",
    });

    if (!response.ok) {
      console.error(`Error from OpenAI API: ${response.status} - ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0 || !data.data[0].url) {
      console.error("Invalid response format from OpenAI API");
      return null;
    }

    const image_url = data.data[0].url;
    return image_url as string;
  } catch (error) {
    console.error("Error in generateImage:", error);
    return null;
  }
}
