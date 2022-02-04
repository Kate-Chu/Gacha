let mouseY = 0;
let offsetY = 0;
let isDown = false;
const card = document.querySelector(".card");

card.addEventListener("mousedown", (e) => {
  isDown = true;
  mouseY = e.pageY;
  document.addEventListener("mousemove", move);
});

document.addEventListener("mouseup", (e) => {
  const target = e.target;
  if (isDown) {
    card.classList.add("card-back");
    if (!isGetCardY(e)) {
      card.style.transform = `translate(-50%, 0px)`;
    } else {
      card.style.transform = `translate(-50%, 400px) rotate3d(0, 1, 0, 1800deg);`;
      card.classList.add("card-get");
    }
  }
  isDown = false;
  document.removeEventListener("mousemove", move);
  setTimeout(() => {
    card.classList.remove("card-back"), { once: true };
  }, 1000);
});

function move(e) {
  if (isDown) {
    const cardY = e.pageY - mouseY;
    let brightness = 0.2;

    if (!isGetCardY(e)) {
      card.style.transform = `translate(-50%, ${offsetY + cardY}px)`;
      card.style.filter = `brightness(${(cardY / 400) * 0.8 + brightness})`;
    } else {
      card.style.transform = `translate(-50%, 400px)`;
      card.style.filter = "brightness(1)";
    }
  }
}

function isGetCardY(e) {
  const cardY = e.pageY - mouseY;
  return cardY >= 400 ? true : false;
}
