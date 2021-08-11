// const manifestURL = "https://assets.hitrecord.org/production/frontend/manifest.json";
const manifestURL = "https://hitrecord.org/production/frontend/manifest.json";
// const manifestURL = "http://localhost:4200/manifest.json";

async function fetchManifest(): Promise<Record<string, string>> {
  const res = await fetch(manifestURL);
  return res.json();
}

type Script = { url?: string; defer?: boolean; nomodule?: boolean };

const frontendScripts: Record<string, Script> = {
  "runtime.js": {},
  "polyfills-es5.js": {
    nomodule: true,
  },
  "polyfills.js": {},
  "scripts.js": {},
  "vendors.js": {},
  "main.js": {},
};

function appendScript(script: Script) {
  if (!script.url) return;
  const $el: HTMLScriptElement = document.createElement("script");
  $el.type = "text/javascript";
  $el.src = script.url;
  $el.crossOrigin = "anonymous";
  if (script.defer) $el.defer = script.defer;
  if (script.nomodule) $el.noModule = script.nomodule;
  document.body.appendChild($el);
}

async function bootstrap() {
  const manifest = await fetchManifest();

  Object.keys(frontendScripts).forEach((k) => {
    frontendScripts[k].url = manifest[k];
    appendScript(frontendScripts[k]);
  });

  Object.entries(manifest).forEach(([k, url]) => {
    if (k.startsWith("vendors-npm") && !k.endsWith(".gz")) {
      appendScript({ url, defer: true });
    }
  });
}

bootstrap().catch(console.log);
