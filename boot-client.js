(async () => {
  try {
    window.BADMINTON_SCHEMA = await BadmintonData.loadQuestionnaireConfig(window.BADMINTON_SCHEMA);
  } catch (error) {
    console.error(error);
  }

  const script = document.createElement("script");
  script.src = `client.js?v=${Date.now()}`;
  document.body.appendChild(script);
})();
