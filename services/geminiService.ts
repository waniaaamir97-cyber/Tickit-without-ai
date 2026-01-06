
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartTaskBreakdown = async (taskTitle: string, taskDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Break down this task into 3-5 actionable subtasks: "${taskTitle}". Description: ${taskDescription}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                },
                required: ['title']
              }
            },
            suggestedPriority: { 
              type: Type.STRING,
              description: "Suggest one of: LOW, MEDIUM, HIGH, URGENT"
            },
            motivationalQuote: { type: Type.STRING }
          },
          required: ['subtasks', 'suggestedPriority', 'motivationalQuote']
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const getProductivityInsight = async (tasksCount: number, completedCount: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I have ${tasksCount} tasks total and I completed ${completedCount} today. Give me one short, punchy sentence of productivity advice.`,
    });
    return response.text;
  } catch (error) {
    return "Keep moving forward, one task at a time!";
  }
};

export const getSmartSuggestions = async (tasks: any[], user: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on these tasks: ${JSON.stringify(tasks.slice(0, 10))}, suggest one new task the user might need to do today based on their activity patterns or common habits.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestion: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            priority: { type: Type.STRING }
          },
          required: ['suggestion', 'reasoning', 'priority']
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return null;
  }
};

export const parseNaturalLanguageSearch = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate this natural language search query into filter parameters: "${query}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, description: "TODO, COMPLETED, or ALL" },
            priority: { type: Type.STRING, description: "LOW, MEDIUM, HIGH, URGENT, or ALL" },
            timeRange: { type: Type.STRING, description: "today, week, or all" }
          },
          required: ['status', 'priority', 'timeRange']
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return null;
  }
};
