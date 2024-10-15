// g1.js
import Groq from "groq-sdk"; // Certifique-se de que a biblioteca groq está instalada.
import { setTimeout } from 'timers/promises';

const client = new Groq({ apiKey: '' });

async function makeApiCall(messages, maxTokens, isFinalAnswer = false, customClient = null) {
    const apiClient = customClient || client;
    
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const response = await apiClient.chat.completions.create({
                model: "llama-3.1-70b-versatile",
                messages: messages,
                max_tokens: maxTokens,
                temperature: 0.4,
                ...(isFinalAnswer ? {} : { response_format: { type: "json_object" } }),
            });

            return isFinalAnswer
                ? response.choices[0].message.content
                : JSON.parse(response.choices[0].message.content);
        } catch (e) {
            if (attempt === 2) {
                return {
                    title: "Error",
                    content: `Failed to generate ${isFinalAnswer ? 'final answer' : 'step'} after 3 attempts. Error: ${e.message}`,
                    ...(isFinalAnswer ? {} : { next_action: "final_answer" }),
                };
            }
            await setTimeout(1000); // Espera 1 segundo antes de tentar novamente
        }
    }
}

export async function generateResponse(prompt, customClient = null) {
    const messages = [
        {
            role: "system",
            content: `You are an expert AI assistant that explains your reasoning step by step. For each step, provide a title that describes what you're doing in that step, along with the content. Decide if you need another step or if you're ready to give the final answer. Respond in JSON format with 'title', 'content', and 'next_action' (either 'continue' or 'final_answer') keys. USE AS MANY REASONING STEPS AS POSSIBLE. AT LEAST 3. BE AWARE OF YOUR LIMITATIONS AS AN LLM AND WHAT YOU CAN AND CANNOT DO. IN YOUR REASONING, INCLUDE EXPLORATION OF ALTERNATIVE ANSWERS. CONSIDER YOU MAY BE WRONG, AND IF YOU ARE WRONG IN YOUR REASONING, WHERE IT WOULD BE. FULLY TEST ALL OTHER POSSIBILITIES. YOU CAN BE WRONG. WHEN YOU SAY YOU ARE RE-EXAMINING, ACTUALLY RE-EXAMINE, AND USE ANOTHER APPROACH TO DO SO. DO NOT JUST SAY YOU ARE RE-EXAMINING. USE AT LEAST 3 METHODS TO DERIVE THE ANSWER. USE BEST PRACTICES.
            
Example of a valid JSON response:
\`\`\`json
{
    "title": "Identifying Key Information",
    "content": "To begin solving this problem, we need to carefully examine the given information and identify the crucial elements that will guide our solution process. This involves...",
    "next_action": "continue"
}
\`\`\``
        },
        { role: "user", content: prompt },
        { role: "assistant", content: "Thank you! I will now think step by step following my instructions, starting at the beginning after decomposing the problem." }
    ];

    const steps = [];
    let stepCount = 1;
    let totalThinkingTime = 0;

    while (true) {
        const startTime = Date.now();
        const stepData = await makeApiCall(messages, 300, customClient);
        const endTime = Date.now();
        const thinkingTime = (endTime - startTime) / 1000; // Converte para segundos
        totalThinkingTime += thinkingTime;

        steps.push({ title: `Step ${stepCount}: ${stepData.title}`, content: stepData.content, thinkingTime });

        messages.push({ role: "assistant", content: JSON.stringify(stepData) });

        if (stepData.next_action === 'final_answer' || stepCount > 25) {
            break;
        }
        stepCount++;
    }

    // Gera a resposta final
    messages.push({
        role: "user",
        content: "Please provide the final answer based solely on your reasoning above. Do not use JSON formatting. Only provide the text response without any titles or preambles. Retain any formatting as instructed by the original prompt, such as exact formatting for free response or multiple choice."
    });

    const finalStartTime = Date.now();
    const finalData = await makeApiCall(messages, 5000, true, customClient);
    const finalEndTime = Date.now();
    const finalThinkingTime = (finalEndTime - finalStartTime) / 1000;
    totalThinkingTime += finalThinkingTime;

    steps.push({ title: "Final Answer", content: finalData, thinkingTime: finalThinkingTime });

    return { steps, totalThinkingTime };
}
