// backend/services/textClassifier.js
import natural from "natural";
import { CATEGORIES } from "../utils/categories.js";

const classifier = new natural.BayesClassifier();
let trained = false;

export const SEED = [
  // ELECTRICITY
  { text: "streetlight not working", label: "electricity" },
  { text: "power cut in my area", label: "electricity" },
  { text: "electric pole sparking", label: "electricity" },
  { text: "electricity outage since morning", label: "electricity" },
  { text: "no electricity in my street", label: "electricity" },
  { text: "flickering lights at home", label: "electricity" },
  { text: "broken transformer near house", label: "electricity" },
  { text: "short circuit in the area", label: "electricity" },
  { text: "voltage fluctuation in apartments", label: "electricity" },
  { text: "main switch not working", label: "electricity" },

  // WATER
  { text: "water pipe leakage", label: "water" },
  { text: "no water supply", label: "water" },
  { text: "contaminated drinking water", label: "water" },
  { text: "tap is dry", label: "water" },
  { text: "water shortage in my area", label: "water" },
  { text: "leaking pipeline in street", label: "water" },
  { text: "bathroom has no water", label: "water" },
  { text: "dirty water from tap", label: "water" },
  { text: "water pressure too low", label: "water" },
  { text: "broken water main", label: "water" },

  // TRASH / WASTE
  { text: "garbage pile on street", label: "trash" },
  { text: "dumpster overflowing", label: "trash" },
  { text: "uncleared waste in colony", label: "trash" },
  { text: "litter all over road", label: "trash" },
  { text: "trash collection not done", label: "trash" },
  { text: "plastic waste not collected", label: "trash" },
  { text: "dirty surroundings due to garbage", label: "trash" },
  { text: "dumping of waste in open area", label: "trash" },
  { text: "smelly garbage heap near home", label: "trash" },
  { text: "waste bins not emptied", label: "trash" },

  // ROADS / INFRASTRUCTURE
  { text: "pothole near main road", label: "roads" },
  { text: "broken sidewalk", label: "roads" },
  { text: "damaged speed breaker", label: "roads" },
  { text: "road has big holes", label: "roads" },
  { text: "street uneven and unsafe", label: "roads" },
  { text: "traffic signal not working", label: "roads" },
  { text: "fallen tree blocking road", label: "roads" },
  { text: "collapsed footpath", label: "roads" },
  { text: "dangerous curves without signboards", label: "roads" },
  { text: "road markings faded", label: "roads" },

  // OTHERS / MISC
  { text: "noise complaint from neighbor", label: "others" },
  { text: "street flooding after rain", label: "others" },
  { text: "stray animals causing trouble", label: "others" },
  { text: "unauthorized construction nearby", label: "others" },
  { text: "blocked drains causing smell", label: "others" },
  { text: "trees fallen after storm", label: "others" },
  { text: "missing manhole cover", label: "others" },
  { text: "illegal parking issues", label: "others" },
  { text: "public park lights not working", label: "others" },
  { text: "roadside encroachments", label: "others" }
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
