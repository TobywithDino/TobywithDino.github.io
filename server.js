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
    const model = "black-forest-labs/flux-schnell";
    const prompt = "a whimsical surrealist creature or character, full body, hand-drawn sketch style, loose expressive brushstrokes, colored pencil illustration, watercolor accents, white background, spontaneous gestural marks, imaginative and playful";

    console.log("正在生成圖片...");

    const output = await replicate.run(model, {
      input: {
        prompt,
        aspect_ratio: "1:1",
        output_format: "png",
        num_outputs: 1,
      }
    });

    // output[0].url() 是 method，回傳 URL 物件，再用 .href 取字串
    res.json({ imageUrl: output[0].url().href });
    console.log("生成完畢!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI 圖片生成失敗" });
  }
});

app.listen(3000, () => {
  console.log("後端伺服器已啟動");
});