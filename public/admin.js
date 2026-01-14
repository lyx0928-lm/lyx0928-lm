const pw = document.getElementById("pw");
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("loginMsg");
const loginCard = document.getElementById("loginCard");

const dataCard = document.getElementById("dataCard");
const refreshBtn = document.getElementById("refreshBtn");
const exportBtn = document.getElementById("exportBtn");
const logoutBtn = document.getElementById("logoutBtn");
const meta = document.getElementById("meta");
const list = document.getElementById("list");

let cached = [];

function setHint(el, text, ok=false) {
  el.textContent = text || "";
  el.className = ok ? "hint ok" : "hint";
}

async function login() {
  setHint(loginMsg, "");
  const password = pw.value;
  if (!password) return setHint(loginMsg, "❌ 请输入密码。");

  const r = await fetch("/api/admin/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ password })
  });
  const j = await r.json().catch(()=>({}));
  if (!r.ok || !j.ok) return setHint(loginMsg, "❌ 密码错误。");

  loginCard.style.display = "none";
  dataCard.style.display = "";
  await refresh();
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
}

async function refresh() {
  const r = await fetch("/api/admin/submissions");
  const j = await r.json().catch(()=>({}));
  if (!r.ok || !j.ok) {
    meta.textContent = "未登录或无权限。";
    return;
  }
  cached = j.data || [];
  meta.textContent = `总提交数：${cached.length}`;
  render(cached);
}

function render(data) {
  list.innerHTML = data.map(item => {
    const payload = item.payload;
    const evaluator = payload?.evaluatorName || item.evaluatorName;
    const ranked = payload?.rankedPeople || [];
    const rankedHtml = ranked.map((p, idx) => `
      <div style="margin:6px 0;">
        <b>第${idx+1}名</b>：${escapeHtml(p.name)}（备课 ${p.prep.toFixed(1)} / 上课 ${p.teach.toFixed(1)} / 听课 ${p.obs.toFixed(1)} / 总分 <b>${p.total.toFixed(1)}</b>）
      </div>
    `).join("");

    return `
      <div class="person" style="margin:12px 0;">
        <div><b>提交ID：</b>${item.id}　<b>评分人：</b>${escapeHtml(evaluator)}　<b>时间：</b>${escapeHtml(item.createdAt)}</div>
        <div style="margin-top:8px;">${rankedHtml}</div>
      </div>
    `;
  }).join("");
}

function toCSV(data) {
  const rows = [];
  rows.push([
    "submit_id","created_at","evaluator",
    "rank","person_name","prep","teach","obs","total"
  ].join(","));

  for (const item of data) {
    const payload = item.payload || {};
    const evaluator = payload.evaluatorName || item.evaluatorName || "";
    const ranked = payload.rankedPeople || [];
    for (let i = 0; i < ranked.length; i++) {
      const p = ranked[i];
      rows.push([
        item.id,
        item.createdAt,
        `"${String(evaluator).replaceAll('"','""')}"`,
        i+1,
        `"${String(p.name).replaceAll('"','""')}"`,
        p.prep.toFixed(1),
        p.teach.toFixed(1),
        p.obs.toFixed(1),
        p.total.toFixed(1),
      ].join(","));
    }
  }
  return rows.join("\n");
}

function download(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

loginBtn.addEventListener("click", login);
refreshBtn.addEventListener("click", refresh);

exportBtn.addEventListener("click", () => {
  const csv = toCSV(cached);
  download("submissions.csv", csv);
});

logoutBtn.addEventListener("click", async () => {
  await fetch("/api/admin/logout", { method: "POST" });
  dataCard.style.display = "none";
  loginCard.style.display = "";
  pw.value = "";
  setHint(loginMsg, "已退出。", true);
});
