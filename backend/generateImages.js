import fs from 'fs';
import path from 'path';

const products = [
  { name: 'evangelion_unit_01_model', prompt: 'Highly detailed Evangelion Unit-01 model kit figure, dark atmospheric background, cinematic studio lighting, premium anime collectible' },
  { name: 'bleach_zanpakuto_umbrella', prompt: 'Bleach Ichigo Zangetsu sword replica umbrella handle, dark aesthetic, elegant display, premium quality product shot' },
  { name: 'hunter_x_hunter_license', prompt: 'Hunter x Hunter official metal hunter license card, resting on dark textured surface, sleek cinematic rim lighting' },
  { name: 'akira_kaneda_jacket', prompt: 'Akira Kaneda premium red biker jacket on a mannequin, cyberpunk aesthetic, dark background, rich texture' },
  { name: 'fullmetal_alchemist_watch', prompt: 'Fullmetal Alchemist Edward Elric silver pocket watch, open resting on dark wooden desk, subtle glowing alchemical reflections' },
  { name: 'jojo_tarot_cards', prompt: 'Jojos Bizarre Adventure Stardust Crusaders tarot cards deck, elegant dark background, golden edges catching cinematic light' },
  { name: 'sword_art_online_elucidator', prompt: 'Sword Art Online Kirito Elucidator black longsword replica, dark metallic sheen, cinematic elegant lighting on a stand' },
  { name: 'cyberpunk_david_jacket', prompt: 'Cyberpunk Edgerunners David Martinez yellow EMT jacket, neon lighting accents, dark premium background' },
  { name: 'chainsaw_man_pochita_plush', prompt: 'Chainsaw Man Pochita soft plush toy companion, dark premium backdrop, soft rim lighting, ultra detailed 8k photography' },
  { name: 'tokyo_ghoul_kaneki_mask', prompt: 'Tokyo Ghoul Kaneki Ken premium leather eye patch mask replica, eerie dramatic cinematic lighting, dark background, sharp focus' },
  { name: 'genshin_impact_anemo_vision', prompt: 'Genshin Impact Mondstadt Anemo Vision glass keychain, glowing cyan core, polished golden frame, dark slate background' },
  { name: 'spirited_away_no_face_bank', prompt: 'Spirited Away No-Face automated coin bank figure, studio lighting, mysterious dark backdrop, highly detailed studio product shot' },
  { name: 'cowboy_bebop_spike_pistol', prompt: 'Cowboy Bebop Spike Spiegel Jericho 941 pistol replica, sleek metallic finish, dark resting surface, noir cinematic lighting' },
  { name: 'sailor_moon_crescent_wand', prompt: 'Sailor Moon Crescent Moon Wand replica, glowing silver crystal, dark aesthetic background, ethereal studio lighting' }
];

const downloadImage = async (name, prompt) => {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&nologo=true`;
  console.log(`Downloading ${name}...`);
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    const buffer = await response.arrayBuffer();
    const savePath = path.join(process.cwd(), '..', 'frontend', 'public', 'images', 'products', `${name}.jpg`);
    fs.writeFileSync(savePath, Buffer.from(buffer));
    console.log(`Saved ${name}.jpg`);
  } catch (err) {
    console.error(`Failed to download ${name}`, err);
  }
};

const run = async () => {
    for (const p of products) {
        await downloadImage(p.name, p.prompt);
    }
    console.log('Finished downloading images.');
}

run();
