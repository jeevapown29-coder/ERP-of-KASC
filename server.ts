import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic "Firewall": Security Headers via Helmet
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for dev / iframe compatibility
  }));

  // Rate Limiting (Prevent abuse / DDoS)
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
  });

  // Apply rate limiter to all API routes
  app.use("/api/", apiLimiter);

  app.use(express.json());

  // API Route for Gemini
  app.post("/api/gemini/summarize", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "No prompt provided" });
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      
      const requestedModel = req.body.model || "gemini-2.5-flash";
      const systemInstruction = req.body.systemInstruction || "You are an expert educational ERP advisor at Kongunadu Arts and Science College. Keep responses accurate, highly professional, and perfectly structured.";

      const response = await ai.models.generateContent({
        model: requestedModel,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: req.body.temperature ?? 0.2,
        }
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate summary" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support React Router
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
