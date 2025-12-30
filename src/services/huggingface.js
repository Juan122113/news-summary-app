import fetch from "node-fetch";

const API_URL =
  "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn";

export async function generateText(prompt) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: prompt
    })
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text);
  }

  const data = JSON.parse(text);

  // bart-large-cnn devuelve esto
  return data[0].summary_text;
}
