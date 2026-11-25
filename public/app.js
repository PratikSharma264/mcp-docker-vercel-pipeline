const deployButton = document.querySelector("#deploy-button");
const deploymentStatus = document.querySelector("#deployment-status");
const lastUpdate = document.querySelector("#last-update");
const toast = document.querySelector("#toast");
const filterButton = document.querySelector("#filter-button");
const deploymentRows = [...document.querySelectorAll(".deployment-row")];

let toastTimer;

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2200);
}

deployButton?.addEventListener("click", () => {
  deployButton.disabled = true;
  deployButton.innerHTML = "<span aria-hidden=\"true\">◷</span> Deploying";
  deploymentStatus.textContent = "Deploying";

  window.setTimeout(() => {
    deploymentStatus.textContent = "Ready";
    lastUpdate.textContent = "Just now";
    deployButton.disabled = false;
    deployButton.innerHTML = "<span aria-hidden=\"true\">↗</span> Deploy";
    showToast("Deployment ready");
  }, 1400);
});

filterButton?.addEventListener("click", () => {
  const showPreview = filterButton.dataset.filter !== "preview";
  filterButton.dataset.filter = showPreview ? "preview" : "all";
  filterButton.firstChild.textContent = showPreview ? "Preview only " : "All environments ";

  deploymentRows.forEach((row) => {
    row.hidden = showPreview && row.dataset.environment !== "preview";
  });

  if (!showPreview) {
    deploymentRows.forEach((row) => {
      row.hidden = false;
    });
  }
});
