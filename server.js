import Express from "express";
import cors from "cors";
import Replicate from "replicate";
import dotenv from "dotenv";
import { createClient } from '@supabase/supabase-js';

dotenv.config(); // 讀取 .env 檔案中的 Token

const app = Express();
app.use(cors()); // 允許你的前端網頁前來發送請求
app.use(Express.json({ limit: '5mb' })); // base64 圖片約 400-700KB，需加大上限

// 初始化 Replicate 實例
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN, // 你的 API Token 放這裡（存在環境變數最安全）
});

// 初始化 Supabase 客户端
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const SUBJECTS = [
  "a humanoid figure",
  "a mysterious creature",
  "an abstract entity",
  "a fantastical being",
  "a surrealist animal",
  "a dreamlike character",
];

const MOODS = [
  "whimsical and playful",
  "eerie and uncanny",
  "melancholic and poetic",
  "bizarre and grotesque",
  "tender and fragile",
  "wild and frenzied",
];

const STYLES = [
  "colored pencil illustration",
  "loose ink and watercolor",
  "expressive oil pastel",
  "gestural gouache painting",
  "rough charcoal sketch with color washes",
  "naive folk art style",
];

app.post("/api/generate-image", async (req, res) => {
  try {
    const model = "black-forest-labs/flux-schnell";
    const prompt = `${pick(SUBJECTS)}, full body, ${pick(MOODS)}, ${pick(STYLES)}, pure white background with no scenery or environment, only the character or object, hand-drawn, spontaneous marks, surrealist art`;

    console.log("正在生成圖片...");

    const output = await replicate.run(model, {
      input: {
        prompt,
        aspect_ratio: "1:1",
        output_format: "png",
        num_outputs: 1,
      }
    });

    res.json({ imageUrl: output[0].url().href, prompt });
    console.log("生成完畢!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI 圖片生成失敗" });
  }
});

// ── 儲存完成作品 ──
app.post("/api/save-artwork", async (req, res) => {
  const { imageData, prompt } = req.body;
  if (!imageData) return res.status(400).json({ error: "imageData is required" });

  try {
    // base64 → Buffer
    const base64 = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    const fileName = `artwork_${Date.now()}.png`;

    // 上傳到 Supabase Storage bucket: artworks
    const { error: uploadError } = await supabase.storage
      .from('artworks')
      .upload(fileName, buffer, { contentType: 'image/png', cacheControl: '3600' });

    if (uploadError) throw uploadError;

    // 取得公開 URL
    const { data: { publicUrl } } = supabase.storage
      .from('artworks')
      .getPublicUrl(fileName);

    // 寫入 artworks table
    const { error: dbError } = await supabase
      .from('artworks')
      .insert({ image_url: publicUrl, prompt: prompt || '' });

    if (dbError) throw dbError;

    console.log("作品已儲存:", fileName);
    res.json({ success: true, imageUrl: publicUrl });
  } catch (error) {
    console.error("儲存失敗:", error);
    res.status(500).json({ error: "作品儲存失敗", detail: error.message });
  }
});

// ── 讀取畫廊圖片（隨機 10 張）──
app.get("/api/gallery", async (req, res) => {
  try {
    // 取最新 50 筆，在 server 端打亂後取 10 張
    const { data, error } = await supabase
      .from('artworks')
      .select('image_url, prompt')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    const shuffled = (data || [])
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    res.json(shuffled);
  } catch (error) {
    console.error("畫廊讀取失敗:", error);
    res.status(500).json({ error: "畫廊讀取失敗" });
  }
});

app.listen(3000, () => {
  console.log("後端伺服器已啟動");
});