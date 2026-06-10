import Express from "express";
import cors from "cors";
import Replicate from "replicate";
import dotenv from "dotenv";

dotenv.config(); // 讀取 .env 檔案中的 Token

const app = Express();
app.use(cors()); // 允許你的前端網頁前來發送請求
app.use(Express.json());

// 初始化 Replicate 實例
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN, // 你的 API Token 放這裡（存在環境變數最安全）
});

app.post("/api/generate-image", async (req, res) => {
  try {
    const model = "stability-ai/sdxl:39ed52f2a78e434b49651cd99f9d84791e8141f54751373b190d56fae618ac00";
    const finalPrompt = "a whimsical surrealist creature or character, full body, hand-drawn sketch style, loose expressive brushstrokes, colored pencil illustration, watercolor accents, white background, spontaneous gestural marks, imaginative and playful";
    const negativePrompt = "photo, realistic, 3d render, digital art, smooth gradients, dark background, text, watermark";

    console.log("正在生成圖片...");
    
    const output = await replicate.run(model, {
      input: {
        prompt: finalPrompt,
        negative_prompt: negativePrompt,
        width: 512,
        height: 512,
        num_outputs: 1,
      }
    });

    // 新版 SDK output[0] 是 FileOutput 物件，String() 統一轉成 URL 字串
    res.json({ imageUrl: String(output[0]) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI 圖片生成失敗" });
  }
});

app.listen(3000, () => {
  console.log("後端伺服器已啟動");
});