const form = document.getElementById("form"),
  formBtn = document.querySelector(".btn"),
  itemInput = document.getElementById("item-input"),
  shoppingItems = document.querySelector(".shopping-items"),
  filter = document.querySelector(".filter-item"),
  clearBtn = document.querySelector(".clear-btn");

let editMode = false;

function onSubmit(e) {
  const formData = new FormData(form).get("item"),
    itemFromLS = getItemFromLS(),
    isDuplicate = itemFromLS.includes(itemInput.value);


  if (!formData) {
    alert("please input an item");
    return;
  }

  if (editMode) {
    const itemToEdit = shoppingItems.querySelector(".edit-mode");

    deleteItem(itemToEdit.parentElement);
    editMode = false;
  } else {
    if (isDuplicate) {
      alert("Item Already Exits")
      return
    }
  }

  addItemToLS(formData);
  displayItemFromLS();

  itemInput.value = "";
  checkUI();
  e.preventDefault();
}

function createItem(item) {
  const li = document.createElement("li"),
    span = document.createElement("span"),
    cancelIcon = document.createElement("i");

  li.className = "item";
  cancelIcon.className = "bx bx-x";
  span.appendChild(document.createTextNode(item));
  li.appendChild(span);
  li.appendChild(cancelIcon);

  return li;
}

function onClickItem(e) {
  if (e.target.className === "bx bx-x") {
    deleteItem(e.target.parentElement);
  } else {
    if (e.target.tagName !== "SPAN") return;
    isEditMode(e.target);
  }
}

function isEditMode(item) {
  editMode = true;
  item.classList.add("edit-mode");
  formBtn.innerHTML = "<i class='bx bxs-edit-alt'></i> Update Item";
  formBtn.style.backgroundColor = "#228B22";
  itemInput.value = item.textContent;
}

function deleteItem(item) {
  item.remove();
  deleteItemFromLS(item.firstElementChild.textContent);
  checkUI();
}

function deleteItemFromLS(item) {
  let itemFromLS = getItemFromLS();
  itemFromLS = itemFromLS.filter((i) => i !== item);

  localStorage.setItem("items", JSON.stringify(itemFromLS));
}

function filterItems(e) {
  let characters = e.target.value,
    items = document.querySelectorAll(".item");

  items.forEach((item) => {
    const itemName = item.textContent;

    if (itemName.toLowerCase().includes(characters.toLowerCase())) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function addItemToLS(item) {
  let itemToLocalStorage = getItemFromLS();

  itemToLocalStorage.push(item);
  localStorage.setItem("items", JSON.stringify(itemToLocalStorage));
}
function displayItemFromLS() {
  const itemToLocalStorage = getItemFromLS();
  shoppingItems.innerHTML = "";
  itemToLocalStorage.forEach((item) =>
    shoppingItems.appendChild(createItem(item))
  );
  checkUI();
}

function getItemFromLS() {
  let itemToLocalStorage;

  if (localStorage.getItem("items") === null) {
    itemToLocalStorage = [];
  } else {
    itemToLocalStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemToLocalStorage;
}

function clearItems() {
  while (shoppingItems.firstElementChild) {
    shoppingItems.firstElementChild.remove();
  }

  let itemFromLS = getItemFromLS()
  itemFromLS = itemFromLS.splice(1, itemFromLS.length)
  localStorage.setItem("items", JSON.stringify(itemFromLS))

  checkUI();
}

function checkUI() {
  if (!document.querySelectorAll(".item").length) {
    filter.style.display = "none";
    clearBtn.style.display = "none";
  } else {
    filter.style.display = "block";
    clearBtn.style.display = "block";
  }

  formBtn.innerHTML = "<i class='bx bx-plus'></i> Add Item";
  formBtn.style.backgroundColor = "#000";
}

(function () {
  document.addEventListener("DOMContentLoaded", displayItemFromLS);
  form.addEventListener("submit", onSubmit);
  filter.addEventListener("input", filterItems);
  shoppingItems.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearItems);
  checkUI();
})();
