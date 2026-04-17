
// ================= LOAD PRODUCTS =================
async function loadProducts() {
  const res = await fetch('http://localhost:3000/products');
  const data = await res.json();

  const list = document.getElementById('list');
  list.innerHTML = '';

  if (data.length === 0) {
    list.innerHTML = "<li>No products found</li>";
    return;
  }

  data.forEach((p) => {
    const li = document.createElement('li');

    li.textContent =
      `NAME: ${p.name} | CATEGORY: ${p.category} | PRICE: ${p.price} | STOCK: ${p.stock}`;

    // buttons container
    const btnEdit = document.createElement('button');
    btnEdit.textContent = "Edit";
    btnEdit.onclick = () => editProduct(p.id);

    const btnDelete = document.createElement('button');
    btnDelete.textContent = "Delete";
    btnDelete.onclick = () => deleteProduct(p.id);

    li.appendChild(document.createElement('br'));
    li.appendChild(btnEdit);
    li.appendChild(btnDelete);

    list.appendChild(li);
  });
}


// ================= ADD PRODUCT =================
async function addProduct() {
  const name = document.getElementById('name').value;
  const category = document.getElementById('category').value;
  const price = document.getElementById('price').value;
  const stock = document.getElementById('stock').value;

  const res = await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, category, price, stock })
  });

  const data = await res.json();
  console.log(data);

  loadProducts();
}


// ================= DELETE PRODUCT =================
async function deleteProduct(id) {
  await fetch(`http://localhost:3000/products/${id}`, {
    method: 'DELETE'
  });

  loadProducts();
}


// ================= EDIT PRODUCT =================
async function editProduct(id) {
  const name = prompt("New name:");
  const category = prompt("New category:");
  const price = prompt("New price:");
  const stock = prompt("New stock:");

  await fetch(`http://localhost:3000/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, category, price, stock })
  });

  loadProducts();
}


// ================= SEARCH PRODUCT =================
async function searchProduct() {
  const name = document.getElementById('searchInput').value;

  if (!name) {
    alert("Enter product name");
    return;
  }

  const res = await fetch(`http://localhost:3000/search?name=${name}`);
  const data = await res.json();

  const list = document.getElementById('list');
  list.innerHTML = '';

  data.forEach((p) => {
    const li = document.createElement('li');

    li.textContent =
      `NAME: ${p.name} | CATEGORY: ${p.category} | PRICE: ${p.price} | STOCK: ${p.stock}`;

    list.appendChild(li);
  });
}