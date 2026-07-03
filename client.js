const schema = window.BADMINTON_SCHEMA;
const clientForm = document.querySelector("#clientForm");
const toast = document.querySelector("#toast");
const successModal = document.querySelector("#successModal");
const languageToggle = document.querySelector("#languageToggle");
let currentLang = localStorage.getItem("badminton_client_lang") || "en";

const copy = {
  en: {
    documentTitle: "Badminton Feedback Questionnaire",
    eyebrow: "Badminton test feedback",
    heading: "Questionnaire",
    formTitle: "Badminton testing feedback",
    intro: "Please answer the following questions based on your testing experience. Required questions are marked with an asterisk.",
    questions: count => `${count} questions`,
    submit: "Submit answers",
    successTitle: "Thank you",
    successText: "Your questionnaire has been submitted successfully.",
    close: "Close",
    submitted: "Submitted successfully.",
    submitFailed: "Submission failed. Please tell the researcher.",
    toggle: "中文",
    other: "Other...",
    namePlaceholder: "Name / nickname",
    contactPlaceholder: "Email / WeChat / phone",
    typeHints: { multiple_choice: "Multiple choice", single_choice: "Single choice", rating: "Single choice", long_text: "Written answer", short_text: "Written answer", contact: "Optional contact information", fallback: "Answer" }
  },
  zh: {
    documentTitle: "羽毛球测试反馈问卷",
    eyebrow: "羽毛球测试反馈",
    heading: "问卷",
    formTitle: "羽毛球测试反馈",
    intro: "请根据你的测试体验回答以下问题。带星号的问题为必填。",
    questions: count => `共 ${count} 题`,
    submit: "提交答案",
    successTitle: "感谢提交",
    successText: "你的问卷已经成功提交。",
    close: "关闭",
    submitted: "提交成功。",
    submitFailed: "提交失败，请联系研究人员。",
    toggle: "EN",
    other: "其他...",
    namePlaceholder: "姓名 / 昵称",
    contactPlaceholder: "邮箱 / 微信 / 电话",
    typeHints: { multiple_choice: "多选题", single_choice: "单选题", rating: "单选题", long_text: "文字回答", short_text: "文字回答", contact: "可选联系方式", fallback: "作答" }
  }
};

