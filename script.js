// screen.lockOrientation("landscape");

const CLIENT_WIDTH = document.body.clientWidth;
const BASIC_ELEMENT_LENGTH = 8; // 1 rem
const CARD_HEIGHT = BASIC_ELEMENT_LENGTH * 55;
const CARD_WIDTH = BASIC_ELEMENT_LENGTH * 35;

const drawer = document.querySelector("[data-drawer]");
const card = document.querySelector("[data-card-wrapper]");
const quotation = document.querySelector("[data-quotation]");
const author = document.querySelector("[data-author]");

let mouseY = 0;
let touchY = 0;
let isDown = false;
let getCardTransform; // translateY

// set getCardTransform
if (CLIENT_WIDTH <= 414) getCardTransform = 0.6;
else getCardTransform = 0.9;
const scaleRatio = CLIENT_WIDTH / CARD_WIDTH;
const getCardY = CARD_HEIGHT * getCardTransform;

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

startInteraction();

function startInteraction(e) {
  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("touchend", handleTouchEnd);
}

function stopInteraction() {
  document.removeEventListener("transitionend", handleMouseDown);
  document.removeEventListener("animationend", handleMouseUp);
  document.removeEventListener("transitionend", handleTouchStart);
  document.removeEventListener("animationend", handleTouchEnd);
}

function handleMouseDown(e) {
  if (!e.target.matches("[data-card]")) return;
  isDown = true;
  mouseY = e.pageY;
  document.addEventListener("mousemove", handleMouseMove);
}

function handleTouchStart(e) {
  if (!e.target.matches("[data-card]")) return;
  isDown = true;
  touchY = e.changedTouches[0].pageY;
  document.addEventListener("touchmove", handleTouchMove);
}

function handleMouseMove(e) {
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
      setCustomProperty(card, "transform", "translate(-50%, 100%)");
      setCustomProperty(card, "filter", "brightness(1)");
    }
  }
}

function handleTouchMove(e) {
  if (isDown) {
    let pageY = e.changedTouches[0].pageY;
    const cardY = pageY - touchY;
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
      if (CLIENT_WIDTH <= 414) {
        setCustomProperty(card, "transform", "translate(-50%, 60%)");
      } else {
        setCustomProperty(card, "filter", "brightness(1)");
      }
    }
  }
}

function handleMouseUp(e) {
  const target = e.target;
  if (isDown) {
    // 點擊卡片時觸發
    if (!isGetCardY(e)) {
      // 未到取卡位置
      card.classList.add("card-return");
      setCustomProperty(card, "transform", "translateX(-50%)");
      card.addEventListener("transitionend", () => {
        setCustomProperty(card, "filter", `brightness(0.4)`);
        card.classList.remove("card-return");
      });
      document.removeEventListener("transitionend", handleMouseMove);
    } else {
      // 取得卡片
      document.removeEventListener("transitionend", handleMouseMove);
      setCustomProperty(
        card,
        "transform",
        "translate(-50%, 100%) rotate3d(0, 1, 0, 1800deg)"
      );
      card.classList.add("card-get"); // 得到卡片動畫(3s)開始
      let img = new Image();
      img.src = getBackgroundImage();
      setTimeout(() => {
        // 1.3 秒後向 api 發送請求取得 quotation
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
      }, 1300);
    }
  }
  isDown = false;
  stopInteraction();
}

function handleTouchEnd(e) {
  const target = e.target;
  if (isDown) {
    // 點擊卡片時觸發
    if (!isGetCardY(e)) {
      // 未到取卡位置
      card.classList.add("card-return");
      setCustomProperty(card, "transform", "translate(-50%, 0px)");
      setTimeout(() => {
        setCustomProperty(card, "filter", `brightness(0.4)`);
        card.classList.remove("card-return");
      }, 900);
    } else {
      // 取得卡片
      setCustomProperty(
        card,
        "transform",
        "translate(-50%, 60%) rotate3d(0, 1, 0, 1800deg)"
      );
      card.classList.add("card-get"); // 得到卡片動畫(3s)開始
      let img = new Image();
      img.src = getBackgroundImage();
      setTimeout(() => {
        drawer.classList.add("hide");
        // 1.3 秒後向 api 發送請求取得 quotation
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
  // document.removeEventListener("mousemove", move);
  stopInteraction();
}

function isMobileDevice() {
  const mobileDevice = [
    "Android",
    "webOS",
    "iPhone",
    "iPad",
    "iPod",
    "BlackBerry",
    "Windows Phone",
  ];
  let isMobileDevice = mobileDevice.some((e) => navigator.userAgent.match(e));
  return isMobileDevice;
}

function isGetCardY(e) {
  if (!isMobileDevice()) {
    const cardY = e.pageY - mouseY;
    return cardY >= getCardY ? true : false;
  } else {
    let pageY = e.changedTouches[0].pageY;
    const cardY = pageY - touchY;
    return cardY >= getCardY ? true : false;
  }
}

function getBackgroundImage() {
  const randomBg = backgroundImageData[Math.floor(Math.random() * 9)];
  return randomBg;
}

function setCustomProperty(elem, prop, value) {
  elem.style.setProperty(prop, value);
}
