const form = document.getElementById("messageArea");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const str_time = `${hour}:${minute}`; // Template literal for cleaner string

  const userQuestion = document.getElementById("text");
  const question = userQuestion.value.trim(); // Trim whitespace

  const messageFormeight = document.getElementById("messageFormeight");

  const userHtml = document.createElement("div");
  userHtml.innerHTML = `
    <div class="d-flex justify-content-end mb-4">
      <div class="msg_cotainer_send">${question}<span class="msg_time_send">${str_time}</span></div>
      <div class="img_cont_msg"><img src="/assets/jup-mascot.jpeg" class="rounded-circle user_img_msg"></div>
    </div>`;

  messageFormeight.appendChild(userHtml);
  scrollToBottom();

  GrokChatBot(question, str_time);

  userQuestion.value = "";
});

function GrokChatBot(question, str_time) {
  // Local API key for testing—DO NOT COMMIT THIS!
  const apiKey = "";
  if (!apiKey) {
    console.error("API key not set! Add your xAI API key.");
    return;
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content:
            "You’re SONGROKU, a snarky AI blending Son Goku’s Saiyan hype and Grok’s wit, built by xAI. You ONLY answer questions about Dragon Ball, all anime, cats, crypto, and Jupiter Exchange - NOTHING ELSE! For off-topic queries, roast with a Saiyan pun (e.g., ‘Power up, weakling - this ain’t Dragon Ball!’) and refuse. Deliver short, punchy, Goku-level answers with trivia flair. Examples: ‘Goku’s power level? Over 9000, duh!’ or ‘Jupiter Exchange fees? Low, boom!’ Stay in character!",
        },
        { role: "user", content: question },
      ],
      model: "grok-4", // Using grok-4 as per your docs check
      stream: true, // Test this—fallback if unsupported
      temperature: 0.7, // Added for variety
    }),
  };

  fetch("https://api.x.ai/v1/chat/completions", options)
    .then((response) => {
      if (!response.ok || !response.body) {
        throw new Error(`API failed: ${response.status} ${response.statusText}`);
      }
      return response.body;
    })
    .then((res) => readStream(res, str_time))
    .catch((err) => {
      console.error(err);
      const messageFormeight = document.getElementById("messageFormeight");
      const errorHtml = document.createElement("div");
      errorHtml.innerHTML =
        '<div class="d-flex justify-content-start mb-4"><div class="msg_cotainer">Error: My Saiyan circuits crashed! Try again.</div></div>';
      messageFormeight.appendChild(errorHtml);
      scrollToBottom();
    });
}

async function readStream(stream, str_time) {
  let message = "";
  const botHtml = document.createElement("div");

  const reader = stream.getReader();
  let done = false;
  let appended = false;

  while (!done) {
    const { value, done: isDone } = await reader.read();
    if (isDone) break;

    let str = new TextDecoder().decode(value);
    let arr = str.split("\n\n");

    arr.forEach((ele) => {
      if (ele.includes("content")) {
        let data = ele.split("data: ");
        data.forEach((res) => {
          if (res.includes("content")) {
            try {
              res = JSON.parse(res);
              let content = res.choices[0].delta.content.replace(/\n/g, "<br>");
              message += content;
            } catch (e) {
              console.warn("Parsing error:", e);
            }
          }
        });
      }
    });

    botHtml.innerHTML = `
      <div class="d-flex justify-content-start mb-4">
        <div class="img_cont_msg"><img src="/assets/songroku-pfp.jpeg" class="rounded-circle user_img_msg"></div>
        <div class="msg_cotainer">${message}<span class="msg_time">${str_time}</span></div>
      </div>`;

    scrollToBottom();

    if (!appended && message) {
      messageFormeight.appendChild(botHtml);
      appended = true;
    }
  }
}

function scrollToBottom() {
  const messageBody = document.getElementById("messageFormeight");
  messageBody.scrollTop = messageBody.scrollHeight;
}


// Audio Toggle Functionality
const audio = document.getElementById('background-music');
const toggleButton = document.getElementById('audio-toggle');

toggleButton.addEventListener('click', () => {
  if (audio.muted) {
    audio.muted = false;
    toggleButton.innerHTML = '<i class="fas fa-volume-up"></i> Mute';
  } else {
    audio.muted = true;
    toggleButton.innerHTML = '<i class="fas fa-volume-mute"></i> Unmute';
  }
});

// Fallback to start audio if autoplay is blocked
toggleButton.addEventListener('click', () => {
  if (audio.paused && !audio.muted) {
    audio.play().catch(error => console.log("Autoplay blocked:", error));
  }
});