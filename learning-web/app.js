"use strict";

const STORAGE_KEY = "enterprise-agent-learning.day02.v1";
const template = [
  '"""Day 2: define business data contracts yourself."""',
  'from datetime import datetime',
  'from uuid import UUID',
  'from typing import Literal',
  'from pydantic import BaseModel, Field, ConfigDict, StrictBool',
  '',
  'class TicketCreate(BaseModel):',
  '    # TODO: subject (3-120), description (10-2000), locale default "ja"',
  '    # TODO: reject unknown fields',
  '    pass',
  '',
  'class Ticket(TicketCreate):',
  '    # TODO: UUID id, created_at datetime, status "new" | "triaged"',
  '    pass',
  '',
  'class TriageResult(BaseModel):',
  '    # TODO: category, priority, summary, needs_human_review',
  '    # Hints: Literal, Field, StrictBool',
  '    pass',
  ''
].join("\n");

const tests = [
  "日本语工单输入有效",
  "缺少 description 时拒绝",
  "过短 subject 时拒绝",
  "过长 description 时拒绝",
  "未知字段时拒绝",
  "系统字段和默认状态",
  "合法分类及优先级",
  "未知优先级时拒绝",
  "过短摘要时拒绝",
  "布尔字符串不能冒充 bool"
];

function $(id) { return document.getElementById(id); }
function readStorage() {
  try {
    const v = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return (v && typeof v === "object") ? v : {};
  } catch { return {}; }
}
let data = readStorage();
data.code = typeof data.code === "string" ? data.code : template;
data.quiz = data.quiz === true;
data.passed = Number.isInteger(data.passed) ? Math.min(10,Math.max(0,data.passed)) : 0;
data.fullPass = data.fullPass === true;
data.date = typeof data.date === "string" ? data.date : "";
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch { $("runtime-status").textContent = "浏览器存储不可用；请定期导出学习记录。"; }
}
function updateProgress() {
  const x = (data.quiz ? 1 : 0) + (data.fullPass ? 1 : 0);
  $("progress-bar").style.width = (x * 50) + "%";
  $("progress-text").textContent = x === 2 ? "知识+代码已通过" : "完成 " + x + " / 2 个学习目标";
  $("stat-quiz").textContent = data.quiz ? "通过" : "未完成";
  $("stat-tests").textContent = data.passed + " / 10";
}
$("code").value = data.code;
if(data.quiz) {
  $("quiz-result").textContent = "之前已答对 ✓";
  document.querySelector('input[name=quiz][value=b]').checked = true;
}
updateProgress();

