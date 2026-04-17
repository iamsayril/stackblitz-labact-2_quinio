const API = "/products";
const $ = id => document.getElementById(id);

// RENDER
function renderList(data) {
  const list = $("list");
  list.innerHTML = "";

  if (!data.length) {
    list.innerHTML = "<li>No products found</li>";
    return;
  }

  data.forEach(p => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>
        <b>${p.name}</b> | ${p.category} | ₱${p.price} | Stock: ${p.stock}
      </span>
      <span>
        <button onclick="editProduct(${p.id})">Edit</button>
        <button onclick="deleteProduct(${p.id})">Delete</button>
      </span>
    `;

    list.appendChild(li);
  });
}

// LOAD
async function loadProducts() {
  const res = await fetch(API);
  renderList(await res.json());
}

// SEARCH
async function searchProduct() {
  const q = $("searchInput").value;
  if (!q) return alert("Enter product name");

  const res = await fetch(`/search?name=${encodeURIComponent(q)}`);
  renderList(await res.json());
}

// ADD
async function addProduct() {
  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: $("name").value,
      category: $("category").value,
      price: +$("price").value,
      stock: +$("stock").value
    })
  });

  loadProducts();
}

// DELETE
async function deleteProduct(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadProducts();
}

// EDIT
async function editProduct(id) {
  const data = {
    name: prompt("New name:"),
    category: prompt("New category:"),
    price: +prompt("New price:"),
    stock: +prompt("New stock:")
  };

  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  loadProducts();
}