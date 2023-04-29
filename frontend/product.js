"use strict";

window.onload = checkAuthorization;

const formLogin = document.querySelector("#form-login");

const backend_url = "http://localhost:3000";
const frontend_url = "http://localhost:5500";

async function getProducts() {
  const settings = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  };
  const response = await (
    await fetch(`${backend_url}/products`, settings)
  ).json();

  const data = response.data;

  document.querySelector("#table__product-list").innerHTML = "";

  for (let product of data) {
    addProductRow(product);
  }

  addSelectorOnCart();
  initializeTooltip();
}

async function getShoppingCart() {
  const settings = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  };

  const response = await (
    await fetch(`${backend_url}/user/shopping-cart`, settings)
  ).json();
  const data = response.data;
  if (data.length > 0) {
    desplayShoppingCartTable();
  }

  addShoppingCartRow(data);
}

function checkAuthorization() {
  const accessToken = sessionStorage.getItem("accessToken");
  if (accessToken === null) {
    location.href = `${frontend_url}/login.html`;
  }
  document.getElementById("username").innerText = accessToken.split("-")[1];

  getProducts();
  getShoppingCart();
}
function addSelectorOnCart() {
  $("button.shopping-cart-btn").on("click", function () {
    addProductCart($(this).attr("product-id"));
  });
}

function addSelectorOnShoppingCartActions() {
  $(".btn-minus").on("click", function () {
    reduceProductCart($(this).attr("product-id"));
  });

  $(".btn-plus").on("click", function () {
    addProductCart($(this).attr("product-id"));
  });

  $(".input-quantity").on("change", function () {
    addProductCart($(this).attr("product-id"), $(this).val());
  });

  $("#place-order").on("click", function () {
    placeOrder();
  });
}

function desplayShoppingCartTable() {
  document.querySelector("#noItem__shopping-cart").classList.add("hidden");
  document.querySelector("#table__shopping-cart").classList.remove("hidden");
}

function hideShoppingCartTable() {
  document.querySelector("#table__shopping-cart").classList.add("hidden");
  document.querySelector("#noItem__shopping-cart").classList.remove("hidden");
}

async function reduceProductCart(id) {
  id = new Number(id);

  const settings = {
    method: "POST",
    body: JSON.stringify({ productId: id }),
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
  };

  const response = await (
    await fetch(`${backend_url}/user/shopping-cart/reduce`, settings)
  ).json();

  if (response.data.length == 0) hideShoppingCartTable();

  addShoppingCartRow(response.data);
}

async function addProductCart(id, quantity) {
  id = new Number(id);
  const product = {
    productId: id,
  };
  if (quantity) product.quantity = quantity;

  const settings = {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
  };

  const response = await (
    await fetch(`${backend_url}/user/shopping-cart`, settings)
  ).json();

  desplayShoppingCartTable();
  addShoppingCartRow(response.data);
}

async function placeOrder() {
  const settings = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
  };

  const response = await (
    await fetch(`${backend_url}/user/shopping-cart/place-order`, settings)
  ).json();

  hideShoppingCartTable();
  getProducts();
}

function addShoppingCartRow(products) {
  const tableShoppingCartList = document.querySelector(
    ".table__shopping-cart-list"
  );
  tableShoppingCartList.innerHTML = "";
  let total = 0;
  for (let product of products) {
    total += product.price * product.quantity;

    tableShoppingCartList.innerHTML += `
      <tr>
        <th scope="row" class="text-center">${product.name}</th>
        <td class="text-center">${product.price}</td>
        <td class="text-center">${(product.price * product.quantity).toFixed(
          2
        )}</td>
        <td class="text-center">
          <button product-id="${product.id}" class="btn btn-bg btn-minus">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="minus-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
            </svg>
          </button>
          <input product-id="${
            product.id
          }" type="number" class="form-control-sm input-quantity" value="${
      product.quantity
    }">
          <button product-id="${product.id}" class="btn btn-bg btn-plus">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="plus-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </td>
      </tr>
    `;
  }

  tableShoppingCartList.innerHTML += `
    <tr class="total">
      <th colspan="4" class="text-right">Total: ${total.toFixed(2)}</th>
    </tr>
  `;

  addSelectorOnShoppingCartActions();
}

function addProductRow(product) {
  const tableProductList = document.querySelector("#table__product-list");
  const row = `
  <tr>
    <th class="text-center">${product.name}</th>
    <td class="text-center">${product.price}</td>
    <td class="text-center">
      <img src="${backend_url}/${product.image}" alt="${product.name}" class="img-thumbnail" width="50">
    </td>
    <td class="text-center">${product.quantity}</td>
    <td class="text-center">
      <button product-id="${product.id}" class="btn btn-bg shopping-cart-btn" 
        title="Add to cart">Add To Cart
      </button>
    </td>
  </tr>
  `;

  tableProductList.innerHTML += row;
}

function logout() {
  sessionStorage.removeItem("accessToken");
  location.href = `${frontend_url}/login.html`;
}

document.querySelector("#logout").addEventListener("click", function () {
  logout();
});

function initializeTooltip() {
  $('[data-toggle="tooltip"]').tooltip();
}
