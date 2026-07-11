const schema = window.BADMINTON_SCHEMA;
const clientForm = document.querySelector("#clientForm");
const toast = document.querySelector("#toast");
const successModal = document.querySelector("#successModal");
const languageToggle = document.querySelector("#languageToggle");
let currentLang = localStorage.getItem("badminton_client_lang") || "en";

function tr(value) {
  return currentLang === "zh" ? (window.BADMINTON_ZH[value] || value) : value;
}

function renderStaticText() {
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  document.title = tr("Badminton Motion-Analysis Product Survey");
  document.querySelector("#eyebrow").textContent = tr("Badminton research survey");
  document.querySelector("#pageHeading").textContent = tr("Badminton Motion-Analysis Product Survey");
  document.querySelector("#formHeading").textContent = tr("Questionnaire");
  document.querySelector("#formIntro").textContent = tr("Please answer the following questions based on your badminton experience. Required questions are marked with an asterisk.");
  document.querySelector("#successHeading").textContent = tr("Thank you");
  document.querySelector("#successText").textContent = tr("Your questionnaire has been submitted successfully.");
  document.querySelector("#closeSuccessModal").textContent = tr("Close");
  languageToggle.textContent = currentLang === "zh" ? "EN" : "中文";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function groupBySection(questions) {
  return questions.reduce((groups, question) => {
    groups[question.section] ||= [];
    groups[question.section].push(question);
    return groups;
  }, {});
}

function renderClientForm() {
  renderStaticText();
  document.querySelector("#questionCount").textContent = currentLang === "zh" ? `${schema.questions.length} ${tr("questions")}` : `${schema.questions.length} questions`;
  clientForm.innerHTML = "";

  Object.entries(groupBySection(schema.questions)).forEach(([sectionName, questions]) => {
    const section = document.createElement("section");
    section.className = "formSection";

    const heading = document.createElement("h3");
    heading.textContent = tr(sectionName);
    section.appendChild(heading);

    const concept = schema.sectionDescriptions?.[sectionName];
    if (concept) {
      const description = document.createElement("div");
      description.className = "sectionDescription";
      const title = document.createElement("strong");
      title.textContent = tr(concept.title);
      const text = document.createElement("p");
      text.textContent = tr(concept.text);
      description.append(title, text);
      section.appendChild(description);
    }

    questions.forEach(question => section.appendChild(renderQuestion(question)));
    clientForm.appendChild(section);
  });

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = tr("Submit answers");
  clientForm.appendChild(submit);
  updateConditionalQuestions();
}

function renderQuestion(question) {
  const wrapper = document.createElement("div");
  wrapper.className = "formGroup";
  wrapper.dataset.questionId = question.id;
  if (question.conditionalOn) wrapper.dataset.conditional = "true";

  const label = document.createElement("label");
  label.className = "questionLabel";
  label.textContent = tr(question.label);
  if (question.required) {
    const required = document.createElement("span");
    required.className = "required";
    required.textContent = " *";
    label.appendChild(required);
  }
  wrapper.appendChild(label);

  const meta = document.createElement("p");
  meta.className = "questionMeta";
  meta.textContent = questionTypeHint(question);
  wrapper.appendChild(meta);

  if (question.description) {
    const description = document.createElement("p");
    description.className = "questionDescription";
    description.textContent = tr(question.description);
    wrapper.appendChild(description);
  }

  if (question.type === "long_text") wrapper.appendChild(textareaElement(question));
  if (question.type === "single_choice") {
    question.options.forEach(option => wrapper.appendChild(choiceElement("radio", question, option)));
    if (question.allowOther) wrapper.appendChild(otherChoiceElement("radio", question));
  }
  if (question.type === "multiple_choice") {
    question.options.forEach(option => wrapper.appendChild(choiceElement("checkbox", question, option)));
    if (question.inlineTextOption) wrapper.appendChild(inlineTextChoiceElement(question));
    if (question.allowOther) wrapper.appendChild(otherChoiceElement("checkbox", question));
  }
  if (question.type === "contact") {
    const grid = document.createElement("div");
    grid.className = "contactGrid";
    grid.append(
      inputElement("text", `${question.id}_name`, tr("Name / nickname")),
      inputElement("text", `${question.id}_contact`, tr("Email / WeChat / phone"))
    );
    wrapper.appendChild(grid);
  }
  return wrapper;
}

function questionTypeHint(question) {
  const hints = {
    multiple_choice: "Multiple choice",
    single_choice: "Single choice",
    long_text: "Written answer",
    contact: "Optional written answer"
  };
  return tr(hints[question.type] || "Answer");
}

function inputElement(type, name, placeholder = "") {
  const input = document.createElement("input");
  input.type = type;
  input.name = name;
  input.placeholder = placeholder;
  return input;
}

function textareaElement(question) {
  const textarea = document.createElement("textarea");
  textarea.name = question.id;
  textarea.required = question.required;
  return textarea;
}

function choiceElement(type, question, option) {
  const label = document.createElement("label");
  label.className = "choice";
  const input = inputElement(type, question.id);
  input.value = option;
  input.required = type === "radio" && question.required;
  if (question.id === "follow_up_willingness") input.addEventListener("change", updateConditionalQuestions);
  label.append(input, document.createTextNode(tr(option)));
  return label;
}

function inlineTextChoiceElement(question) {
  const label = document.createElement("label");
  label.className = "choice otherChoice";
  const checkbox = inputElement("checkbox", question.id);
  checkbox.value = "__INLINE_TEXT__";
  const caption = document.createElement("span");
  caption.textContent = tr(question.inlineTextOption);
  const text = inputElement("text", `${question.id}_inline`);
  text.setAttribute("aria-label", tr(question.inlineTextOption));
  text.addEventListener("input", () => { if (text.value.trim()) checkbox.checked = true; });
  label.append(checkbox, caption, text);
  return label;
}

function otherChoiceElement(type, question) {
  const label = document.createElement("label");
  label.className = "choice otherChoice";
  const input = inputElement(type, question.id);
  input.value = BadmintonData.OTHER_VALUE;
  input.required = type === "radio" && question.required;
  const text = inputElement("text", `${question.id}_other`, tr("Other: ______"));
  text.addEventListener("input", () => { if (text.value.trim()) input.checked = true; });
  label.append(input, text);
  return label;
}

function updateConditionalQuestions() {
  schema.questions.filter(question => question.conditionalOn).forEach(question => {
    const selected = clientForm.querySelector(`input[name="${question.conditionalOn.questionId}"]:checked`)?.value;
    const visible = question.conditionalOn.values.includes(selected);
    const wrapper = clientForm.querySelector(`[data-question-id="${question.id}"]`);
    wrapper.hidden = !visible;
    wrapper.querySelectorAll("input, textarea").forEach(input => { input.disabled = !visible; });
  });
}

function collectAnswers() {
  const data = new FormData(clientForm);
  const answers = {};
  schema.questions.forEach(question => {
    if (question.type === "multiple_choice") {
      const other = data.get(`${question.id}_other`)?.trim();
      const inline = data.get(`${question.id}_inline`)?.trim();
      answers[question.id] = data.getAll(question.id).map(value => {
        if (value === BadmintonData.OTHER_VALUE) return `Other: ${other}`;
        if (value === "__INLINE_TEXT__") return `${question.inlineTextOption} ${inline}`.trim();
        return value;
      }).filter(value => !value.endsWith(":") && value !== "Other: ");
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
  try {
    await BadmintonData.createSubmission({
      id: BadmintonData.uid(),
      createdAt: new Date().toISOString(),
      questionnaireVersion: schema.version,
      language: currentLang,
      answers: collectAnswers()
    });
    clientForm.reset();
    updateConditionalQuestions();
    successModal.classList.add("show");
    showToast(tr("Submitted successfully."));
  } catch (error) {
    console.error(error);
    showToast(tr("Submission failed. Please tell the researcher."));
  }
});

document.querySelector("#closeSuccessModal").addEventListener("click", () => successModal.classList.remove("show"));
languageToggle.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "zh" : "en";
  localStorage.setItem("badminton_client_lang", currentLang);
  renderClientForm();
});
renderClientForm();

