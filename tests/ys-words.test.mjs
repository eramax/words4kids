import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("../ys-words.html", import.meta.url), "utf8");

function extractWords(source) {
  const match = source.match(/state\.words\s*=\s*(\[[\s\S]*?\]);/);
  assert.ok(match, "Expected words array in ys-words.html");
  return Function(`"use strict"; return (${match[1]});`)();
}

function hasArabicDiacritic(text) {
  return /[\u064B-\u0652\u0670]/u.test(text);
}

const words = extractWords(html);
const uniqueWords = new Set(words.map((item) => item.text));
const phraseCount = words.filter((item) => item.text.includes(" ")).length;

assert.match(
  html,
  /function colorizeArabicText\(/,
  "Expected a dedicated formatter for colored Arabic diacritics",
);

assert.doesNotMatch(
  html,
  /id="shuffleBtn"/,
  "Expected the shuffle button to be hidden from the UI",
);

assert.match(
  html,
  /id="listenBtn"/,
  "Expected a listen button in the controls",
);

assert.match(
  html,
  /function selectBestArabicVoice\(/,
  "Expected Arabic voice selection logic for speech synthesis",
);

assert.match(
  html,
  /new SpeechSynthesisUtterance\(current\.text\)/,
  "Expected speech synthesis to read the current card text",
);

assert.match(
  html,
  /utterance\.lang = "ar-EG"/,
  "Expected speech synthesis to target Egyptian Arabic",
);

assert.equal(
  uniqueWords.size,
  words.length,
  "Expected all reading cards to be unique",
);

assert.ok(
  words.every((item) => hasArabicDiacritic(item.text)),
  "Expected every card to include Arabic diacritics",
);

assert.ok(
  phraseCount >= 12,
  "Expected the deck to include a visible set of short reading phrases",
);

console.log("ys-words checks passed");
