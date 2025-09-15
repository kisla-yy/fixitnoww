// backend/services/multimodal.js
import { classifyText } from "./textClassifier.js";
import { classifyImage } from "./imageClassifier.js";
import { CATEGORIES } from "../utils/categories.js";

export async function classifyMultimodal({ text, imageBuffer }) {
  let textRes = { scores: {} };
  let imgRes = { scores: {} };

  try {
    textRes = classifyText(text || "");
  } catch (e) {
    console.error("Text classification failed:", e);
  }

  try {
    imgRes = await classifyImage(imageBuffer);
  } catch (e) {
    console.error("Image classification failed:", e);
  }

  // Initialize category scores
  const scores = Object.fromEntries(CATEGORIES.map(c => [c, 0]));

  // Add text contribution (60%)
  const textScores = textRes.scores ?? {};
  const textTotal = Object.values(textScores).reduce((a, b) => a + b, 0) || 1;
  for (const [k, v] of Object.entries(textScores)) {
    if (scores[k] !== undefined) scores[k] += (v / textTotal) * 0.6;
  }

  // Add image contribution (40%)
  const imgScores = imgRes.scores ?? {};
  const imgTotal = Object.values(imgScores).reduce((a, b) => a + b, 0) || 1;
  for (const [k, v] of Object.entries(imgScores)) {
    if (scores[k] !== undefined) scores[k] += (v / imgTotal) * 0.4;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [label, confidence] = sorted[0];
  const topHints = sorted.slice(0, 3).map(([k]) => k);

  return {
    label,
    confidence: Number(confidence.toFixed(4)),
    scores,
    parts: { text: textRes, image: imgRes },
    hints: topHints
  };
}
