function replaceText(selector: string, text?: string) {
  const element = document.getElementById(selector);
  if (element && text) element.innerText = text;
}

window.addEventListener("DOMContentLoaded", () => {
  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
