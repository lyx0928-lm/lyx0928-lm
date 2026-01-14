const SUPABASE_URL = "https://vyyisfbyuvmroqzbkcme.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jiQdKkQhYlkD925kvSvjVw_NL8X22X4";

const RANGES = {
  prep:  { label: "备课", min: 0, max: 2 },
  teach: { label: "上课", min: 0, max: 6 },
  obs:   { label: "听课", min: 0, max: 2 },
};

const form = document.getElementById("scoreForm");
const evaluatorEl = document.getElementById("evaluator");
const countSel = document.getElementById("count");
const peopleWrap = document.getElementById("peopleWrap");
const resetBtn = document.getElementById("resetBtn");
const msg = document.getElementById("msg");

function setMsg(text, ok=false) {
  msg.textContent = text || "";
  msg.className = ok ? "hint ok" : "hint";
}

function isOneDecimalNumber(n) {
  return Number.isFinite(n) && Math.round(n * 10) === n * 10;
}
function inRange(n, min, max) {
  return n >= min && n <= max;
}
function total1(prep, teach, obs) {
  return Math.round((prep + teach + obs) * 10) / 10;
}

function supabaseConfigured() {
  return (
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes("YOUR_SUPABASE_URL") &&
    !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE_ANON_PUBLIC_KEY")
  );
}
function getClientOrNull() {
  if (!window.supabase) return null;
  if (!supabaseConfigured()) return null;
  try {
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch {
    return null;
  }
}

function buildPeopleInputs(count) {
  peopleWrap.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const div = document.createElement("div");
    div.className = "person";
    div.innerHTML = `
      <h3>第 ${i} 人</h3>
      <div class="grid">
        <label>姓名</label>
        <input id="pname${i}" type="text" placeholder="被评分人姓名" required />

        <label>${RANGES.prep.label}</label>
        <input id="prep${i}" type="number" step="0.1" min="0" max="2" placeholder="0-2（1位小数）" required />

        <label>${RANGES.teach.label}</label>
        <input id="teach${i}" type="number" step="0.1" min="0" max="6" placeholder="0-6（1位小数）" required />

        <label>${RANGES.obs.label}</label>
        <input id="obs${i}" type="number" step="0.1" min="0" max="2" placeholder="0-2（1位小数）" required />
      </div>
    `;
    peopleWrap.appendChild(div);
  }
}

// 初始生成
buildPeopleInputs(Number(countSel.value));

// ✅ 切换人数：不要 form.reset()，否则 select 会回默认值（5）
countSel.addEventListener("change", () => {
  setMsg("");
  buildPeopleInputs(Number(countSel.value));
});

// ✅ 清空：不要 form.reset()，否则 select 会回默认值（5）
resetBtn.addEventListener("click", () => {
  setMsg("");
  evaluatorEl.value = "";
  buildPeopleInputs(Number(countSel.value));
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg("");

  const evaluatorName = evaluatorEl.value.trim();
  if (!evaluatorName) return setMsg("❌ 请输入你的名字。");
  if (evaluatorName.length > 40) return setMsg("❌ 你的名字太长（最多40字）。");

  const count = Number(countSel.value);
  const people = [];

  for (let i = 1; i <= count; i++) {
    const name = document.getElementById(`pname${i}`).value.trim();
    const prep  = Number(document.getElementById(`prep${i}`).value);
    const teach = Number(document.getElementById(`teach${i}`).value);
    const obs   = Number(document.getElementById(`obs${i}`).value);

    if (!name) return setMsg(`❌ 第 ${i} 人：姓名不能为空。`);
    if (name.length > 40) return setMsg(`❌ 第 ${i} 人：姓名太长（最多40字）。`);

    if (![prep, teach, obs].every(isOneDecimalNumber)) return setMsg(`❌ 第 ${i} 人：分数最多一位小数。`);
    if (!inRange(prep, RANGES.prep.min, RANGES.prep.max)) return setMsg(`❌ 第 ${i} 人：备课范围 0-2。`);
    if (!inRange(teach, RANGES.teach.min, RANGES.teach.max)) return setMsg(`❌ 第 ${i} 人：上课范围 0-6。`);
    if (!inRange(obs, RANGES.obs.min, RANGES.obs.max)) return setMsg(`❌ 第 ${i} 人：听课范围 0-2。`);

    people.push({ name, prep, teach, obs, total: total1(prep, teach, obs) });
  }

  // 总分必须唯一（按1位小数）
  const uniq = new Set(people.map(p => p.total.toFixed(1)));
  if (uniq.size !== people.length) {
    return setMsg("❌ 无法提交：存在相同总分，请调整，让每人总分都不同。");
  }

  // 排序：总分高在前
  people.sort((a, b) => b.total - a.total);

  const sb = getClientOrNull();
  if (!sb) {
    return setMsg("❌ 无法提交：Supabase 未配置或加载失败。请检查 URL / Key 是否已替换，且 CDN 可访问。");
  }

  const { error } = await sb.from("submissions").insert({
    evaluator_name: evaluatorName,
    ranked_people: people
  });

  if (error) return setMsg(`❌ 提交失败：${error.message}`);

  // ✅ 提交成功后：不要 form.reset()，否则人数会回默认值（5）
  evaluatorEl.value = "";
  buildPeopleInputs(Number(countSel.value));
  setMsg("✅ 提交成功！（参与者无法查看统计结果）", true);
});
