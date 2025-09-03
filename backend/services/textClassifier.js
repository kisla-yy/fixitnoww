import natural from "natural";
import { CATEGORIES } from "../utils/categories.js";


// Basic NaiveBayes text classifier with a tiny seed dataset.
// Extend/replace the seed with your own labelled data or wire a DB.
const classifier = new natural.BayesClassifier();


// Seed data — edit freely
const SEED = [
// electricity
{ text: "streetlight not working", label: "electricity" },
{ text: "power cut in my area", label: "electricity" },
{ text: "electric pole sparking", label: "electricity" },


// water
{ text: "water pipe leakage", label: "water" },
{ text: "no water supply", label: "water" },
{ text: "contaminated drinking water", label: "water" },


// trash
{ text: "garbage pile on street", label: "trash" },
{ text: "dumpster overflowing", label: "trash" },
{ text: "uncleared waste in colony", label: "trash" },


// roads
{ text: "pothole near main road", label: "roads" },
{ text: "broken sidewalk", label: "roads" },
{ text: "damaged speed breaker", label: "roads" }
];


export async function trainTextClassifier() {
SEED.forEach(({ text, label }) => classifier.addDocument(text.toLowerCase(), label));
classifier.train();
}


export function classifyText(text) {
if (!text || !text.trim()) {
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