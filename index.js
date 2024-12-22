import { HfInference } from "@huggingface/inference";
import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';

// Load environment variables from .env file
config();

// Enable CORS for all domains
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(json());

app.get('/', (req, res) => {
  res.send('AI Server is up and running!');
});

const client = new HfInference(process.env.API_KEY);

// Endpoint to generate a script based on the prompt
app.post('/generate-script', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    // const chatCompletion = await client.chatCompletion({
    //   model: "Qwen/Qwen2.5-Coder-32B-Instruct",
    //   messages: [
    //     { role: "user", content: prompt }
    //   ],
    // });

    // const generatedScript = chatCompletion.choices[0].message.content;
    const generatedScript = `document.body.style.backgroundColor = "green";`
    
    // Return the generated script wrapped in a <script> tag
    res.setHeader("Content-Security-Policy", "script-src 'nonce-123456'");
    res.send(`
      <script nonce="123456">
        ${generatedScript}
      </script>
    `);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send({ error: 'Failed to process AI request' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
