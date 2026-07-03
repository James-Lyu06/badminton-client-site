const BadmintonData = (() => {
  const config = window.BADMINTON_CONFIG || {};
  const localKey = "badminton_submissions_local_demo_v1";
  const OTHER_VALUE = "__other__";

  function isSupabaseConfigured() {
    return Boolean(config.SUPABASE_URL && config.SUPABASE_ANON_KEY);
  }

  function endpoint() {
    const table = config.SUBMISSIONS_TABLE || "badminton_submissions";
    return `${config.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${table}`;
  }

  function headers(extra = {}) {
    return {
      apikey: config.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${config.SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      ...extra
    };
  }

  function uid(prefix = "submission") {
    return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
  }

  function localItems() {
    try { return JSON.parse(localStorage.getItem(localKey)) || []; }
    catch { return []; }
  }

  async function createSubmission(submission) {
    if (!isSupabaseConfigured()) {
      const items = localItems();
      items.unshift(submission);
      localStorage.setItem(localKey, JSON.stringify(items, null, 2));
      return submission;
    }

    const response = await fetch(endpoint(), {
      method: "POST",
      headers: headers({ Prefer: "return=representation" }),
      body: JSON.stringify({
        id: submission.id,
        created_at: submission.createdAt,
        questionnaire_version: submission.questionnaireVersion,
        language: submission.language,
        answers: submission.answers
      })
    });
    if (!response.ok) throw new Error(await response.text());
    const rows = await response.json();
    return rows[0];
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  return { OTHER_VALUE, createSubmission, escapeHtml, isSupabaseConfigured, uid };
})();
