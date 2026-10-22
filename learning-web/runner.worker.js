/* Pyodide 314 requires an ES MODULE worker, not importScripts().
   Official reference: https://pyodide.org/en/stable/usage/webworker.html
   The Pyodide runtime is cached within this worker across submissions. */
const PYODIDE_BASE = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";
const MODULE_URLS = [
  PYODIDE_BASE + "pyodide.mjs",
  "https://unpkg.com/pyodide@314.0.7/pyodide.mjs"
];
let py = null;
let harness = null;
let loading = null;
let running = false;

const say = message => self.postMessage({type:"status", message});

async function setup() {
  say("首次加载 Python/WebAssembly；之后本页重复测试将复用运行器…");
  let loader = null;
  const importErrors = [];
  for (const url of MODULE_URLS) {
    try {
      const module = await import(url);
      loader = module.loadPyodide;
      if (typeof loader !== "function") throw new Error("loadPyodide not exported");
      break;
    } catch (err) {
      importErrors.push(url + " → " + String(err?.message || err));
    }
  }
  if (!loader) {
    throw new Error("无法从两个 CDN 载入 Pyodide ES Module。请检查当前网络是否阻止 jsDelivr/unpkg，或稍后重试。\n" + importErrors.join("\n"));
  }
  py = await loader({indexURL:PYODIDE_BASE});
  say("加载 Pyodide 官方内置的 Pydantic（不从 PyPI重复安装）…");
  // Pyodide 314.0.7 includes a compatible prebuilt pydantic/pydantic-core wheel.
  await py.loadPackage("pydantic");
  const major = py.runPython("import pydantic\nint(pydantic.__version__.split('.')[0])");
  if (major !== 2) throw new Error("此课程要求 Pydantic 2.x，实际加载版本非 2.x");
  say("读取本地的模型测试规范…");
  const resp = await fetch(new URL("./browser_tests.py", import.meta.url), {cache:"no-store"});
  if (!resp.ok) throw new Error("无法读取 browser_tests.py: HTTP " + resp.status);
  harness = await resp.text();
  say("Python 和 Pydantic 已就绪。再次执行无需重新下载。");
  self.postMessage({type:"ready",version:py.runPython("import pydantic\npydantic.__version__")});
}
function initialize() {
  if (!loading) loading = setup().catch(err => {loading = null; py = null; throw err;});
  return loading;
}
self.addEventListener("message",async event => {
  const data = event.data || {};
  if (data.type === "init") {
    try { await initialize(); }
    catch(err) { self.postMessage({type:"error",error:String(err?.message||err)}); }
    return;
  }
  if (data.type !== "run" || running) return;
  running = true;
  try {
    await initialize();
    const src = String(data.code ?? "");
    if (src.length > 100000) throw new Error("练习代码超过 100KB 限制");
    say("正在使用真正的 Pydantic 执行10个模型测试…");
    py.globals.set("USER_CODE",src);
    const json = await py.runPythonAsync(harness);
    self.postMessage({type:"done",data:JSON.parse(json)});
  } catch(err) {
    self.postMessage({type:"error",error:String(err?.message||err)});
  } finally {
    running = false;
  }
});
