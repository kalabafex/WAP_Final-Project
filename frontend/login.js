"use strict";

window.onload = checkAuthorization;

const formLogin = document.querySelector("#form-login");

const backend_url = "http://localhost:3000";
const frontend_url = "http://localhost:5500";

formLogin.addEventListener("submit", (event) => {
  event.preventDefault();

  const user = {
    username: event.target.username.value,
    password: event.target.password.value,
  };

  login(user);
});

function checkAuthorization() {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken !== null) {
    location.href = `${frontend_url}/product.html`;
  }
}

async function login(user) {
  const settings = {
    method: "POST",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" },
  };

  const response = await (await fetch(`${backend_url}/login`, settings)).json();

  if (response.error) {
    const loginError = document.getElementById("loginError");
    loginError.innerText = response.message;
    loginError.classList.remove("hidden");
    return;
  }

  const data = response.data;
  sessionStorage.setItem("accessToken", data.token);
  location.href = `${frontend_url}/product.html`;
}
