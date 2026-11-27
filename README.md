# Deployment Pulse

Deployment Pulse is a small static dashboard that demonstrates a protected container delivery workflow. It uses HTML, CSS, and JavaScript served by NGINX in Docker. The dashboard reads `/release.txt` and reports whether the release gate is ready.

The repository includes:

- `public/` - dashboard source files and the release marker.
- `Dockerfile` - packages the site in a pinned NGINX Alpine image.
- `.github/workflows/container-ci.yml` - builds and starts the image on pull requests and pushes to `main`, then checks that the dashboard and `/release.txt` respond.

The dashboard has five delivery cards: Agent, Context, Container, Delivery, and Environment. The Environment card describes the Vercel Container Function deployment target.

## Requirements

- Git
- Docker Desktop (Windows/macOS) or Docker Engine (Linux)
- A GitHub account to use the repository and GitHub Actions
- Optional: a Vercel account connected to GitHub to deploy the container

## Run locally with Docker

From the repository root, build the image:

```powershell
docker build --tag deployment-pulse:local .
```

Start the container, binding it to your computer only:

```powershell
docker run --detach --name deployment-pulse --publish 127.0.0.1:8080:80 deployment-pulse:local
```

Open <http://localhost:8080>. The release status should read **Release ready: CI-approved container**.

To stop and remove the container:

```powershell
docker rm --force deployment-pulse
```

To rebuild after editing files, remove the old container, rebuild the image, and run the start command again. If port `8080` is busy, change the host-side port (the number before `:80`), for example `127.0.0.1:8081:80`, and open <http://localhost:8081>.

## Run without Docker

The files in `public/` are static. You can serve that directory with any local static web server. For example, if Python is installed:

```powershell
python -m http.server 8080 --directory public
```

Then open <http://localhost:8080>. The Docker workflow is the authoritative container check used by GitHub Actions.

## Deploy with GitHub and Vercel

1. Push this repository to GitHub and make sure the workflow in `.github/workflows/container-ci.yml` runs successfully.
2. In the GitHub repository settings, protect `main` and require the **Verify Docker release** check before merging pull requests.
3. In Vercel, import the GitHub repository. Keep the project root at the repository root so Vercel detects the `Dockerfile`.
4. Deploy a preview from a pull request and inspect it before merging. After merge, confirm the production deployment is ready and displays the latest dashboard.

Vercel and GitHub settings live in those services; they are not configured by the files in this repository. Keep credentials and secrets out of source files.

## Adapt the workflow to another project

This repository is a reference implementation, not a universal drop-in template. Keep the delivery sequence (build, verify, review a preview, then promote to production), but tailor the app, image, checks, and deployment settings to your project.

1. **Identify how your app runs.** A compiled static site can be served by NGINX. A server-rendered or API application generally needs its own runtime image, startup command, and listening port. Add any required database or external services to your development and deployment setup.
2. **Adapt the Dockerfile.** Copy the right source files, install dependencies, build the app if needed, and start the correct server. Do not assume this project's NGINX image fits a backend or a different framework.
3. **Define a meaningful health or release check.** Update `container-ci.yml` to build and run your image, wait for the app, then request an endpoint that proves your app is usable. This example checks `/` and `/release.txt`; another app should check its own health endpoint or behavior. If your app needs test data or services, provision them in CI.
4. **Set configuration safely.** Document required environment variable names and configure their values in GitHub Actions or the deployment platform's secret settings. Never commit real credentials.
5. **Protect the production branch.** Require the relevant checks to pass before merging. Confirm the required check name matches the workflow job's reported status.
6. **Connect the deployment platform.** Configure the platform to build the right directory and Dockerfile, set environment variables, and create preview deployments for pull requests. Verify a preview before merging, then verify the production deployment after merge.
7. **Update project-specific documentation.** Record prerequisites, local run steps, ports, test commands, required settings, and deployment steps so another developer can reproduce the process.

For a static app, the main changes are usually the contents of `public/` and the release check. For an app with a build system or backend, also replace or substantially revise the Dockerfile and CI workflow. Validate the adapted workflow in a test repository or branch before relying on it to protect production.

## Repository workflow

Use a feature branch and pull request for changes. GitHub Actions runs the container check for pull requests targeting `main` and for pushes to `main`. Once branch protection is enabled in GitHub, a failing required check blocks the merge.

