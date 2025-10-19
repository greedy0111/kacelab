const pageContainer = document.querySelector(".container");

const scroller = new LocomotiveScroll({
  el: pageContainer,
  smooth: true,
});

document.addEventListener("DOMContentLoaded", function () {
  function ScrollUpdateDelay() {
    setTimeout(function () {
      scroller.update();
    }, 1000);
  }
  ScrollUpdateDelay();
});
(function () {
  // AOS
  AOS.init({
    duration: 800,
    // disable: 'tablet',
  });

  function addAnimate() {
    const ms1 = document.querySelector(".ms1");
    ms1.classList.add("animate");
  }

  setTimeout(addAnimate, 500);

  const logoImages = [
    document.getElementById("logoImg1"),
    document.getElementById("logoImg2"),
  ];

  document.querySelector(".h__logo").addEventListener("mouseover", () => {
    logoImages.forEach((img) => {
      //배열의 요소 순서대로 값을 갖는다.
      img.dataset.originalSrc = img.src;
      img.src = "images/logo2.png";
    });
  });

  document.querySelector(".h__logo").addEventListener("mouseout", () => {
    logoImages.forEach((img) => {
      img.src = img.dataset.originalSrc;
    });
  });

  const menuButton = document.querySelector(".menu__linebox");
  const navBox = document.querySelector(".nav__box");

  menuButton.addEventListener("click", () => {
    if (menuButton.classList.contains("open")) {
      menuButton.classList.remove("open");
      navBox.classList.remove("open");
    } else {
      menuButton.classList.add("open");
      navBox.classList.add("open");
    }
  });

  const topRightBottom = document.querySelector(
    ".ms2 .top__right__item.bottom"
  );
  topRightBottom.addEventListener("mouseover", () => {
    topRightBottom.classList.add("hover");
  });
  topRightBottom.addEventListener("mouseleave", () => {
    topRightBottom.classList.remove(
      "hover",
      "hover1",
      "hover2",
      "hover3",
      "hover4"
    );
  });
  const items = document.querySelectorAll(".top__right__item .item");
  items.forEach((item, index) => {
    item.addEventListener("mouseover", () => {
      const hoverClass = topRightBottom.classList.contains("hover");
      if (hoverClass) {
        topRightBottom.classList.add(`hover${index}`);
        item.classList.add("on");
      }
    });
    item.addEventListener("mouseleave", () => {
      topRightBottom.classList.remove(`hover${index}`);
      item.classList.remove("on");
    });
  });

  const typedTextSpan = document.querySelector(".typing_effect");
  const textArray = typedTextSpan.getAttribute("data-text").split(",");
  const typingDelay = 60; // 타이핑 속도
  const erasingDelay = 30; // 지우기 속도
  const newTextDelay = 1000; // 다음 텍스트로 전환하는 속도
  let textArrayIndex = 0;
  let charIndex = 0;

  function typeText() {
    if (charIndex < textArray[textArrayIndex].length) {
      typedTextSpan.textContent = textArray[textArrayIndex].substring(
        0,
        charIndex + 1
      );
      charIndex++;

      setTimeout(typeText, typingDelay);
    } else {
      setTimeout(eraseText, newTextDelay);
    }
  }

  function eraseText() {
    if (charIndex > 0) {
      typedTextSpan.textContent = textArray[textArrayIndex].slice(
        0,
        --charIndex
      );
      setTimeout(eraseText, erasingDelay);
    } else {
      textArrayIndex = (textArrayIndex + 1) % textArray.length;
      setTimeout(typeText, typingDelay + 1000);
    }
  }

  setTimeout(typeText, newTextDelay + 250);
})();
