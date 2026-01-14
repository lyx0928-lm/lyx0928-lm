const SUPABASE_URL = "https://vyyisfbyuvmroqzbkcme.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_sU6Sj59xu7V_YhaBb3Cnhg_JU-JzFu-";

const RANGES = {
  prep:  { label: "备课", min: 0, max: 2 },
  teach: { label: "上课", min: 0, max: 6 },
  obs:   { label: "听课", min: 0, max: 2 },
};

function setHint(el, text, ok=false) {
  el.textContent = text || "";
  el.className = ok ? "hint ok" : "hint";
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
  if (!window.supabase) return null;           // CDN 没加载
  if (!supabaseConfigured()) return null;      // 没替换配置
  try {
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch {
    return null;
  }
}

function buildPeopleInputs(peopleWrap, countSel) {
  peopleWrap.innerHTML = "";
  const count = Number(countSel.value);

  for (let i = 1; i <= count; i++) {
    const div = document.createElement("div");
    div.className = "person";
    div.innerHTML = `
      <h3>第 ${i} 人</h3>
      <div class="grid">
        <label>姓名</label>
        <input id="pname${i}" type="text" placeholder="被评分人姓名" />

        <label>${RANGES.prep.label}</label>
        <input id="prep${i}" type="number" step="0.1" min="0" max="2" placeholder="0-2（1位小数）" />

        <label>${RANGES.teach.label}</label>
        <input id="teach${i}" type="number" step="0.1" min="0" max="6" placeholder="0-6（1位小数）" />

        <label>${RANGES.obs.label}</label>
        <input id="obs${i}" type="number" step="0.1" min="0" max="2" placeholder="0-2（1位小数）" />
      </div>
    `;
    peopleWrap.appendChild(div);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const myName = document.getElementById("myName");
  const setNameBtn = document.getElementById("setNameBtn");
  const nameMsg = document.getElementById("nameMsg");
  const formCard = document.getElementById("formCard");

  const countSel = document.getElementById("count");
  const peopleWrap = document.getElementById("peopleWrap");
  const scoreForm = document.getElementById("scoreForm");
  const msg = document.getElementById("msg");
  const resetBtn = document.getElementById("resetBtn");

  // 恢复评分人名字
  const savedName = localStorage.getItem("evaluatorName");
  if (savedName) {
    myName.value = savedName;
    formCard.style.display = "";
    setHint(nameMsg, "✅ 已恢复你的名字，可以开始评分。", true);
  }

  buildPeopleInputs(peopleWrap, countSel);

  countSel.addEventListener("change", () => {
    scoreForm.reset();
    setHint(msg, "");
    buildPeopleInputs(peopleWrap, countSel);
  });

  resetBtn.addEventListener("click", () => {
    scoreForm.reset();
    setHint(msg, "");
  });

  // ✅ 确认名字：一定会有反应
  setNameBtn.addEventListener("click", () => {
    setHint(nameMsg, "");
    const name = myName.value.trim();
    if (!name) return setHint(nameMsg, "❌ 请输入你的名字。");
    if (name.length > 40) return setHint(nameMsg, "❌ 名字太长（最多40字）。");

    localStorage.setItem("evaluatorName", name);
    formCard.style.display = "";
    setHint(nameMsg, "✅ 名字已确认，可以开始评分。", true);
  });

  scoreForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setHint(msg, "");

    const evaluatorName = (localStorage.getItem("evaluatorName") || "").trim();
    if (!evaluatorName) return setHint(msg, "❌ 请先输入并确认你的名字。");

    const count = Number(countSel.value);
    const people = [];

    for (let i = 1; i <= count; i++) {
      const name = document.getElementById(`pname${i}`).value.trim();
      const prep  = Number(document.getElementById(`prep${i}`).value);
      const teach = Number(document.getElementById(`teach${i}`).value);
      const obs   = Number(document.getElementById(`obs${i}`).value);

      if (!name) return setHint(msg, `❌ 第 ${i} 人：姓名不能为空。`);
      if (name.length > 40) return setHint(msg, `❌ 第 ${i} 人：姓名太长（最多40字）。`);
      if (![prep, teach, obs].every(isOneDecimalNumber)) return setHint(msg, `❌ 第 ${i} 人：分数最多一位小数。`);

      if (!inRange(prep, RANGES.prep.min, RANGES.prep.max)) return setHint(msg, `❌ 第 ${i} 人：备课范围 0-2。`);
      if (!inRange(teach, RANGES.teach.min, RANGES.teach.max)) return setHint(msg, `❌ 第 ${i} 人：上课范围 0-6。`);
      if (!inRange(obs, RANGES.obs.min, RANGES.obs.max)) return setHint(msg, `❌ 第 ${i} 人：听课范围 0-2。`);

      people.push({ name, prep, teach, obs, total: total1(prep, teach, obs) });
    }

    const uniq = new Set(people.map(p => p.total.toFixed(1)));
    if (uniq.size !== people.length) {
      return setHint(msg, "❌ 无法提交：存在相同总分，请调整，让每人总分都不同。");
    }

    people.sort((a, b) => b.total - a.total);

    const sb = getClientOrNull();
    if (!sb) {
      return setHint(
        msg,
        "❌ 无法提交：Supabase 未配置或加载失败。请确认已替换 SUPABASE_URL / SUPABASE_ANON_KEY，且 supabase-js CDN 能访问。"
      );
    }

    const { error } = await sb.from("submissions").insert({
      evaluator_name: evaluatorName,
      ranked_people: people
    });

    if (error) return setHint(msg, `❌ 提交失败：${error.message}`);

    scoreForm.reset();
    setHint(msg, "✅ 提交成功！（参与者无法查看统计结果）", true);
  });
});
