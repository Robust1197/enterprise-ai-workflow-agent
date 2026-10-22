# Agent Quest mobile site — GitHub Pages publishing

Directory: `learning-web/`. Mobile browser code editor + real Python/Pydantic checks.

## Current status
- Static pages, Javascript, Python test harness and Pages deployment workflow created in Windows project.
- No verified public URL yet, and no real Android runtime test yet. The browser-based WASM dependency download must be tested after publishing.
- Browser uses Python 3.14/Pydantic 2.14.1; Windows project uses Python 3.12. Formal portfolio evidence remains the Windows pytest suite.
- Progress saved in localStorage on this device only; cross-device progress requires Export/Import.
- Do not paste personal info, passwords, tokens or employer data into this code editor.

## Local preview (PC must be on)
```powershell
cd C:\Users\fukur\Project\enterprise-ai-workflow-agent
uv run python -m http.server 8765 --directory learning-web --bind 127.0.0.1
```
Open http://127.0.0.1:8765/ on the local computer. This does not expose the app to the public.

## Free public hosting independent from PC
1. Open https://github.com/new in your signed-in account. Create **Public** repository `enterprise-ai-workflow-agent` and do not pre-create a README (the local repo is already initialized). Public code and static site are visible to everyone.
2. In local Windows PowerShell, stage and commit only the website and deploy workflow; leave incomplete Day 2 core Pydantic model exercise unstaged:
```powershell
cd C:\Users\fukur\Project\enterprise-ai-workflow-agent
git add .github/workflows/deploy-learning-web.yml learning-web
git diff --cached --check
git diff --cached --stat
git commit -m "feat: add mobile AI learning lab"
```
3. Link local repository to the newly created GitHub repository (the connected GitHub account is Robust1197):
```powershell
git remote add origin https://github.com/Robust1197/enterprise-ai-workflow-agent.git
git push -u origin main
```
4. GitHub repository Settings -> Pages -> Source: GitHub Actions.
5. GitHub Actions -> Deploy Agent Quest Learning Web -> check successful deployment. If needed click Run workflow. Open the **actual URL** shown by GitHub. Do not assume a URL until deployed.
6. On a phone open the site. First load uses network to download Python WASM and Pydantic; test by running the existing incomplete models (RED), then a corrected model (GREEN).

## Data and runtime caveats
- The site itself needs only static hosting and remains usable when the PC is shut down.
- Initial Pyodide/Pydantic download requires a network connection and can take time on mobile.
- Running untrusted code is isolated to the browser worker, not the Windows environment.
- Browser code and quiz progress are device-local, not automatically synced; use JSON export/import and copy code to formal project.
- Phone editor supports Insert 4 spaces / Remove indent controls for easier Python entry.
- The site publishes only the `learning-web/` folder. The repository itself is public, so review all commits before pushing.

## References
- https://pyodide.org/en/stable/usage/quickstart.html
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
