import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js";

const card = document.querySelector(".card");
const getCardY = 400;
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
      setCustomProperty(card, "transform", "translate(-50%, 400px)");
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
      }, 1000);
    } else {
      setCustomProperty(
        card,
        "transform",
        "translate(-50%, 400px) rotate3d(0, 1, 0, 1800deg)"
      );
      card.classList.add("card-get");
    }
  }
  isDown = false;
  document.removeEventListener("mousemove", move);
});

function isGetCardY(e) {
  const cardY = e.pageY - mouseY;
  return cardY >= getCardY ? true : false;
}
