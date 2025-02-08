export function createProgressBar() {
  const container = document.createElement("div");
  container.id = "progress-bar-container";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "5px";
  container.style.backgroundColor = "#ccc";
  container.style.zIndex = "2000";

  const fill = document.createElement("div");
  fill.style.height = "100%";
  fill.style.width = "0%";
  fill.style.backgroundColor = "#4caf50";

  container.appendChild(fill);
  return { container, fill };
}
