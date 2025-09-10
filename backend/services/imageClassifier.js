// backend/services/imageClassifier.js
import * as tf from "@tensorflow/tfjs";            // pure JS TF
import * as mobilenet from "@tensorflow-models/mobilenet";
import sharp from "sharp";

let model = null;

export async function loadImageModel() {
  if (!model) {
    model = await mobilenet.load({ version: 2, alpha: 1.0 });
    console.log("✅ Mobilenet model loaded (pure JS)");
  }
  return model;
}

const IMAGE_KEYWORDS = {
  electricity: ["lamp", "street", "lampshade", "traffic light", "switch", "electric", "power", "pole"],
  water: ["fountain", "water", "pipe", "sink", "shower", "bottle", "tower"],
  trash: ["garbage", "trash", "bin", "litter", "waste", "dumpster"],
  roads: ["pothole", "road", "street", "highway", "sidewalk", "crosswalk", "curb"]
};

function mapClassNameToCategory(className) {
  if (!className) return null;
  const name = className.toLowerCase();
  for (const [cat, keywords] of Object.entries(IMAGE_KEYWORDS)) {
    if (keywords.some(k => name.includes(k))) return cat;
  }
  return null;
}

export async function classifyImage(buffer) {
  if (!buffer) return { label: null, confidence: 0, scores: {}, hints: [] };

  const model = await loadImageModel();

  // 🔹 sharp → raw → tensor
  const raw = await sharp(buffer)
    .resize(224, 224)
    .raw()
    .toBuffer();

  const tensor = tf.tensor3d(new Uint8Array(raw), [224, 224, 3], "int32").expandDims(0);

  try {
    const predictions = await model.classify(tensor);
    tensor.dispose();

    if (!predictions?.length) return { label: null, confidence: 0, scores: {}, hints: [] };

    const top = predictions[0];
    const mapped = mapClassNameToCategory(top.className);

    const scores = mapped ? { [mapped]: top.probability } : {};
    const hints = predictions.slice(0, 3).map(p => `${p.className} (${p.probability.toFixed(3)})`);

    return { label: mapped, confidence: top.probability ?? 0, scores, hints };
  } catch (err) {
    tensor.dispose();
    console.error("classifyImage error:", err);
    return { label: null, confidence: 0, scores: {}, hints: [], error: err.message };
  }
}
