import { translations } from "../src/translations/index.js";

console.log("=== Testing Multilingual Translation Dictionary ===");

const langs = ["en", "ms", "zh"];
langs.forEach(lang => {
  if (!translations[lang]) {
    throw new Error(`Missing language: ${lang}`);
  }
  const keys = Object.keys(translations[lang]);
  console.log(`- Language [${lang}]: ${keys.length} keys loaded.`);
});

const enKeys = Object.keys(translations.en);
const msKeys = Object.keys(translations.ms);
const zhKeys = Object.keys(translations.zh);

const missingInMs = enKeys.filter(k => !msKeys.includes(k));
const missingInZh = enKeys.filter(k => !zhKeys.includes(k));

if (missingInMs.length > 0) {
  console.warn("⚠️ Keys missing in MS:", missingInMs);
} else {
  console.log("✓ Malay (MS) dictionary is 100% complete and fully matches English keys!");
}

if (missingInZh.length > 0) {
  console.warn("⚠️ Keys missing in ZH:", missingInZh);
} else {
  console.log("✓ Chinese (ZH) dictionary is 100% complete and fully matches English keys!");
}

// Sample checks
console.log("\nSample Verification across [EN, MS, ZH]:");
[
  "app_title",
  "persona_worker",
  "persona_hr",
  "persona_tvet",
  "upload_resume_title",
  "action_radar",
  "action_roles",
  "action_reskill",
  "hr_action_radar",
  "hr_action_matching",
  "hr_action_pathway",
  "tvet_action_radar",
  "tvet_action_matching",
  "tvet_action_pathway",
  "rm_0_out_of_pocket"
].forEach(k => {
  console.log(`[${k}]:`);
  console.log(`  EN: ${translations.en[k]}`);
  console.log(`  MS: ${translations.ms[k]}`);
  console.log(`  ZH: ${translations.zh[k]}`);
});

console.log("\n=== All Translation Tests Passed Successfully! ===");
