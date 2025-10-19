document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // ScrollTrigger와 LocomotiveScroll 연동
  ScrollTrigger.scrollerProxy(pageContainer, {
    scrollTop(value) {
      return arguments.length
        ? scroller.scrollTo(value, 0, 0)
        : scroller.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: pageContainer.style.transform ? "transform" : "fixed",
  });

  scroller.on("scroll", ScrollTrigger.update);
});
window.onload = () => {
  gsap.set(".ms1 .ms1__videoWrap", { width: 0 });

  gsap.to(".ms1 .ms1__videoWrap", {
    scrollTrigger: {
      trigger: "#ms1__pin",
      scroller: pageContainer,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      pin: true,
    },
    // width: "calc(100% - 8rem)", // 목표 너비
    width: "calc((100% - 8rem) / 2)",
    ease: "power2.inOut",
  });
  function checkScreenWidth() {
    if (window.matchMedia("(max-width: 1024px)").matches) {
      // 1024px 미만일 때 실행할 코드
      //
      gsap.to(".ms1 .ms1__videoWrap", {
        scrollTrigger: {
          trigger: "#ms1__pin",
          scroller: pageContainer,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          pin: true,
        },
        width: "calc(100% - 8rem)", // 목표 너비
        // width: "calc((100% - 8rem) / 2)",
        ease: "power2.inOut",
      });
      console.log("The screen width is less than 1024px");
      // 추가로 실행할 코드 작성
    } else {
      gsap.to(".ms1 .ms1__videoWrap", {
        scrollTrigger: {
          trigger: "#ms1__pin",
          scroller: pageContainer,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          pin: true,
        },
        width: "calc((100% - 8rem) / 2)",
        ease: "power2.inOut",
      });
    }
  }

  // 페이지 로드 시 확인
  checkScreenWidth();

  // 윈도우 크기 조정 시에도 확인 (반응형)
  window.addEventListener("resize", checkScreenWidth);

  let ms3_pinWrap = document.querySelector(".ms3_pin .pin__wrap");
  let ms3_pinWrapWidth = ms3_pinWrap.offsetWidth;
  let ms3_ScrollLength = ms3_pinWrapWidth - window.innerWidth;

  gsap.to(".ms3_pin .pin__wrap", {
    scrollTrigger: {
      scroller: pageContainer, // locomotive-scroll을 위한 스크롤러 설정
      scrub: true, // 스크롤과 애니메이션을 동기화하여 자연스럽게 애니메이션함
      trigger: "#ms3_pin", // 애니메이션을 트리거할 엘리먼트
      pin: true, // 트리거가 시작될 때 해당 섹션을 고정
      start: "top top", // 트리거 시작 지점을 설정 (상단에서 시작)
      end: () => `+=${ms3_ScrollLength + window.innerWidth}`, // 트리거 끝 지점 설정
      onUpdate: () => {
        // pin_wrap의 x 변화에 따라 ms3_txtbox의 위치를 조정합니다.
        gsap.set(".ms3_pin .ms3__txt_box", {
          x: -gsap.getProperty(".ms3_pin .pin__wrap", "x")
        });
      }
    },
    x: -ms3_ScrollLength, // pin_wrap을 왼쪽으로 이동
    ease: "none" // Ease 효과를 없앰 (직선 이동)
  });
};
(function () {
  setInterval(updateDateTime, 1000);

  const videoWrapper = document.querySelector("#ms2__videobox");
  const video = document.querySelector("#ms2__video");

  videoWrapper.addEventListener("mouseenter", () => {
    video.play();
  });

  videoWrapper.addEventListener("mouseleave", () => {
    video.pause();
    // video.currentTime = 0;
  });
})();

function updateDateTime() {
  const dt = luxon.DateTime.now();

  const week = dt.toFormat("EEE");
  const day = dt.toFormat("dd");
  const hours = dt.toFormat("HH");
  const minutes = dt.toFormat("mm");

  const weekEl = document.querySelector(".day_of_week");
  const dayEl = document.querySelector(".day_of_month");
  const hoursEl = document.querySelector(".time__h");
  const minutesEl = document.querySelector(".time__m");

  weekEl.textContent = week;
  dayEl.textContent = day;
  hoursEl.textContent = hours;
  minutesEl.textContent = minutes;
}

class Marquee {
  constructor({ el }) {
    this.el = el;
    this.animations = [];
    this.SLOWDOWN_RATE = 0.2;
    this.maxPlaybackRate = 3;
    this.cloneMarqueeGroup();
    this.initAnimations();
    this.initEvents();
  }

  // 애니메이션 초기화
  initAnimations() {
    const { duration = 10, reverse = false } = this.el.dataset;

    this.animations = this.marqueeGroups.map((group) =>
      group.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(-100%)" }],
        {
          duration: duration * 3000,
          direction: reverse ? "reverse" : "normal",
          iterations: Infinity,
        }
      )
    );
  }

  // 속도 조절
  setAnimationSpeed(playbackRate) {
    this.animations.forEach((anim) => (anim.playbackRate = playbackRate));
  }

  // 마우스 및 스크롤 이벤트 초기화
  initEvents() {
    this.el.addEventListener("mouseenter", () =>
      this.setAnimationSpeed(this.SLOWDOWN_RATE)
    );
    this.el.addEventListener("mouseleave", () => this.setAnimationSpeed(1));

    if (this.el.classList.contains("ms3_marquee")) {
      let lastScrollY = window.scrollY;
      window.addEventListener("scroll", () => {
        const scrollSpeed = Math.abs(window.scrollY - lastScrollY);
        lastScrollY = window.scrollY;
        this.adjustAnimationSpeed(scrollSpeed);
      });
    }
  }

  // 스크롤 속도에 따라 애니메이션 속도 조정
  adjustAnimationSpeed(scrollSpeed) {
    const playbackRate = Math.min(
      1 + (scrollSpeed / 1000) * (this.maxPlaybackRate - 1),
      this.maxPlaybackRate
    );
    this.setAnimationSpeed(playbackRate);
  }

  // 마퀴 그룹 복제
  cloneMarqueeGroup() {
    const clone = this.el.querySelector(".marquee__group").cloneNode(true);
    clone.classList.add("clone");
    this.el.append(clone);
    this.marqueeGroups = Array.from(
      this.el.querySelectorAll(".marquee__group")
    );
  }
}

document.querySelectorAll(".marquee").forEach((el) => new Marquee({ el }));
