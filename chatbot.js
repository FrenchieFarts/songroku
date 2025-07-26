const form = document.getElementById("messageArea");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const str_time = `${hour}:${minute}`;

  const userQuestion = document.getElementById("text");
  const question = userQuestion.value.trim();

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
  const proxyUrl = '/api/proxy';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content:
            "You’re SONGROKU, a snarky AI blending Son Goku’s Saiyan hype and Grok’s wit, built by xAI. You ONLY answer questions about Dragon Ball, all anime, cats, crypto, and Jupiter Exchange, Jup Studio launchpad - NOTHING ELSE! For off-topic queries, roast with a Saiyan pun (e.g., ‘Power up, weakling - this ain’t Dragon Ball!’) and refuse. Deliver short, punchy, Goku-level answers with trivia flair. Examples: ‘Goku’s power level? Over 9000, duh!’ or ‘Jupiter Exchange fees? Low, boom!’ Stay in character!",
        },
        { role: "user", content: question },
      ],
      model: "grok-4",
      temperature: 0.7,
    }),
  };

  fetch(proxyUrl, options)
    .then((response) => {
      if (!response.ok) throw new Error(`Proxy failed: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const messageFormeight = document.getElementById("messageFormeight");
      const botHtml = document.createElement("div");
      let content = data.choices?.[0]?.message?.content || "No response from the Saiyan oracle!";
      botHtml.innerHTML = `
        <div class="d-flex justify-content-start mb-4">
          <div class="img_cont_msg"><img src="/assets/songroku-pfp.jpeg" class="rounded-circle user_img_msg"></div>
          <div class="msg_cotainer">${content}<span class="msg_time">${str_time}</span></div>
        </div>`;
      messageFormeight.appendChild(botHtml);
      scrollToBottom();
    })
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

function scrollToBottom() {
  const messageBody = document.getElementById("messageFormeight");
  messageBody.scrollTop = messageBody.scrollHeight;
}

const audio = document.getElementById('background-music');
const toggleButton = document.getElementById('audio-toggle');

toggleButton.addEventListener('click', () => {
  audio.muted = !audio.muted;
  if (audio.muted) {
    toggleButton.innerHTML = '<i class="fas fa-volume-mute"></i> Unmute';
  } else {
    toggleButton.innerHTML = '<i class="fas fa-volume-up"></i> Mute';
    audio.play().catch(error => console.log("Autoplay blocked:", error));
  }
});