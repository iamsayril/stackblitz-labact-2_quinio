// ================= LOAD PRODUCTS =================
async function loadProducts() {
  try {
    const res = await fetch('http://localhost:3000/products');

    if (!res.ok) throw new Error("Failed to fetch products");

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

      // Edit button
      const btnEdit = document.createElement('button');
      btnEdit.textContent = "Edit";
      btnEdit.onclick = () => editProduct(p.id);

      // Delete button
      const btnDelete = document.createElement('button');
      btnDelete.textContent = "Delete";
      btnDelete.onclick = () => deleteProduct(p.id);

      li.appendChild(document.createElement('br'));
      li.appendChild(btnEdit);
      li.appendChild(btnDelete);

      list.appendChild(li);
    });

  } catch (err) {
    console.error(err);
  }
}


// ================= ADD PRODUCT =================
async function addProduct() {
  try {
    const name = document.getElementById('name').value.trim();
    const category = document.getElementById('category').value.trim();
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;

    // validation
    if (!name || !category || !price || !stock) {
      alert("Please fill all fields");
      return;
    }

    const res = await fetch('http://localhost:3000/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        category,
        price: Number(price),
        stock: Number(stock)
      })
    });

    if (!res.ok) throw new Error("Failed to add product");

    await res.json(); // wait for backend

    await loadProducts(); // ✅ ensures refresh AFTER saving

    // clear inputs
    document.getElementById('name').value = '';
    document.getElementById('category').value = '';
    document.getElementById('price').value = '';
    document.getElementById('stock').value = '';

  } catch (err) {
    console.error(err);
  }
}


// ================= DELETE PRODUCT =================
async function deleteProduct(id) {
  try {
    await fetch(`http://localhost:3000/products/${id}`, {
      method: 'DELETE'
    });

    await loadProducts();

  } catch (err) {
    console.error(err);
  }
}


// ================= EDIT PRODUCT =================
async function editProduct(id) {
  try {
    const name = prompt("New name:");
    const category = prompt("New category:");
    const price = prompt("New price:");
    const stock = prompt("New stock:");

    if (!name || !category || !price || !stock) {
      alert("All fields required");
      return;
    }

    await fetch(`http://localhost:3000/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        category,
        price: Number(price),
        stock: Number(stock)
      })
    });

    await loadProducts();

  } catch (err) {
    console.error(err);
  }
}


// ================= SEARCH PRODUCT =================
async function searchProduct() {
  try {
    const name = document.getElementById('searchInput').value.trim();

    if (!name) {
      alert("Enter product name");
      return;
    }

    const res = await fetch(`http://localhost:3000/search?name=${name}`);

    if (!res.ok) throw new Error("Search failed");

    const data = await res.json();

    const list = document.getElementById('list');
    list.innerHTML = '';

    if (data.length === 0) {
      list.innerHTML = "<li>No results found</li>";
      return;
    }

    data.forEach((p) => {
      const li = document.createElement('li');

      li.textContent =
        `NAME: ${p.name} | CATEGORY: ${p.category} | PRICE: ${p.price} | STOCK: ${p.stock}`;

      list.appendChild(li);
    });

  } catch (err) {
    console.error(err);
  }
}