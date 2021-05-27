let addToy = false;

//declare variables
const toyCollection = document.querySelector('#toy-collection');
const submitBtn = document.querySelector(".submit");

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      toyFormContainer.addEventListener('submit', e=> {
        e.preventDefault()
        addToyHandler(e.target)
        e.target.name.value = "";
        e.target.image.value = "";
      })
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

//fetch toys
//on page lode, make a GET request to fetch toy objects
async function fetchToys(){
  const resp = await fetch("http://localhost:3000/toys");
  const data = await resp.json();
  return createCollection(data);
}

//with response data, make a <div class="card"> for each toy and add it to the toy-collection <div>
function createCollection(data){
   for(let i=0; i<data.length; i++){
    addToyCard(data[i])
  };
};

 /*each card should have (1) an h2 with toy's name, (2) an img with src of toys image att and class of "toy-avatar", 
  (3) a p tag with how many likes that toy has, (4) button tag with a class "like-btn" and an id attr set to toy's id#*/
function addToyCard(toy){
  const toyDiv = document.createElement('div');
  toyDiv.className = "card";

  const toyName = document.createElement('h2');
  toyName.innerText = toy["name"];

  const toyPic = document.createElement('img');
  toyPic.src = toy["image"];
  toyPic.className = "toy-avatar";

  const toyLikes = document.createElement('p');
  toyLikes.innerText = toy["likes"] + " likes";

  const toyBtn = document.createElement('button');
  toyBtn.className = "like-btn";
  toyBtn.id = toy["id"];
  toyBtn.innerText = "like";
  toyBtn.addEventListener('click', likeButtonHandler);

  toyDiv.appendChild(toyName);
  toyDiv.appendChild(toyPic);
  toyDiv.appendChild(toyLikes);
  toyDiv.appendChild(toyBtn);

  toyCollection.appendChild(toyDiv);
}

//on toy form submit, a POST req should be sent to http://localhost:3000/toys and the new toy added
//if successful, the toy should be added to the DOM without reload
function addToyHandler(toyInput){
  const toyData = {
    "name": toyInput.name.value,
    "image": toyInput.image.value,
    "likes": 0
  }

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(toyData)
  })
    .then(resp => resp.json())
    .then((object) => {
      // console.log(object)
      addToyCard(object);
    })
}

//Increase likes
//when user clicks like button a PATCH request should be sent to the server at http://localhost:3000/toys/:id, updating # of likes
//if successful, the likes should update without reload
function likeButtonHandler(e){
  const id = e.target.id;
  const text = e.target.previousSibling.innerText;
  const textArray = text.split(' ');
  const newNum = parseFloat(textArray.slice(0)) + 1;

  fetch(`http://localhost:3000/toys/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": newNum
    })
  })
  .then(resp => resp.json())
  .then(obj => {
    e.target.previousSibling.innerText = `${obj["likes"]} likes`
  })
}


//calls toy fetch
fetchToys();