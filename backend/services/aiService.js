import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateRFP = async (requirementText) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are an expert procurement officer. Return a strict JSON object with fields:
- title (string)
- description (string)
- budget (number)
- delivery_days (number)
- payment_terms (string)
- items (array of objects: name, specs, quantity, warranty_years)

Do NOT include any text outside JSON. Respond only in valid JSON.
          `,
        },
        {
          role: "user",
          content: `Requirement: ${requirementText}
Generate a fully structured RFP JSON object including all required fields.`,
        },
      ],
    });

    let aiOutput = response.choices?.[0]?.message?.content;
    if (!aiOutput) throw new Error("AI returned empty output");

    // If AI returned an object directly
    if (typeof aiOutput === "object") return aiOutput;

    // Clean up string output
    if (typeof aiOutput === "string") {
      // Remove newlines, backticks, and any leading/trailing whitespace
      let cleaned = aiOutput.trim().replace(/^[`]+|[`]+$/g, "").replace(/\n/g, "");

      try {
        // Try normal parse
        return JSON.parse(cleaned);
      } catch {
        // Replace single quotes with double quotes and fix unquoted keys
        cleaned = cleaned
          .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
          .replace(/'/g, '"');

        return JSON.parse(cleaned);
      }
    }

    throw new Error("Unexpected AI output type");
  } catch (error) {
    console.error("Groq RFP Generation Error:", error);
    return null;
  }
};


export const analyzeProposal = async (proposalText) => {
  try {
    const prompt = `
You are an expert procurement analyst.
Analyze the following vendor proposal and compare it with the related RFP.

VENDOR PROPOSAL:
"${proposalText}"

Return STRICT JSON ONLY with this schema:
{
  "score": number,           // 1 to 10
  "summary": "string",       // Short summary of proposal quality
  "issues": ["string"],      // Any concerns or missing details
  "recommendation": "string" // Accept, negotiate, or reject
}
Do not include any explanations or extra text outside the JSON.
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const raw = response.choices[0].message.content;
    console.log("Raw AI Proposal Output:", raw);

    // Extract JSON between first { and last }
    const jsonMatch = raw.match(/\{[\s\S]*\}$/);
    if (!jsonMatch) throw new Error("No JSON found in AI output");

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("Groq Proposal Analysis Error:", err);
    return null;
  }
};
