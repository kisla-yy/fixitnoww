// backend/services/textClassifier.js
import natural from "natural";
import { CATEGORIES } from "../utils/categories.js";

const classifier = new natural.BayesClassifier();
let trained = false;

const SEED = [
  { text: "streetlight not working", label: "electricity" },
  { text: "power cut in my area", label: "electricity" },
  { text: "electric pole sparking", label: "electricity" },
  { text: "water pipe leakage", label: "water" },
  { text: "no water supply", label: "water" },
  { text: "contaminated drinking water", label: "water" },
  { text: "garbage pile on street", label: "trash" },
  { text: "dumpster overflowing", label: "trash" },
  { text: "uncleared waste in colony", label: "trash" },
  { text: "pothole near main road", label: "roads" },
  { text: "broken sidewalk", label: "roads" },
  { text: "damaged speed breaker", label: "roads" }
];

export async function trainTextClassifier() {
  if (trained) return;
  SEED.forEach(({ text, label }) => classifier.addDocument(text.toLowerCase(), label));
  classifier.train();
  trained = true;
  console.log("✅ Text classifier trained");
}

export function classifyText(text) {
  if (!text || !text.trim() || !trained) {
    return { label: null, confidence: 0, scores: {} };
  }
  const input = text.toLowerCase();
  const label = classifier.classify(input);
  const classifications = classifier.getClassifications(input);
  const scores = Object.fromEntries(classifications.map(c => [c.label, c.value]));
  const confidence = scores[label] ?? 0;
  const hints = Object.entries(scores)
    .sort((a,b) => b[1]-a[1])
    .slice(0, 3)
    .map(([k]) => k);
  return { label, confidence, scores, hints };
}
