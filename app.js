// creating variables
const showList = document.querySelector("#show-list");
const form = document.querySelector("#add-show-form");

// create element and render HTML
function renderShow(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let rating = document.createElement("span");
  let cross = document.createElement("div");

  li.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  rating.textContent = doc.data().rating;
  cross.textContent = "x";

  li.appendChild(name);
  li.appendChild(rating);
  li.appendChild(cross);

  showList.appendChild(li);

  // deleting data from firestore
  cross.addEventListener("click", e => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    firestore
      .collection("show")
      .doc(id)
      .delete();
  });
}

// retrieve real-time data from firestore
firestore
  .collection("show")
  .orderBy("rating")
  .onSnapshot(querySnapshot => {
    let changes = querySnapshot.docChanges();
    changes.forEach(change => {
      if (change.type == "added") {
        renderShow(change.doc);
      } else if (change.type == "removed") {
        let li = showList.querySelector("[data-id=" + change.doc.id + "]");
        showList.removeChild(li);
      }
    });
  });

// saving data to firestore
form.addEventListener("submit", e => {
  e.preventDefault();
  firestore.collection("show").add({
    name: form.name.value,
    rating: form.rating.value
  });
  form.name.value = "";
  form.rating.value = "";
});
