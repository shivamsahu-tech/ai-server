// server.js
import { HfInference } from "@huggingface/inference";
import express, { json } from 'express';
import { post } from 'axios';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const app = express();
const port = process.env.PORT || 3000;

app.use(json());

app.get('/', (req, res) => {
  res.send('AI Server is up and running!');
});


const client = new HfInference(process.env.API_KEY);
app.post('/query-ai', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    const chatCompletion = await client.chatCompletion({
        model: "Qwen/Qwen2.5-Coder-32B-Instruct",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        max_tokens: 500
    });
    console.log(chatCompletion.choices[0].message);
    res.json(chatCompletion.choices[0].message);
} catch (error) {
    console.log("Error: ", error);
    res.status(500).send({ error: 'Failed to process AI request' });
}
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
