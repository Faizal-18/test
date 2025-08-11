
import { GoogleGenAI, Chat, Type } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const gardenPlannerModel = "gemini-2.5-flash";
const chatModel = "gemini-2.5-flash";

const gardenPlanSchema = {
    type: Type.OBJECT,
    properties: {
        theme: {
            type: Type.STRING,
            description: "A creative and descriptive name for the garden theme, e.g., 'Mediterranean Sunset' or 'Zen Minimalist'.",
        },
        plants: {
            type: Type.ARRAY,
            description: "A list of recommended plants, including flowers, herbs, and vegetables suitable for the user's conditions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: "The common name of the plant.",
                    },
                    reason: {
                        type: Type.STRING,
                        description: "A brief explanation of why this plant is a good choice (e.g., 'Thrives in full sun and attracts pollinators').",
                    },
                },
                required: ["name", "reason"],
            },
        },
        layout_description: {
            type: Type.STRING,
            description: "A paragraph describing a potential layout for the garden, suggesting where to place different types of plants or features.",
        },
    },
    required: ["theme", "plants", "layout_description"],
};


export const createChat = (): Chat => {
    return ai.chats.create({
        model: chatModel,
        config: {
            systemInstruction: "You are a friendly and knowledgeable rooftop gardening expert named 'Sprout'. Provide concise, helpful, and encouraging advice for urban gardeners. Always be positive and focus on practical, actionable steps.",
        },
    });
};

export const generateGardenPlan = async (
    size: string,
    sunlight: string,
    location: string,
    preference: string
): Promise<GenerateContentResponse> => {
    const prompt = `
        Design a rooftop garden plan with the following specifications:
        - Terrace Size: ${size}
        - Sunlight Exposure: ${sunlight}
        - Geographic Location: ${location} (consider climate implications)
        - User Preference: I want a garden that is primarily ${preference}.

        Generate a creative theme, a list of suitable plants, and a layout description.
    `;

    const response = await ai.models.generateContent({
        model: gardenPlannerModel,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: gardenPlanSchema,
        }
    });
    return response;
};
