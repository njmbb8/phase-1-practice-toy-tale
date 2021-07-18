let addToy = false;
let highID = 0;
function newCard(name, image, likes, id) {
  const card = document.createElement('div');
  const head = document.createElement('h2');
  const pic = document.createElement('img');
  const likesNode = document.createElement('p');
  const button = document.createElement('button');

  card.classList.add('card');
  head.textContent = name;
  pic.setAttribute('src', image);
  pic.classList.add('toy-avatar');
  likesNode.textContent = likes;
  button.classList.add("like-btn");
  button.setAttribute('id', id);
  button.textContent = "Like <3"
  card.appendChild(head);
  card.appendChild(pic);
  card.appendChild(likesNode);
  card.appendChild(button);

  document.getElementById('toy-collection').appendChild(card);

  highID = id;
}
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch("http://localhost:3000/toys")
  .then((req) => req.json())
  .then(function(data){
    data.map(function(toy){
      newCard(toy.name, toy.image, toy.likes, toy.id);
    })
  })

  document.addEventListener('submit', function(e){
    e.preventDefault();
    const newName = document.getElementsByName('name')[0].value;
    const newURL = document.getElementsByName('image')[0].value;
    const context = {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name: newName,
        image: newURL,
        likes: 0
      })
    }
    fetch('http://localhost:3000/toys', context)
    .then(function(data){
      newCard(newName, newURL, 0, highID+=1);
    })
  })

  document.addEventListener('click', function(e){
    if(e.target.classList.contains('like-btn')){
      const newLikes = ++e.target.parentElement.children[2].textContent;
      const fetchContext = {
        method: 'PATCH',
        headers:{
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body:JSON.stringify({
          'likes': newLikes
        })
      }
      fetch(`http://localhost:3000/toys/${e.target.id}`, fetchContext)
      .then(function(ret) {
        e.target.parentElement.children[2].textContent = newLikes;
      })
      .catch(function(error) {
        console.log(error);
      })
    }
  })
});