document.querySelectorAll(".nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    document.querySelectorAll(".tab-section").forEach(el => el.hidden = el.id !== "page-" + target);
    document.querySelectorAll(".nav button").forEach(el => el.setAttribute("aria-selected", String(el === btn)));
    scrollTo({top:0,behavior:"instant"});
    if(target==="code") preloadRuntime();
  });
});
$("go-triage").addEventListener("click", (event) => {
  event.preventDefault();
  const learnTab = document.querySelector('.nav button[data-tab="learn"]');
  learnTab.click();
  document.getElementById("triage-task").scrollIntoView({behavior:"smooth",block:"start"});
});
$("check-quiz").addEventListener("click", () => {
  const selected = document.querySelector('input[name="quiz"]:checked');
  if (!selected) { $("quiz-result").textContent = "请选择一个答案。"; return; }
  const correct = selected.value === "b";
  $("quiz-result").textContent = correct ?
    "正确。extra='forbid' 拒绝未知字段；这对外部 API 数据契约很重要。" :
    "再想想：业务模型不认识的字段，应该悄悄接受还是拒绝？";
  data.quiz = data.quiz || correct;
  persist(); updateProgress();
});
$("code").addEventListener("input", () => {
  data.code = $("code").value;
  data.fullPass = false; // previous success no longer validates modified code
  data.passed = 0;
  persist(); updateProgress();
  $("test-count").textContent = "0/10";
  $("tests").innerHTML = "";
  $("result").textContent = "代码已改变，请重新运行测试。";
});
$("indent").addEventListener("click", () => {
  const editor = $("code");
  const pos = editor.selectionStart;
  editor.setRangeText("    ", pos, editor.selectionEnd, "end");
  editor.focus(); editor.dispatchEvent(new Event("input", {bubbles:true}));
});
$("dedent").addEventListener("click", () => {
  const editor = $("code");
  const start = editor.value.lastIndexOf("\n", editor.selectionStart - 1) + 1;
  const count = Math.min(4, (editor.value.slice(start).match(/^ */) || [""])[0].length);
  if(count) {
    const pos = Math.max(start,editor.selectionStart-count);
    editor.setRangeText("",start,start+count,"preserve");
    editor.setSelectionRange(pos,pos);
    editor.dispatchEvent(new Event("input",{bubbles:true}));
  }
  editor.focus();
});
$("hint").addEventListener("click", () => {
  $("hint-panel").hidden = !$("hint-panel").hidden;
  $("hint-panel").textContent = '提示：Field(min_length=3, max_length=120) 控制长度；ConfigDict(extra="forbid") 拒绝未知字段；Literal["new", "triaged"] 限制状态；StrictBool 不把 "yes" 当成 True。';
});
$("reset").addEventListener("click", () => {
  if (!confirm("会删除当前浏览器里的代码草稿。确定重置吗？")) return;
  $("code").value = template;
  data.code = template; data.passed = 0; data.fullPass = false;
  persist(); updateProgress(); $("tests").innerHTML = ""; $("result").textContent = "";
});
$("copy").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText($("code").value); $("result").textContent = "已复制代码，可粘贴到 Windows 项目。"; }
  catch {
    $("code").focus(); $("code").select();
    $("result").textContent = "自动复制不可用，请长按选中的代码并手动复制。";
  }
});
$("export").addEventListener("click", () => {
  const obj = {version:1,createdAt:new Date().toISOString(),code:data.code,quizPassed:data.quiz,passed:data.passed,allTestsPassed:data.fullPass,passedAt:data.date};
  const blob = new Blob([JSON.stringify(obj,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download="agent-quest-day02-progress.json"; document.body.appendChild(a);
  a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),3000);
});
$("import").addEventListener("change",async e => {
  const file=e.target.files?.[0]; if(!file) return;
  if(file.size>300000) { alert("文件过大，最多300KB。"); return; }
  try{
    const obj=JSON.parse(await file.text());
    if(obj.version!==1 || typeof obj.code!=="string" || obj.code.length>100000) throw new Error("不支持的文件格式");
    data={code:obj.code,quiz:obj.quizPassed===true,passed:0,fullPass:false,date:""};
    $("code").value=data.code; persist(); updateProgress();
    $("tests").innerHTML=""; $("test-count").textContent="0/10";
    alert("草稿及知识进度已导入。请重新运行测试以验证导入代码。");
  }catch(err){alert("导入失败："+String(err.message||err));}
  e.target.value="";
});

function drawPending() {
  $("tests").innerHTML="";
  tests.forEach(t=>{
    const div=document.createElement("div");div.className="test pending";
    const name=document.createElement("span");name.className="title";name.textContent=t;
    const status=document.createElement("span");status.className="status";status.textContent="待运行";
    div.append(name,status);$("tests").appendChild(div);
  });
}
drawPending();
let worker=null, running=false, timeoutId=null, runSource=null;
function status(msg){$("runtime-status").textContent=msg;}
function setBusy(b){running=b;$("run").disabled=b;}
function terminateRunner(message){
  if(worker){worker.terminate(); worker=null;}
  if(timeoutId){clearTimeout(timeoutId);timeoutId=null;}
  setBusy(false); if(message) status(message);
}
$("stop").addEventListener("click",()=>terminateRunner("已停止并清理 Python 运行器；草稿仍已保存。"));
function ensureWorker(){
  if(worker) return worker;
  worker = new Worker("runner.worker.js", {type:"module"});
  worker.onmessage=e=>{
    const msg=e.data||{};
    if(msg.type==="status"){status(msg.message||"正在初始化");return;}
    if(msg.type==="ready"){status("Python 已就绪（Pydantic "+msg.version+"）。后续测试直接运行，无需重新启动。");return;}
    if(msg.type==="done"){
      if(timeoutId){clearTimeout(timeoutId);timeoutId=null;}
      setBusy(false);
      status("测试完成，运行器已缓存。");
      if($("code").value!==runSource){
        $("result").textContent="执行期间代码发生改变；旧结果已忽略，请重新点击运行。";
      }else{
        display(msg.data);
      }
    }else if(msg.type==="error"){
      terminateRunner("Python 运行环境失败（并非你的代码测试失败）。请查看下方原因。");
      $("result").textContent=String(msg.error||"未知错误");
    }
  };
  worker.onerror=e=>{
    terminateRunner("Worker 启动失败；请检查 HTTPS、浏览器 WebAssembly 支持与网络。");
    $("result").textContent=String(e.message||"Worker error");
  };
  return worker;
}
function preloadRuntime(){
  if(!worker && !running){
    try{ensureWorker().postMessage({type:"init"});}
    catch(err){terminateRunner("无法启动模块 Worker："+String(err.message||err));}
  }
}
function display(out){
  if(!out || !Array.isArray(out.cases)) { $("result").textContent="运行器返回了无效测试结果。"; return; }
  $("tests").innerHTML="";
  let passed=0;
  out.cases.forEach((t,i)=>{
    if(t.ok)passed++;
    const div=document.createElement("div");div.className="test "+(t.ok?"pass":"fail");
    const n=document.createElement("span");n.className="title";n.textContent=(i+1)+". "+String(t.name||tests[i]||"测试");
    const s=document.createElement("span");s.className="status";s.textContent=t.ok?"通过 ✓":"失败 ✗";
    div.append(n,s);$("tests").appendChild(div);
    if(!t.ok && t.error){
      const detail=document.createElement("p");detail.className="test-detail";
      detail.textContent=String(t.error).slice(0,600);$("tests").appendChild(detail);
    }
  });
  data.passed=passed;
  data.fullPass=(passed===10 && out.cases.length===10);
  if(data.fullPass) data.date=new Date().toISOString();
  persist(); updateProgress();
  $("test-count").textContent=passed+"/10";
  $("result").textContent=data.fullPass?
    "恭喜！10个真实 Pydantic 检查全部通过。下一步把代码同步到 Windows 并运行正式 pytest，再提交 Git。":
    "先定位失败原因，再修改代码并重新测试。浏览器端检查通过不能替代正式项目的 pytest。";
}
$("run").addEventListener("click",()=>{
  if(running)return;
  setBusy(true);
  runSource=$("code").value;
  status(worker ? "使用已启动的 Python 运行器执行测试…" : "首次载入 Python 运行器…");
  $("result").textContent="正在运行 Pydantic 模型验证。";
  $("tests").innerHTML="";
  try {ensureWorker().postMessage({type:"run",code:runSource});}
  catch(err){terminateRunner("无法启动模块 Worker");$("result").textContent=String(err.message||err);return;}
  if(timeoutId)clearTimeout(timeoutId);
  timeoutId=setTimeout(()=>{
    terminateRunner("执行超时（120秒）。请检查 CDN 连接情况。代码草稿不会丢失。");
    $("result").textContent="加载超时≠ Python 代码失败。可切换网络或使用 Windows pytest。";
  },120000);
});
