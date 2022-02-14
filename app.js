import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js";

const card = document.querySelector(".card");
const quotation = document.querySelector(".quotation");
const author = document.querySelector(".author");
const getCardY = 350;
// const backgroundImageData = ["top-view-spring-daisies-gerberas.jpeg"];
const backgroundImageData = [
  "https://image.freepik.com/free-vector/hand-drawn-linear-engraved-floral-background_52683-71224.jpg",
  "https://image.freepik.com/free-photo/green-leaves-white-background_53876-88575.jpg",
  "https://image.freepik.com/free-photo/top-view-arrangement-cornflowers_23-2148615244.jpg",
  "https://image.freepik.com/free-photo/flat-lay-spring-gerbera-flowers-with-daisies-leaves_23-2148894246.jpg",
  "https://image.freepik.com/free-photo/top-view-spring-daisy-with-petals_23-2148894194.jpg",
  "https://image.freepik.com/free-photo/flat-lay-yellow-daisies_23-2148615336.jpg",
  "https://image.freepik.com/free-photo/beautiful-cherry-blossom_181624-634.jpg",
  "https://image.freepik.com/free-photo/beautiful-cherry_1182-1029.jpg",
  "https://image.freepik.com/free-photo/beautiful-cherry-blossom_181624-668.jpg",
];

let mouseY = 0;
let isDown = false;

card.addEventListener("mousedown", (e) => {
  isDown = true;
  mouseY = e.pageY;
  document.addEventListener("mousemove", move);
});

function move(e) {
  if (isDown) {
    const cardY = e.pageY - mouseY;

    if (!isGetCardY(e)) {
      if (cardY < 0) {
        setCustomProperty(card, "transform", `translate(-50%, 0px)`);
        setCustomProperty(card, "filter", `brightness(0.4)`);
      } else {
        setCustomProperty(card, "transform", `translate(-50%, ${cardY}px)`);
        setCustomProperty(
          card,
          "filter",
          `brightness(${(cardY / getCardY) * 0.6 + 0.4})`
        );
      }
    } else {
      setCustomProperty(card, "transform", "translate(-50%, 350px)");
      setCustomProperty(card, "filter", "brightness(1)");
    }
  }
}

document.addEventListener("mouseup", (e) => {
  const target = e.target;
  if (isDown) {
    if (!isGetCardY(e)) {
      card.classList.add("card-return");
      setCustomProperty(card, "transform", "translate(-50%, 0px)");
      setTimeout(() => {
        setCustomProperty(card, "filter", `brightness(0.4)`);
        card.classList.remove("card-return");
      }, 900);
    } else {
      setCustomProperty(
        card,
        "transform",
        "translate(-50%, 350px) rotate3d(0, 1, 0, 1800deg)"
      );
      card.classList.add("card-get");
      // card.style.background = `url(${getBackgroundImage()})`;
      let img = new Image();
      img.src = getBackgroundImage();
      setTimeout(() => {
        card.style.backgroundImage = `url("${img.src}")`;
        axios
          .get("https://type.fit/api/quotes")
          .then(function (response) {
            const quotations = response.data;
            let i = Math.floor(Math.random() * 1642);
            const text = quotations[i].text;
            if (quotations[i].author !== null) {
              const authorName = quotations[i].author;
              quotation.innerHTML = `${text}
          <div class="bottom-line"></div>
          <div class="author">${authorName}</div>`;
            } else {
              const authorName = "Unknown";
              quotation.innerHTML = `${text}
          <div class="bottom-line"></div>
          <div class="author">${authorName}</div>`;
            }
          })
          .catch(function (error) {
            console.log(error);
          });
        card.classList.toggle("back");
      }, 1500);
    }
  }
  isDown = false;
  document.removeEventListener("mousemove", move);
});

function isGetCardY(e) {
  const cardY = e.pageY - mouseY;
  return cardY >= getCardY ? true : false;
}

function getBackgroundImage() {
  const randomBg = backgroundImageData[Math.floor(Math.random() * 9)];
  return randomBg;
}
