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

    if (!isGetCardY(e)) {
      card.style.transform = `translate(-50%, ${offsetY + cardY}px)`;
    } else {
      card.style.transform = `translate(-50%, 400px)`;
    }
  }
}

function isGetCardY(e) {
  const cardY = e.pageY - mouseY;
  return cardY >= 400 ? true : false;
}
