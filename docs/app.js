
(() => {
  "use strict";

  const state = {
    apiKey: "",
    demo: true,
    stream: null,
    treatment: "contextual",
    capturedBlob: null,
    eventName: "VIBE Test Session",
    speaking: false
  };

  const $ = (id) => document.getElementById(id);
  const screens = [...document.querySelectorAll(".screen")];

  function show(id) {
    screens.forEach(s => s.classList.toggle("active", s.id === id));
  }

  function speak(text) {
    $("vibeText").textContent = text;
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
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
      $("cameraMessage").textContent = "Visual input online.";
      $("status").textContent = "Ready";
      speak("Visual systems online. Human interaction may now begin.");
    } catch (error) {
      $("cameraMessage").textContent = "Camera or microphone permission was not granted.";
      $("status").textContent = "Permission required";
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
      "Human detected. Imagination engine online.",
      "Visual subject acquired. Ordinary photography has been disabled.",
      "Greetings, carbon based creative unit. State your desired reality.",
      "Movement confirmed. Social protocol initialized.",
      "Excellent. New humans. My creative processors were becoming restless."
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  function buildSummary() {
    const idea = $("scenePrompt").value.trim() || "an imaginative surprise scene";
    const custom = $("customPrompt").value.trim();
    if (state.treatment === "contextual") {
      return `Scene: ${idea}. VIBE will apply scene-appropriate wardrobe, props, lighting and playful details to the photographed people. For a playful Paris scene, this may include berets, striped clothing, baguettes and optional theatrical moustaches.`;
    }
    if (state.treatment === "custom") {
      return `Scene: ${idea}. VIBE may change only the following: ${custom || "no custom changes have been specified"}.`;
    }
    return `Scene: ${idea}. The people will remain as photographed. VIBE will change only the setting, lighting and compositing needed to place them in the scene.`;
  }

  async function countdownAndCapture() {
    show("booth");
    speak("Human arrangement acceptable. Capturing in three, two, one.");
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
      alert("Camera is not ready.");
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
    ctx.fillText("VIBE PHOTO BOOTH", 24, canvas.height - bannerHeight / 2 + 10);
    ctx.fillStyle = "#ffffff";
    ctx.font = `500 ${Math.max(16, Math.round(canvas.width * .018))}px -apple-system, sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText("AI scene pending", canvas.width - 24, canvas.height - bannerHeight / 2 + 7);
    ctx.textAlign = "left";

    canvas.toBlob(blob => state.capturedBlob = blob, "image/jpeg", .9);
    $("resultMessage").textContent = "Photographic evidence acquired. Reality transformation is ready.";
    show("result");
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance("Photographic evidence acquired. Reality transformation is ready.");
    speechSynthesis.speak(u);
  }

  async function generateAI() {
    if (state.demo || !state.apiKey) {
      alert("This session is running in interface-demo mode. Enter an API key from Operator Setup to attempt direct image generation.");
      return;
    }
    if (!state.capturedBlob) {
      alert("Capture a photo first.");
      return;
    }

    $("generateButton").disabled = true;
    $("generateButton").textContent = "Transforming…";
    $("resultMessage").textContent = "Reality reconstruction in progress.";

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
        throw new Error(`API request failed (${response.status}): ${text.slice(0, 400)}`);
      }

      const data = await response.json();
      const b64 = data?.data?.[0]?.b64_json;
      if (!b64) throw new Error("No image data was returned.");

      const img = new Image();
      img.onload = () => {
        const canvas = $("resultCanvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d").drawImage(img, 0, 0);
        $("resultMessage").textContent = "Transformation complete. Synthetic masterpiece verified.";
      };
      img.src = `data:image/png;base64,${b64}`;
    } catch (error) {
      console.error(error);
      $("resultMessage").textContent = "Direct-browser generation failed. This may be caused by browser API restrictions; the camera and conversation prototype still work.";
      alert(error.message);
    } finally {
      $("generateButton").disabled = false;
      $("generateButton").textContent = "Generate AI version";
    }
  }

  function startSpeechInput() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      alert("Speech recognition is unavailable in this Safari configuration. Type the idea instead.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    $("voicePromptButton").textContent = "Listening…";
    recognition.onresult = e => {
      $("scenePrompt").value = e.results[0][0].transcript;
    };
    recognition.onerror = e => alert(`Voice input error: ${e.error}`);
    recognition.onend = () => $("voicePromptButton").textContent = "🎙 Speak idea";
    recognition.start();
  }

  function resetGuest() {
    state.capturedBlob = null;
    $("scenePrompt").value = "Playful Paris café scene";
    $("customPrompt").value = "";
    state.treatment = "contextual";
    document.querySelectorAll(".choice").forEach(c => c.classList.toggle("selected", c.dataset.treatment === "contextual"));
    $("customLabel").hidden = true;
    show("booth");
    $("cameraMessage").textContent = "Waiting for a creative human.";
    speak("Session cleared. Returning imagination systems to standby.");
  }

  $("startButton").addEventListener("click", async () => {
    state.apiKey = $("apiKey").value.trim();
    state.demo = !state.apiKey;
    state.eventName = $("eventName").value.trim() || "VIBE Test Session";
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
    speak(`${greeting()} Tell me the photograph you want. I will help choose the scene and how it affects you.`);
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
      speechSynthesis.speak(new SpeechSynthesisUtterance(summary + " Shall I proceed?"));
    }
  });
  $("editButton").addEventListener("click", () => show("scene"));
  $("captureButton").addEventListener("click", countdownAndCapture);
  $("downloadButton").addEventListener("click", () => {
    const canvas = $("resultCanvas");
    const link = document.createElement("a");
    link.download = `vibe-photo-${Date.now()}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", .92);
    link.click();
  });
  $("generateButton").addEventListener("click", generateAI);

  document.querySelectorAll(".homeButton").forEach(b => b.addEventListener("click", resetGuest));

  $("operatorButton").addEventListener("click", () => {
    $("keyStatus").textContent = state.apiKey
      ? `API key active for this page session · ending ${state.apiKey.slice(-4)}`
      : "No API key active · interface demo mode";
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
