import { build } from 'vite';

async function run() {
  try {
    await build({ logLevel: 'error' });
    console.log("Build succeeded!");
  } catch (e) {
    console.error("BUILD ERROR MESSAGE:");
    console.error(e.message);
    if (e.id) console.error("ID:", e.id);
    if (e.loc) console.error("LOC:", e.loc);
    if (e.frame) console.error("FRAME:", e.frame);
  }
}
run();
