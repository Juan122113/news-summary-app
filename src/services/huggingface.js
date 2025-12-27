import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const HF_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

export async function summarizeNews(prompt) {
    const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.HF_API_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            inputs: prompt,
            parameters: {
                max_length: 600,
                min_length: 300,
                do_sample: false
            }
        })
    });

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error);
    }

    return data[0].summary_text;
}