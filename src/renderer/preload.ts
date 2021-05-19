async function fetchManifest(): Promise<Record<string, string>> {
  const res = await fetch("https://hitrecord.org/production/frontend/manifest.json");
  return res.json();
}

type Script = { url?: string; defer?: boolean; nomodule?: boolean };

const frontendScripts: Record<string, Script> = {
  "runtime.js": {
    defer: true,
  },
  "polyfills-es5.js": {
    defer: true,
    nomodule: true,
  },
  "polyfills.js": {
    defer: true,
  },
  "scripts.js": {
    defer: true,
  },
  "vendors.js": {
    defer: true,
  },
  "main.js": {
    defer: true,
  },
};

function appendScript(script: Script) {
  if (!script.url) return;
  const $el: HTMLScriptElement = document.createElement("script");
  $el.type = "text/javascript";
  $el.src = script.url;
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

window.addEventListener("DOMContentLoaded", () => {
  bootstrap().catch(console.log);
});
