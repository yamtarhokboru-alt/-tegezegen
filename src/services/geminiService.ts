import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PlanetData {
  name: string;
  starType: string;
  distance: number; // AU
  mass: number; // Earth masses
  atmosphere: string;
  temperature?: number; // Kelvin
}

export async function analyzeExoplanet(planet: PlanetData) {
  const prompt = `
    Bir ötegezegen (exoplanet) avcısı yapay zekası gibi davran. 
    Aşağıdaki verilere sahip bir gezegenin yaşanabilirlik (habitability) durumunu analiz et:
    Gezegen Adı: ${planet.name}
    Yıldız Tipi: ${planet.starType}
    Yıldıza Uzaklık: ${planet.distance} AU
    Kütle: ${planet.mass} Dünya Kütlesi
    Atmosfer Bileşimi: ${planet.atmosphere}
    ${planet.temperature ? `Tahmini Sıcaklık: ${planet.temperature} K` : ""}

    Analizinde şunları belirt:
    1. Yaşanabilirlik Durumu (Yaşanabilir, Potansiyel, Yaşanamaz)
    2. Nedenleri (Bilimsel gerekçelerle)
    3. Gezegenin kısa bir tasviri.
    4. "AI Güven Skoru" (0-100 arası).

    Yanıtı JSON formatında ver:
    {
      "status": "string",
      "reasons": ["string"],
      "description": "string",
      "confidenceScore": number
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
}
