import { classifyText } from "./textClassifier.js";
import { classifyImage } from "./imageClassifier.js";
import { CATEGORIES } from "../utils/categories.js";


// Simple late fusion: weighted average of text & image confidences.
export async function classifyMultimodal({ text, imageBuffer }) {
const textRes = classifyText(text);
const imgRes = await classifyImage(imageBuffer);


// Start with per-category scores (0 by default)
const scores = Object.fromEntries(CATEGORIES.map(c => [c, 0]));


// Normalize text probabilities (natural outputs are relative; softmax-ish normalization)
const textTotal = Object.values(textRes.scores ?? {}).reduce((a,b) => a+b, 0) || 1;
for (const [k, v] of Object.entries(textRes.scores ?? {})) {
if (scores[k] !== undefined) scores[k] += (v / textTotal) * 0.6; // 60% weight
}


// Image score contribution
const imgTotal = Object.values(imgRes.scores ?? {}).reduce((a,b) => a+b, 0) || 1;
for (const [k, v] of Object.entries(imgRes.scores ?? {})) {
if (scores[k] !== undefined) scores[k] += (v / imgTotal) * 0.4; // 40% weight
}


// Pick the best label
const sorted = Object.entries(scores).sort((a,b) => b[1]-a[1]);
const [label, confidence] = sorted[0];


// Hints (top 3)
const topHints = sorted.slice(0,3).map(([k]) => k);


return {
label,
confidence: Number(confidence.toFixed(4)),
scores,
parts: {
text: textRes,
image: imgRes
},
hints: topHints
};
}