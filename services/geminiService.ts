
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available in the environment variables
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, you'd handle this more gracefully, but for this context, we'll throw an error.
  // The app environment is expected to provide this key.
  console.error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

function base64ToMimeType(base64: string): string {
    const match = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (match && match.length > 1) {
        return match[1];
    }
    return 'image/jpeg'; // fallback
}

export const generateHaircut = async (base64Image: string, stylePrompt: string): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  
  const mimeType = base64ToMimeType(base64Image);
  const imageData = base64Image.split(',')[1];
  
  const prompt = `A photorealistic, high quality, high resolution portrait of the person in the image with a new hairstyle. The new hairstyle should be a ${stylePrompt}. Preserve the person's facial features, identity, expression, and skin tone. Place the person against a clean, plain, neutral studio background. Only the hair and the background should be changed.`;
  const negativePrompt = "ugly, deformed, disfigured, poor quality, blurry, low resolution, noisy, watermark, text, signature, cartoon, anime, 3d render, painting, unrealistic, extra limbs, missing limbs, distorted face, unnatural hair color, cluttered background, outdoor scene, indoor room, complex background, patterns, textures, multiple people, original background";

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: {
            parts: [
                {
                    inlineData: {
                        data: imageData,
                        mimeType: mimeType,
                    },
                },
                {
                    text: `${prompt} --- NEGATIVE PROMPT: ${negativePrompt}`,
                },
            ],
        },
        config: {
            imageConfig: {
                aspectRatio: "1:1"
            }
        }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64String = part.inlineData.data;
        const generatedMimeType = part.inlineData.mimeType;
        return `data:${generatedMimeType};base64,${base64String}`;
      }
    }

    throw new Error("No image was generated in the response.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate haircut from Gemini API.");
  }
};


export const upscaleImage = async (base64Image: string): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  const mimeType = base64ToMimeType(base64Image);
  const imageData = base64Image.split(',')[1];

  const prompt = `Upscale this image to a higher resolution (4K). Enhance the details, sharpness, and clarity of the original image without altering any of its content, composition, or colors. The output must be a photorealistic, high-quality version of the input image.`;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { data: imageData, mimeType: mimeType } },
          { text: prompt },
        ],
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64String = part.inlineData.data;
        const generatedMimeType = part.inlineData.mimeType;
        return `data:${generatedMimeType};base64,${base64String}`;
      }
    }
    throw new Error("No upscaled image was generated in the response.");
  } catch (error) {
    console.error("Error calling Gemini API for upscaling:", error);
    throw new Error("Failed to upscale image from Gemini API.");
  }
};
