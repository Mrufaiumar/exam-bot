const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function solveQuestions(questions) {
  const results = [];

  for (const q of questions) {
    const optionsFormatted = q.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n');
    const prompt = `
You are a smart assistant. Solve this question and explain briefly:

Question: ${q.question}
Options:
${optionsFormatted}

Respond in this format:
Answer: [Correct Option]
Explanation: [Short Explanation]
`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = completion.data.choices[0].message.content;
    const answerMatch = reply.match(/Answer: (.+)\nExplanation: (.+)/i);
    results.push({
      question: q.question,
      answer: answerMatch?.[1]?.trim() || "Unknown",
      explanation: answerMatch?.[2]?.trim() || "No explanation",
    });
  }

  return results;
}

module.exports = { solveQuestions };