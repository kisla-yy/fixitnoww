// backend/services/imageClassifier.js
import * as tf from "@tensorflow/tfjs";              // ✅ Node.js TensorFlow
import * as mobilenet from "@tensorflow-models/mobilenet"; // ✅ Mobilenet
import sharp from "sharp";                                // ✅ For image preprocessing

let model;

// Load Mobilenet once
export async function loadImageModel() {
  if (!model) {
    model = await mobilenet.load({ version: 2, alpha: 1.0 });
    console.log("✅ Mobilenet model loaded");
  }
  return model;
}

// Category keyword mappings
const IMAGE_KEYWORDS = {
  electricity: ["lampshade", "street sign", "traffic light", "switch", "electric", "power"],
  water: ["fountain", "water bottle", "water jug", "water tower", "pipe", "sink", "shower", "dam"],
  trash: ["garbage truck", "recycling bin", "bin", "litter", "waste"],
  roads: ["pothole", "road", "street", "highway", "sidewalk", "crosswalk", "curb"]
};

function mapClassNameToCategory(className) {
  const name = className.toLowerCase();
  for (const [cat, keywords] of Object.entries(IMAGE_KEYWORDS)) {
    if (keywords.some(k => name.includes(k))) return cat;
  }
  return null; // fallback
}

export async function classifyImage(buffer) {
  if (!buffer) {
    return { label: null, confidence: 0, scores: {}, hints: [] };
  }

  await loadImageModel();

  // Preprocess: center-crop + resize
  const resized = await sharp(buffer)
    .resize({ width: 224, height: 224, fit: "cover" })
    .toBuffer();

  const decoded = tf.node.decodeImage(resized, 3);
  const expanded = decoded.expandDims(0);

  try {
    const predictions = await model.classify(expanded);
    decoded.dispose();
    expanded.dispose();

    if (!predictions?.length) {
      return { label: null, confidence: 0, scores: {}, hints: [] };
    }

    const top = predictions[0];
    const mapped = mapClassNameToCategory(top.className);

    const scores = mapped ? { [mapped]: top.probability } : {};

    return {
      label: mapped,
      confidence: top.probability ?? 0,
      scores,
      hints: predictions.slice(0, 3).map(p => p.className)
    };
  } catch (e) {
    decoded?.dispose?.();
    expanded?.dispose?.();
    throw e;
  }
}
