const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_PUBLIC_KEY";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const emailEl = document.getElementById("email");
const pwEl = document.getElementById("pw");
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
function escapeHtml(str) {
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
}

async function refresh() {
  const { data, error } = await supabase
    .from("submissions")
    .select("id,evaluator_name,ranked_people,created_at")
    .order("id", { ascending: false });

  if (error) {
    meta.textContent = "无权限或未登录（只有统计员可读取）。";
    list.innerHTML = "";
    return;
  }
  cached = data || [];
  meta.textContent = `总提交数：${cached.length}`;

  list.innerHTML = cached.map(item => {
    const ranked = item.ranked_people || [];
    const rankedHtml = ranked.map((p, idx) => `
      <div style="margin:6px 0;">
        <b>第${idx+1}名</b>：${escapeHtml(p.name)}
        （备课 ${Number(p.prep).toFixed(1)} / 上课 ${Number(p.teach).toFixed(1)} / 听课 ${Number(p.obs).toFixed(1)} / 总分 <b>${Number(p.total).toFixed(1)}</b>）
      </div>
    `).join("");

    return `
      <div class="person" style="margin:12px 0;">
        <div><b>ID：</b>${item.id}　<b>评分人：</b>${escapeHtml(item.evaluator_name)}　<b>时间：</b>${escapeHtml(item.created_at)}</div>
        <div style="margin-top:8px;">${rankedHtml}</div>
      </div>
    `;
  }).join("");
}

function toCSV(data) {
  const rows = [];
  rows.push(["id","created_at","evaluator","rank","person","prep","teach","obs","total"].join(","));
  for (const item of data) {
    const ranked = item.ranked_people || [];
    for (let i = 0; i < ranked.length; i++) {
      const p = ranked[i];
      rows.push([
        item.id,
        item.created_at,
        `"${String(item.evaluator_name).replaceAll('"','""')}"`,
        i+1,
        `"${String(p.name).replaceAll('"','""')}"`,
        Number(p.prep).toFixed(1),
        Number(p.teach).toFixed(1),
        Number(p.obs).toFixed(1),
        Number(p.total).toFixed(1),
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

loginBtn.addEventListener("click", async () => {
  setHint(loginMsg, "");
  const email = emailEl.value.trim();
  const password = pwEl.value;
  if (!email || !password) return setHint(loginMsg, "❌ 请输入邮箱和密码。");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return setHint(loginMsg, "❌ 登录失败：邮箱或密码错误。");

  loginCard.style.display = "none";
  dataCard.style.display = "";
  await refresh();
});

refreshBtn.addEventListener("click", refresh);

exportBtn.addEventListener("click", () => {
  download("submissions.csv", toCSV(cached));
});

logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  dataCard.style.display = "none";
  loginCard.style.display = "";
  setHint(loginMsg, "已退出。", true);
});
