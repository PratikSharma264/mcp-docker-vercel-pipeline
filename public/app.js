const releaseLabel = document.querySelector("#release-label");
const releaseStatus = document.querySelector("#release-status");

async function checkReleaseGate() {
  try {
    const response = await fetch("/release.txt", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Release gate returned ${response.status}`);
    }

    const releaseMessage = (await response.text()).trim();
    releaseLabel.textContent = releaseMessage || "Release ready";
    releaseStatus.classList.add("ready");
  } catch {
    releaseLabel.textContent = "Release gate is not ready";
    releaseStatus.classList.add("blocked");
  }
}

checkReleaseGate();