const RANGES = {
  prep:  { label: "备课", min: 0, max: 2 },
  teach: { label: "上课", min: 0, max: 6 },
  obs:   { label: "听课", min: 0, max: 2 },
};

const myName = document.getElementById("myName");
const setNameBtn = document.getElementById("setNameBtn");
const nameMsg = document.getElementById("nameMsg");
const formCard = document.getElementById("formCard");

const countSel = document.getElementById("count");
const peopleWrap = document.getElementById("peopleWrap");
const scoreForm = document.getElementById("scoreForm");
const msg = document.getElementById("msg");
const resetBtn = document.getElementById("resetBtn");

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

function buildPeopleInputs(count) {
  peopleWrap.innerHTML = "";
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

buildPeopleInputs(Number(countSel.value));

countSel.addEventListener("change", () => {
  scoreForm.reset();
  setHint(msg, "");
  buildPeopleInputs(Number(countSel.value));
});

resetBtn.addEventListener("click", () => {
  scoreForm.reset();
  setHint(msg, "");
});

setNameBtn.addEventListener("click", async () => {
  setHint(nameMsg, "");
  const name = myName.value.trim();
  if (!name) return setHint(nameMsg, "❌ 请输入你的名字。");

  const r = await fetch("/api/set-name", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ name })
  });

  if (!r.ok) {
    const j = await r.json().catch(()=>({}));
    return setHint(nameMsg, `❌ 设置失败：${j.error || "UNKNOWN"}`);
  }

  setHint(nameMsg, "✅ 名字已确认，可以开始评分。", true);
  formCard.style.display = "";
});

scoreForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setHint(msg, "");

  const count = Number(countSel.value);
  const people = [];

  for (let i = 1; i <= count; i++) {
    const name = document.getElementById(`pname${i}`).value.trim();
    const prep  = Number(document.getElementById(`prep${i}`).value);
    const teach = Number(document.getElementById(`teach${i}`).value);
    const obs   = Number(document.getElementById(`obs${i}`).value);

    if (!name) return setHint(msg, `❌ 第 ${i} 人：姓名不能为空。`);
    if (![prep, teach, obs].every(isOneDecimalNumber)) return setHint(msg, `❌ 第 ${i} 人：分数最多一位小数。`);

    if (!inRange(prep, RANGES.prep.min, RANGES.prep.max)) return setHint(msg, `❌ 第 ${i} 人：备课范围 0-2。`);
    if (!inRange(teach, RANGES.teach.min, RANGES.teach.max)) return setHint(msg, `❌ 第 ${i} 人：上课范围 0-6。`);
    if (!inRange(obs, RANGES.obs.min, RANGES.obs.max)) return setHint(msg, `❌ 第 ${i} 人：听课范围 0-2。`);

    people.push({ name, prep, teach, obs, total: total1(prep, teach, obs) });
  }

  // 前端也做一次“总分唯一”校验
  const uniq = new Set(people.map(p => p.total.toFixed(1)));
  if (uniq.size !== people.length) {
    return setHint(msg, "❌ 无法提交：存在相同总分，请调整，让每人总分都不同。");
  }

  const r = await fetch("/api/submit", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ people })
  });

  const j = await r.json().catch(()=>({}));
  if (!r.ok || !j.ok) {
    const reason = j.error || "UNKNOWN";
    if (reason === "TOTALS_MUST_BE_UNIQUE") {
      return setHint(msg, "❌ 无法提交：存在相同总分，请调整让每人总分都不同。");
    }
    if (reason === "NAME_NOT_SET") {
      return setHint(msg, "❌ 你还没确认名字，请先输入你的名字。");
    }
    return setHint(msg, `❌ 提交失败：${reason}`);
  }

  scoreForm.reset();
  setHint(msg, "✅ 提交成功！（你无法查看统计结果）", true);
});