const zh = {
  title: { "Badminton testing feedback": "羽毛球测试反馈" },
  section: {
    "User background": "用户背景",
    "Current training pain points": "当前训练痛点",
    "Questionnaire feedback": "问卷反馈",
    "Product direction": "产品方向",
    "Open feedback": "开放反馈",
    "Follow-up": "后续联系"
  },
  question: {
    level: "你目前的羽毛球水平是？",
    frequency: "你通常多久打一次羽毛球？",
    coaching: "你是否接受过正式的羽毛球训练？",
    pain_points: "你在提升技术时最大的困难是什么？",
    current_solution: "你目前如何判断自己的击球是否有进步？",
    helpfulness: "你觉得这份测试问卷有多大帮助？",
    trust: "什么会让你更信任动作分析反馈？",
    most_useful: "哪些产品功能对你最有用？",
    future_feedback: "你未来最希望产品告诉你什么？",
    willingness: "训练后你愿意再次使用这个产品吗？",
    concerns: "你最大的顾虑是什么？",
    comments: "你还有其他建议或意见吗？",
    contact: "如果你愿意参加后续测试，请留下姓名和联系方式。"
  },
  option: {
    "Beginner": "初学者",
    "Intermediate": "中级",
    "Advanced": "高级",
    "Competitive / club / school team": "竞技 / 俱乐部 / 校队",
    "Not sure": "不确定",
    "1-3 times per month": "每月 1-3 次",
    "Once per week": "每周 1 次",
    "2-3 times per week": "每周 2-3 次",
    "4+ times per week": "每周 4 次以上",
    "No": "没有",
    "A few trial lessons": "上过几节体验课",
    "I used to take lessons": "以前上过课",
    "I currently take lessons regularly": "目前定期上课",
    "I am a coach / assistant / competitive player": "我是教练 / 助教 / 竞技选手",
    "I do not know what is wrong with my movement": "不知道自己的动作哪里有问题",
    "I forget the coach's feedback during self-practice": "自己练习时容易忘记教练反馈",
    "I feel my movement is correct, but the result is not good": "感觉动作对了但效果不好",
    "I do not know whether I am improving": "不知道自己是否在进步",
    "It is hard to imitate skilled players": "很难模仿高水平选手",
    "I do not have training data or records": "没有训练数据或记录",
    "By feeling": "凭感觉",
    "By shuttle flight result": "看球的飞行效果",
    "Coach feedback": "教练反馈",
    "Friend feedback": "朋友反馈",
    "Video review": "视频复盘",
    "I do not have a clear method": "没有明确方法",
    "Verified by a coach": "由教练验证",
    "Clear explanation of the score": "清楚解释分数含义",
    "Video comparison": "视频对比",
    "Long-term progress tracking": "长期进步追踪",
    "More tests with skilled players": "更多高水平选手数据验证",
    "Overall score": "总评分",
    "Stroke-by-stroke score": "逐拍评分",
    "Consistency": "稳定性",
    "Wrist speed": "手腕速度",
    "Comparison with skilled players": "与高水平选手对比",
    "Simple training suggestions": "简单训练建议",
    "Charts and curves": "图表和曲线",
    "Whether my movement is standard": "我的动作是否标准",
    "How I differ from skilled players": "我和高水平选手的差异",
    "Which stroke was best": "哪一次击球最好",
    "How stable my movement is": "我的动作稳定性如何",
    "How I should improve": "我应该如何改进",
    "Yes": "愿意",
    "Maybe": "可能会",
    "Probably not": "可能不会",
    "Depends on price and accuracy": "取决于价格和准确性",
    "Accuracy": "准确性",
    "Hard to understand": "难以理解",
    "Wearing device is inconvenient": "佩戴设备不方便",
    "Price": "价格",
    "I would rather ask a coach": "我更愿意问教练",
    "May affect playing feeling": "可能影响打球手感",
    "Data privacy": "数据隐私"
  }
};

function t(key) { return copy[currentLang][key]; }
function trTitle(value) { return currentLang === "zh" ? (zh.title[value] || value) : value; }
function trSection(value) { return currentLang === "zh" ? (zh.section[value] || value) : value; }
function trQuestion(question) { return currentLang === "zh" ? (zh.question[question.id] || question.label) : question.label; }
function trOption(value) { return currentLang === "zh" ? (zh.option[value] || value) : value; }

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function renderStaticText() {
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  document.title = t("documentTitle");
  document.querySelectorAll("[data-i18n]").forEach(node => { node.textContent = t(node.dataset.i18n); });
  document.querySelector("#questionCount").textContent = t("questions")(schema.questions.length);
  languageToggle.textContent = t("toggle");
}

function groupBySection(questions) {
  return questions.reduce((acc, question) => {
    const section = question.section || "General";
    acc[section] ||= [];
    acc[section].push(question);
    return acc;
  }, {});
}

function renderClientForm() {
  renderStaticText();
  clientForm.innerHTML = "";
  Object.entries(groupBySection(schema.questions)).forEach(([sectionName, questions]) => {
    const section = document.createElement("section");
    section.className = "formSection";
    section.innerHTML = `<h3>${BadmintonData.escapeHtml(trSection(sectionName))}</h3>`;
    questions.forEach(question => section.appendChild(renderQuestion(question)));
    clientForm.appendChild(section);
  });
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = t("submit");
  clientForm.appendChild(submit);
}

