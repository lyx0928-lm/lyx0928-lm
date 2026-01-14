// server.js
const path = require("path");
const express = require("express");
const session = require("express-session");
const Database = require("better-sqlite3");
const fs = require("fs");

function loadEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnv();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123456";
const SESSION_SECRET = process.env.SESSION_SECRET || "change_me";

const app = express();
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true },
  })
);

app.use(express.static(path.join(__dirname, "public")));

const db = new Database(path.join(__dirname, "data.db"));
db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evaluator_name TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

const RANGES = {
  prep: { label: "备课", min: 0, max: 2 },
  teach: { label: "上课", min: 0, max: 6 },
  obs: { label: "听课", min: 0, max: 2 },
};

function isOneDecimalNumber(n) {
  return Number.isFinite(n) && Math.round(n * 10) === n * 10;
}
function inRange(n, min, max) {
  return n >= min && n <= max;
}
function nowISO() {
  return new Date().toISOString();
}

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.status(401).json({ ok: false, error: "NOT_ADMIN" });
}

// 参与者设置自己的名字（写入 session）
app.post("/api/set-name", (req, res) => {
  const name = String(req.body?.name || "").trim();
  if (!name) return res.status(400).json({ ok: false, error: "NAME_REQUIRED" });
  if (name.length > 40) return res.status(400).json({ ok: false, error: "NAME_TOO_LONG" });
  req.session.evaluatorName = name;
  return res.json({ ok: true });
});

// 参与者提交评分（仅返回成功/失败，不返回统计结果）
app.post("/api/submit", (req, res) => {
  const evaluatorName = String(req.session?.evaluatorName || "").trim();
  if (!evaluatorName) return res.status(401).json({ ok: false, error: "NAME_NOT_SET" });

  const people = req.body?.people;
  if (!Array.isArray(people)) return res.status(400).json({ ok: false, error: "INVALID_PAYLOAD" });
  if (people.length < 2 || people.length > 5) {
    return res.status(400).json({ ok: false, error: "COUNT_2_TO_5_REQUIRED" });
  }

  // 后端严格校验
  const normalized = [];
  for (let i = 0; i < people.length; i++) {
    const p = people[i] || {};
    const name = String(p.name || "").trim();
    const prep = Number(p.prep);
    const teach = Number(p.teach);
    const obs = Number(p.obs);

    if (!name) return res.status(400).json({ ok: false, error: `PERSON_${i+1}_NAME_REQUIRED` });
    if (name.length > 40) return res.status(400).json({ ok: false, error: `PERSON_${i+1}_NAME_TOO_LONG` });

    if (![prep, teach, obs].every(isOneDecimalNumber)) {
      return res.status(400).json({ ok: false, error: `PERSON_${i+1}_ONE_DECIMAL_ONLY` });
    }

    if (!inRange(prep, RANGES.prep.min, RANGES.prep.max)) {
      return res.status(400).json({ ok: false, error: `PERSON_${i+1}_PREP_RANGE` });
    }
    if (!inRange(teach, RANGES.teach.min, RANGES.teach.max)) {
      return res.status(400).json({ ok: false, error: `PERSON_${i+1}_TEACH_RANGE` });
    }
    if (!inRange(obs, RANGES.obs.min, RANGES.obs.max)) {
      return res.status(400).json({ ok: false, error: `PERSON_${i+1}_OBS_RANGE` });
    }

    const total = Math.round((prep + teach + obs) * 10) / 10; // 保留1位小数
    normalized.push({ name, prep, teach, obs, total });
  }

  // 要求：被打分的人总分必须两两不同（用于排序）
  const set = new Set(normalized.map(p => p.total.toFixed(1)));
  if (set.size !== normalized.length) {
    return res.status(400).json({ ok: false, error: "TOTALS_MUST_BE_UNIQUE" });
  }

  // 排序（高分在前）
  normalized.sort((a, b) => b.total - a.total);

  const payload = {
    evaluatorName,
    rankedPeople: normalized,
  };

  const stmt = db.prepare(
    "INSERT INTO submissions (evaluator_name, payload_json, created_at) VALUES (?, ?, ?)"
  );
  stmt.run(evaluatorName, JSON.stringify(payload), nowISO());

  return res.json({ ok: true });
});

// 管理员登录
app.post("/api/admin/login", (req, res) => {
  const pw = String(req.body?.password || "");
  if (pw !== ADMIN_PASSWORD) return res.status(401).json({ ok: false, error: "BAD_PASSWORD" });
  req.session.isAdmin = true;
  return res.json({ ok: true });
});

// 管理员登出
app.post("/api/admin/logout", (req, res) => {
  req.session.isAdmin = false;
  return res.json({ ok: true });
});

// 管理员查看所有提交
app.get("/api/admin/submissions", requireAdmin, (req, res) => {
  const rows = db.prepare("SELECT id, evaluator_name, payload_json, created_at FROM submissions ORDER BY id DESC").all();
  const data = rows.map(r => ({
    id: r.id,
    evaluatorName: r.evaluator_name,
    createdAt: r.created_at,
    payload: JSON.parse(r.payload_json),
  }));
  res.json({ ok: true, data });
});

// admin 页面路由（静态文件）
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
