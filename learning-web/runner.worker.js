/* Pyodide Web Worker: real Pydantic validation, isolated from the UI. */
"use strict";
const CDN = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";
let py = null;
let harness = null;
let pending = false;
async function initialize() {
  if (py) return;
  self.postMessage({type:"status",message:"下载 Python/WebAssembly 环境…"});
  importScripts(CDN + "pyodide.js");
  py = await loadPyodide({indexURL:CDN});
  self.postMessage({type:"status",message:"安装浏览器版 Pydantic 2.14.1…"});
  await py.loadPackage("micropip");
  await py.runPythonAsync("import micropip\nawait micropip.install('pydantic==2.14.1')");
  self.postMessage({type:"status",message:"读取测试规范…"});
  const resp = await fetch("browser_tests.py", {cache:"no-store"});
  if (!resp.ok) throw new Error("无法读取 browser_tests.py: HTTP " + resp.status);
  harness = await resp.text();
  py.runPython("import pydantic\nassert pydantic.__version__ == '2.14.1'");
  self.postMessage({type:"status",message:"浏览器 Python 与 Pydantic 已就绪。"});
}
self.addEventListener("message",async e=>{
  if(e.data?.type!=="run" || pending) return;
  pending = true;
  try{
    await initialize();
    const src = String(e.data.code ?? "");
    if(src.length>100000)throw new Error("练习代码超过100KB限制");
    self.postMessage({type:"status",message:"正在用真正的 Pydantic 执行10个契约测试…"});
    py.globals.set("USER_CODE",src);
    const json = await py.runPythonAsync(harness);
    self.postMessage({type:"done",data:JSON.parse(json)});
  }catch(err){
    self.postMessage({type:"error",error: String(err?.message||err)});
  }finally{
    pending=false;
  }
});