function renderQuestion(question) {
  const wrapper = document.createElement("div");
  wrapper.className = "formGroup";
  const required = question.required ? `<span class="required">*</span>` : "";
  wrapper.innerHTML = `<label class="questionLabel">${BadmintonData.escapeHtml(trQuestion(question))} ${required}</label><p class="questionMeta">${BadmintonData.escapeHtml(questionTypeHint(question))}</p>`;

  if (question.type === "short_text") wrapper.appendChild(inputElement("text", question));
  if (question.type === "long_text") wrapper.appendChild(textareaElement(question));
  if (question.type === "single_choice" || question.type === "rating") {
    question.options.forEach(option => wrapper.appendChild(choiceElement("radio", question, option)));
    if (question.allowOther) wrapper.appendChild(otherChoiceElement("radio", question));
  }
  if (question.type === "multiple_choice") {
    question.options.forEach(option => wrapper.appendChild(choiceElement("checkbox", question, option)));
    if (question.allowOther) wrapper.appendChild(otherChoiceElement("checkbox", question));
  }
  if (question.type === "contact") {
    const grid = document.createElement("div");
    grid.className = "contactGrid";
    const name = inputElement("text", { id: `${question.id}_name`, required: false });
    const contact = inputElement("text", { id: `${question.id}_contact`, required: false });
    name.placeholder = t("namePlaceholder");
    contact.placeholder = t("contactPlaceholder");
    grid.append(name, contact);
    wrapper.appendChild(grid);
  }
  return wrapper;
}

function questionTypeHint(question) {
  return t("typeHints")[question.type] || t("typeHints").fallback;
}

function inputElement(type, question) {
  const input = document.createElement("input");
  input.type = type;
  input.name = question.id;
  input.required = Boolean(question.required);
  return input;
}

function textareaElement(question) {
  const textarea = document.createElement("textarea");
  textarea.name = question.id;
  textarea.required = Boolean(question.required);
  return textarea;
}

function choiceElement(type, question, option) {
  const label = document.createElement("label");
  label.className = "choice";
  const input = document.createElement("input");
  input.type = type;
  input.name = question.id;
  input.value = option;
  input.required = type === "radio" && question.required;
  label.append(input, document.createTextNode(trOption(option)));
  return label;
}

function otherChoiceElement(type, question) {
  const label = document.createElement("label");
  label.className = "choice otherChoice";
  const input = document.createElement("input");
  input.type = type;
  input.name = question.id;
  input.value = BadmintonData.OTHER_VALUE;
  input.required = type === "radio" && question.required;
  const text = document.createElement("input");
  text.type = "text";
  text.name = `${question.id}_other`;
  text.placeholder = t("other");
  text.addEventListener("input", () => { if (text.value.trim()) input.checked = true; });
  label.append(input, text);
  return label;
}

function collectAnswers() {
  const data = new FormData(clientForm);
  const answers = {};
  schema.questions.forEach(question => {
    if (question.type === "multiple_choice") {
      const other = data.get(`${question.id}_other`)?.trim();
      answers[question.id] = data.getAll(question.id)
        .map(value => value === BadmintonData.OTHER_VALUE ? `Other: ${other}` : value)
        .filter(value => value !== "Other: ");
    } else if (question.type === "contact") {
      answers[question.id] = {
        name: data.get(`${question.id}_name`) || "",
        contact: data.get(`${question.id}_contact`) || ""
      };
    } else {
      const value = data.get(question.id) || "";
      const other = data.get(`${question.id}_other`)?.trim();
      answers[question.id] = value === BadmintonData.OTHER_VALUE ? `Other: ${other}` : value;
    }
  });
  return answers;
}

clientForm.addEventListener("submit", async event => {
  event.preventDefault();
  const submission = {
    id: BadmintonData.uid(),
    createdAt: new Date().toISOString(),
    questionnaireVersion: schema.version,
    language: currentLang,
    answers: collectAnswers()
  };
  try {
    await BadmintonData.createSubmission(submission);
    clientForm.reset();
    successModal.classList.add("show");
    showToast(t("submitted"));
  } catch (error) {
    console.error(error);
    showToast(t("submitFailed"));
  }
});

document.querySelector("#closeSuccessModal").addEventListener("click", () => successModal.classList.remove("show"));
languageToggle.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "zh" : "en";
  localStorage.setItem("badminton_client_lang", currentLang);
  renderClientForm();
});

renderClientForm();
