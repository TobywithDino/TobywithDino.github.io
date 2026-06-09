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
  const { userPrompt } = req.body;

  try {
    // 這裡以熱門的 stability-ai/sdxl 為例
    const model = "stability-ai/sdxl:39ed52f2a78e434b49651cd99f9d84791e8141f54751373b190d56fae618ac00";
    
    // 嚴格控制提示詞，強制要求黑線白底
    const finalPrompt = `${userPrompt}, minimal black ink line art, pure solid white background, coloring book page style, simple lineart, isolated`;
    const negativePrompt = "color, shading, shadow, gradients, 3d, realistic, grey background, textured background";

    console.log("正在生成圖片...");
    
    const output = await replicate.run(model, {
      input: {
        prompt: finalPrompt,
        negative_prompt: negativePrompt,
        width: 512, // SDXL 支援 512x512
        height: 512,
        num_outputs: 1,
        output_format: "png"
      }
    });

    // output 通常是一個包含圖片網址的陣列，例如 ["https://replicate.delivery/..."]
    res.json({ imageUrl: output[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI 圖片生成失敗" });
  }
});

app.listen(3000, () => {
  console.log("後端伺服器已啟動：http://localhost:3000");
});