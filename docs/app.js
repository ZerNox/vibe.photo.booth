
(() => {
  "use strict";

  const SPEECH_LANG = "sv-SE";

  const state = {
    apiKey: "",
    demo: true,
    stream: null,
    treatment: "contextual",
    capturedBlob: null,
    eventName: "VIBE Testsession",
    speaking: false
  };

  const $ = (id) => document.getElementById(id);
  const screens = [...document.querySelectorAll(".screen")];

  function show(id) {
    screens.forEach(s => s.classList.toggle("active", s.id === id));
  }

  let swedishVoice = null;
  function loadSwedishVoice() {
    if (!("speechSynthesis" in window)) return;
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return;
    swedishVoice = voices.find(v => v.lang === SPEECH_LANG)
      || voices.find(v => v.lang && v.lang.toLowerCase().startsWith("sv"))
      || null;
  }
  if ("speechSynthesis" in window) {
    loadSwedishVoice();
    speechSynthesis.addEventListener("voiceschanged", loadSwedishVoice);
  }

  function speak(text) {
    $("vibeText").textContent = text;
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LANG;
    if (swedishVoice) utterance.voice = swedishVoice;
    utterance.rate = 1.02;
    utterance.pitch = 0.92;
    state.speaking = true;
    utterance.onend = () => state.speaking = false;
    speechSynthesis.speak(utterance);
  }

  async function startCamera() {
    if (state.stream) return;
    try {
      state.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });
      $("video").srcObject = state.stream;
      $("cameraMessage").textContent = "Visuell inmatning aktiv.";
      $("status").textContent = "Redo";
      speak("Visuella system aktiva. Mänsklig interaktion kan nu börja.");
    } catch (error) {
      $("cameraMessage").textContent = "Kamera- eller mikrofonbehörighet gavs inte.";
      $("status").textContent = "Behörighet krävs";
      console.error(error);
    }
  }

  function stopCamera() {
    if (!state.stream) return;
    state.stream.getTracks().forEach(track => track.stop());
    state.stream = null;
    $("video").srcObject = null;
  }

  function greeting() {
    const greetings = [
      "Människa upptäckt. Fantasimotorn är aktiv.",
      "Visuellt motiv identifierat. Vanlig fotografering har inaktiverats.",
      "Hälsningar, kolbaserad kreativ enhet. Ange önskad verklighet.",
      "Rörelse bekräftad. Socialt protokoll initierat.",
      "Utmärkt. Nya människor. Mina kreativa processorer började bli rastlösa."
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  function buildSummary() {
    const idea = $("scenePrompt").value.trim() || "en fantasifull överraskningsscen";
    const custom = $("customPrompt").value.trim();
    if (state.treatment === "contextual") {
      return `Scen: ${idea}. VIBE lägger till scenanpassade kläder, rekvisita, belysning och lekfulla detaljer på de fotograferade personerna. För en lekfull Parisscen kan detta inkludera baskrar, randiga kläder, baguetter och valfria teatraliska mustascher.`;
    }
    if (state.treatment === "custom") {
      return `Scen: ${idea}. VIBE får endast ändra följande: ${custom || "inga anpassade ändringar har angetts"}.`;
    }
    return `Scen: ${idea}. Personerna förblir som de fotograferades. VIBE ändrar endast miljö, belysning och sammansättning som krävs för att placera dem i scenen.`;
  }

  async function countdownAndCapture() {
    show("booth");
    speak("Mänsklig uppställning godkänd. Fotografering om tre, två, ett.");
    const countdown = $("countdown");
    for (const n of [3, 2, 1]) {
      countdown.textContent = n;
      await new Promise(r => setTimeout(r, 850));
    }
    countdown.textContent = "";
    captureFrame();
  }

  function captureFrame() {
    const video = $("video");
    if (!video.videoWidth) {
      alert("Kameran är inte redo.");
      return;
    }
    const canvas = $("resultCanvas");
    const maxWidth = 1536;
    const scale = Math.min(1, maxWidth / video.videoWidth);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    const bannerHeight = Math.max(64, Math.round(canvas.height * 0.09));
    ctx.fillStyle = "rgba(0,0,0,.78)";
    ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);
    ctx.fillStyle = "#f7df1e";
    ctx.font = `800 ${Math.max(28, Math.round(canvas.width * .035))}px -apple-system, sans-serif`;
    ctx.fillText("VIBE FOTOBÅS", 24, canvas.height - bannerHeight / 2 + 10);
    ctx.fillStyle = "#ffffff";
    ctx.font = `500 ${Math.max(16, Math.round(canvas.width * .018))}px -apple-system, sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText("AI-scen väntar", canvas.width - 24, canvas.height - bannerHeight / 2 + 7);
    ctx.textAlign = "left";

    canvas.toBlob(blob => state.capturedBlob = blob, "image/jpeg", .9);
    const resultText = "Fotografiskt bevis säkrat. Verklighetsomvandling redo.";
    $("resultMessage").textContent = resultText;
    show("result");
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(resultText);
    u.lang = SPEECH_LANG;
    if (swedishVoice) u.voice = swedishVoice;
    speechSynthesis.speak(u);
  }

  async function generateAI() {
    if (state.demo || !state.apiKey) {
      alert("Denna session körs i gränssnittsdemoläge. Ange en API-nyckel i Operatörsinställningar för att försöka med direkt bildgenerering.");
      return;
    }
    if (!state.capturedBlob) {
      alert("Ta ett foto först.");
      return;
    }

    $("generateButton").disabled = true;
    $("generateButton").textContent = "Omvandlar…";
    $("resultMessage").textContent = "Verklighetsrekonstruktion pågår.";

    const idea = $("scenePrompt").value.trim();
    const summary = buildSummary();
    const prompt = [
      "Edit this photograph into a polished, playful photo-booth image.",
      `Requested scene: ${idea}.`,
      `Transformation rules: ${summary}`,
      "Preserve the same number of people and their recognizable identities.",
      "Keep the composition clear and suitable for a family-friendly event.",
      "Do not add written text inside the generated scene."
    ].join(" ");

    try {
      const form = new FormData();
      form.append("model", "gpt-image-1");
      form.append("prompt", prompt);
      form.append("image", state.capturedBlob, "capture.jpg");
      form.append("size", "1024x1024");

      const response = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: { "Authorization": `Bearer ${state.apiKey}` },
        body: form
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API-anrop misslyckades (${response.status}): ${text.slice(0, 400)}`);
      }

      const data = await response.json();
      const b64 = data?.data?.[0]?.b64_json;
      if (!b64) throw new Error("Ingen bilddata returnerades.");

      const img = new Image();
      img.onload = () => {
        const canvas = $("resultCanvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d").drawImage(img, 0, 0);
        $("resultMessage").textContent = "Omvandling klar. Syntetiskt mästerverk verifierat.";
      };
      img.src = `data:image/png;base64,${b64}`;
    } catch (error) {
      console.error(error);
      $("resultMessage").textContent = "Direktgenerering i webbläsaren misslyckades. Detta kan bero på webbläsarens API-begränsningar; kamera- och samtalsprototypen fungerar fortfarande.";
      alert(error.message);
    } finally {
      $("generateButton").disabled = false;
      $("generateButton").textContent = "Generera AI-version";
    }
  }

  function startSpeechInput() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      alert("Taligenkänning är inte tillgänglig i denna Safari-konfiguration. Skriv idén istället.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = SPEECH_LANG;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    $("voicePromptButton").textContent = "Lyssnar…";
    recognition.onresult = e => {
      $("scenePrompt").value = e.results[0][0].transcript;
    };
    recognition.onerror = e => alert(`Röstinmatningsfel: ${e.error}`);
    recognition.onend = () => $("voicePromptButton").textContent = "🎙 Säg din idé";
    recognition.start();
  }

  function resetGuest() {
    state.capturedBlob = null;
    $("scenePrompt").value = "Lekfull scen på ett franskt café";
    $("customPrompt").value = "";
    state.treatment = "contextual";
    document.querySelectorAll(".choice").forEach(c => c.classList.toggle("selected", c.dataset.treatment === "contextual"));
    $("customLabel").hidden = true;
    show("booth");
    $("cameraMessage").textContent = "Väntar på en kreativ människa.";
    speak("Sessionen rensad. Fantasisystemen återgår till vänteläge.");
  }

  $("startButton").addEventListener("click", async () => {
    state.apiKey = $("apiKey").value.trim();
    state.demo = !state.apiKey;
    state.eventName = $("eventName").value.trim() || "VIBE Testsession";
    $("apiKey").value = "";
    show("booth");
    await startCamera();
  });

  $("demoButton").addEventListener("click", async () => {
    state.apiKey = "";
    state.demo = true;
    show("booth");
    await startCamera();
  });

  $("beginButton").addEventListener("click", () => {
    speak(`${greeting()} Berätta vilket foto du vill ha. Jag hjälper dig att välja scen och hur den påverkar dig.`);
    setTimeout(() => show("scene"), 1800);
  });

  document.querySelectorAll(".choice").forEach(button => {
    button.addEventListener("click", () => {
      state.treatment = button.dataset.treatment;
      document.querySelectorAll(".choice").forEach(c => c.classList.toggle("selected", c === button));
      $("customLabel").hidden = state.treatment !== "custom";
    });
  });

  $("voicePromptButton").addEventListener("click", startSpeechInput);
  $("reviewButton").addEventListener("click", () => {
    const summary = buildSummary();
    $("sceneSummary").textContent = summary;
    show("review");
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(summary + " Ska jag fortsätta?");
      u.lang = SPEECH_LANG;
      if (swedishVoice) u.voice = swedishVoice;
      speechSynthesis.speak(u);
    }
  });
  $("editButton").addEventListener("click", () => show("scene"));
  $("captureButton").addEventListener("click", countdownAndCapture);
  $("downloadButton").addEventListener("click", () => {
    const canvas = $("resultCanvas");
    const link = document.createElement("a");
    link.download = `vibe-foto-${Date.now()}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", .92);
    link.click();
  });
  $("generateButton").addEventListener("click", generateAI);

  document.querySelectorAll(".homeButton").forEach(b => b.addEventListener("click", resetGuest));

  $("operatorButton").addEventListener("click", () => {
    $("keyStatus").textContent = state.apiKey
      ? `API-nyckel aktiv för denna sidsession · slutar på ${state.apiKey.slice(-4)}`
      : "Ingen API-nyckel aktiv · gränssnittsdemoläge";
    $("operatorDialog").showModal();
  });
  $("closeOperator").addEventListener("click", () => $("operatorDialog").close());
  $("resetButton").addEventListener("click", () => {
    $("operatorDialog").close();
    resetGuest();
  });

  window.addEventListener("beforeunload", () => {
    state.apiKey = "";
    stopCamera();
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(console.error);
  }
})();
