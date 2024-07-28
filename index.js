"use strict";

const inputEl = document.querySelector(".input-chat");
const btnEl = document.querySelector(".fa-paper-plane");
const cardBodyEl = document.querySelector(".card-body");
let userMessage;
const API_KEY = "your-api-key-here"; // Replace with your actual API key
const URL = "https://api.openai.com/v1/chat/completions";

const chatGenerator = (robot) => {
  const requestOption = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    }),
  };

  fetch(URL, requestOption)
    .then((res) => res.json())
    .then((data) => {
      console.log("API Response:", data);
      if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
        robot.querySelector(".robot").textContent = data.choices[0].message.content;
      } else {
        robot.querySelector(".robot").textContent = "Error: Invalid response from API";
      }
    })
    .catch((error) => {
      robot.querySelector(".robot").textContent = "Error: " + error.message;
    });
};

// Manage chat
function manageChat() {
  userMessage = inputEl.value.trim();
  if (!userMessage) return;
  inputEl.value = "";
  cardBodyEl.appendChild(messageEl(userMessage, "user"));
  setTimeout(() => {
    const robotMessage = messageEl("Thinking...", "chat-bot");
    cardBodyEl.append(robotMessage);
    chatGenerator(robotMessage);
  }, 600);
}

// Create message element
const messageEl = (message, className) => {
  const chatEl = document.createElement("div");
  chatEl.classList.add("chat", className);
  let chatContent =
    className === "chat-bot"
      ? `<span class="user-icon"><i class="fa fa-robot"></i></span>
         <p class='robot'>${message}</p>`
      : `<span class="user-icon"><i class="fa fa-user"></i></span>
         <p>${message}</p>`;
  chatEl.innerHTML = chatContent;
  return chatEl;
};

btnEl.addEventListener("click", manageChat);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    manageChat();
  }
});
