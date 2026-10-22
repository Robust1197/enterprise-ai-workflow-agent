# Agent Quest — mobile learning

## Online learning website
GitHub Pages publishes only the contents of this directory via the workflow in .github/workflows/deploy-learning-web.yml.

Open the actual Pages URL shown in GitHub Settings -> Pages, or GitHub Actions deployment details. The browser website can be opened when the Windows computer is off.

## Day 2 capabilities
- Mobile-first end-to-end Agent architecture explanation, all prerequisite syntax, examples and official references.
- Code editor for TicketCreate/Ticket/TriageResult with indentation helpers.
- Real Python/Pydantic (not text matching) runs ten schema tests; errors display actual Python exceptions.
- Code autosaves locally on device and can be exported or imported as JSON; cross-device account sync is not implemented.

## Browser runtime and troubleshooting
Pyodide 314.0.7 **requires an ES module worker**, as its official docs state. The original classic Worker + importScripts caused the reported failure. Fixed: new Worker(..., {type:"module"}) and dynamic ES module import of pyodide.mjs. The loader tries the official jsDelivr URL and a script mirror via unpkg. It uses Pyodide's own bundled Pydantic 2.x (2.12.5 in version 314.0.7), rather than trying to install an incompatible exact Windows version.

The same worker instance is retained in the open page, so each Run does not reinstall Python/Pydantic. First load still downloads Python, WASM and required wheels from the internet; if your network blocks CDNs, a runtime error can still appear. Network failure is not a Python code test failure. Use the error shown below the Run button to debug, and try the current version in a new tab.

The site is static and has no backend to store your work. Do not paste personal secrets or employer/customer data in browser code examples. No production CRM writes are performed.

## Local preview
PowerShell from the project root:
```powershell
uv run python -m http.server 8765 --directory learning-web --bind 127.0.0.1
```
Then open http://127.0.0.1:8765/ in the same computer. file:// may not work due to Web Worker module restrictions.

## Portfolio tests
```powershell
uv run pytest -q
node --check learning-web/app.js
node --check learning-web/runner.worker.js
```
Static tests are not a substitute for an actual phone end-to-end validation after publishing.

## Further reading
- https://pyodide.org/en/stable/usage/webworker.html
- https://pyodide.org/en/stable/usage/packages-in-pyodide.html
- https://docs.pydantic.dev/latest/concepts/models/
