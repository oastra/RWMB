// Replace Text In Header

const checkReplace = document.querySelector(".replace-me");

if (checkReplace !== null) {
  const replace = new ReplaceMe(checkReplace, {
    animation: "animated fadeIn",
    speed: 2000,
    separator: ",",
    loopCount: "infinite",
    autoRun: true,
  });
}

// User Scroll For Navbar
function userScroll() {
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("bg-dark");
      navbar.classList.add("border-bottom");
      navbar.classList.add("border-secondary");
      navbar.classList.add("navbar-sticky");
    } else {
      navbar.classList.remove("bg-dark");
      navbar.classList.remove("border-bottom");
      navbar.classList.remove("border-secondary");
      navbar.classList.remove("navbar-sticky");
    }
  });
}

document.addEventListener("DOMContentLoaded", userScroll);

// Video Modal
const videoBtn = document.querySelector(".video-btn");
const videoModal = document.querySelector("#videoModal");
const video = document.querySelector("#video");
let videoSrc;

if (videoBtn !== null) {
  videoBtn.addEventListener("click", () => {
    videoSrc = videoBtn.getAttribute("data-bs-src");
  });
}

if (videoModal !== null) {
  videoModal.addEventListener("shown.bs.modal", () => {
    video.setAttribute(
      "src",
      videoSrc + "?autoplay=1;modestbranding=1;showInfo=0"
    );
  });

  videoModal.addEventListener("hide.bs.modal", () => {
    video.setAttribute("src", videoSrc);
  });
}

// Function to send message to the proxy server
async function sendMessage() {
  const userInput = document.getElementById("userInput").value;
  const messages = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: userInput },
  ];

  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 150,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    const chatbox = document.getElementById("chatbox");
    chatbox.innerText = data.choices[0].message.content;
  } else {
    console.error("Failed to fetch the response");
  }
}

// Newsletter validation

document.querySelectorAll(".submit-newsletter").forEach((button) => {
  button.addEventListener("click", async function () {
    const form = button.closest(".newsletter-form");
    const emailInput = form.querySelector(".newsletter-email");
    const errorMessage = form.querySelector(".error-message");
    const successMessage = form.querySelector(".success-message");
    const emailValue = emailInput.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailValue)) {
      errorMessage.style.display = "block";
      successMessage.style.display = "none";
      return;
    }

    errorMessage.style.display = "none";

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailValue }),
      });

      const result = await response.json();

      if (result.success) {
        successMessage.style.display = "block";
        errorMessage.style.display = "none";
      } else {
        errorMessage.style.display = "block";
        errorMessage.textContent =
          result.message || "Subscription failed. Please try again.";
        successMessage.style.display = "none";
      }
    } catch (error) {
      console.error("Error:", error);
      errorMessage.style.display = "block";
      errorMessage.textContent = "Subscription failed. Please try again.";
      successMessage.style.display = "none";
    }
  });
});
