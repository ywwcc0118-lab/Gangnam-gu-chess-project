// =========================
// Gangnam Chess Federation
// script.js
// =========================
//
// 이 파일에서 하는 일:
// 1. 메뉴 클릭하면 해당 섹션으로 부드럽게 이동
// 2. 스크롤 위치에 따라 현재 보고 있는 메뉴에 active 표시
// 3. 공지 카드 영역을 마우스 휠로 가로 스크롤 가능하게 만들기
// 4. 공지 카드 영역을 마우스로 드래그해서 움직일 수 있게 만들기
// 5. 페이지를 내리면 Header에 그림자 효과 추가
//

// HTML 문서가 다 로딩된 후 JavaScript 실행
document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 필요한 HTML 요소 가져오기
  // =========================

  // 상단 헤더
  const header = document.querySelector(".header");

  // Header 안에 있는 메뉴 링크들
  const navLinks = document.querySelectorAll(".nav a");

  // id가 있는 모든 section 가져오기
  // 예: #notice, #about, #elite, #youth, #benefits
  const sections = document.querySelectorAll("section[id]");

  // 공지 가로 스크롤 영역
  const noticeScroll = document.querySelector(".notice-scroll");

  // =========================
  // 1. 메뉴 클릭 시 부드럽게 이동
  // =========================
  //
  // 기본 a 태그는 바로 순간이동하듯 이동함.
  // 여기서는 클릭하면 부드럽게 스크롤되도록 바꿈.
  //
  // 예:
  // 공지 메뉴 클릭 → #notice 섹션으로 이동
  // 소개 메뉴 클릭 → #about 섹션으로 이동
  //

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      // 클릭한 메뉴의 href 값 가져오기
      // 예: "#notice", "#about"
      const targetId = link.getAttribute("href");

      // href가 없거나 #으로 시작하지 않으면 무시
      if (!targetId || !targetId.startsWith("#")) return;

      // 이동할 실제 섹션 찾기
      const targetElement = document.querySelector(targetId);

      // 해당 섹션이 없으면 무시
      if (!targetElement) return;

      // 기본 이동 동작 막기
      event.preventDefault();

      // sticky header 때문에 섹션 제목이 header에 가려질 수 있음
      // 그래서 header 높이만큼 위쪽 여백을 빼줌
      const headerHeight = header ? header.offsetHeight : 0;

      // 이동할 위치 계산
      const targetTop =
        targetElement.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        12;

      // 계산한 위치로 부드럽게 이동
      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    });
  });

  // =========================
  // 2. 스크롤 위치에 따라 현재 메뉴 active 표시
  // =========================
  //
  // 사용자가 공지 섹션을 보고 있으면 공지 메뉴에 active 클래스 추가.
  // 소개 섹션을 보고 있으면 소개 메뉴에 active 클래스 추가.
  //
  // CSS에서 .nav a.active 스타일을 줬기 때문에
  // 현재 위치가 메뉴에 표시됨.
  //

  function updateActiveNav() {
    // 현재 스크롤 위치
    // +140을 하는 이유:
    // 헤더 높이와 여백 때문에 실제 보이는 위치 기준을 조금 아래로 잡기 위해서
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      // 현재 스크롤 위치가 이 섹션 범위 안에 있으면
      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        // 모든 메뉴에서 active 제거
        navLinks.forEach((link) => {
          link.classList.remove("active");

          // 현재 섹션 id와 메뉴 href가 같으면 active 추가
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  // 스크롤할 때마다 현재 메뉴 업데이트
  window.addEventListener("scroll", updateActiveNav);

  // 페이지 처음 열렸을 때도 한 번 실행
  updateActiveNav();

  // =========================
  // 3. 공지 영역 마우스 휠 가로 스크롤
  // =========================
  //
  // 보통 마우스 휠을 내리면 세로로 내려감.
  // 그런데 공지 카드 영역 위에서는
  // 휠을 내렸을 때 카드들이 옆으로 움직이게 만듦.
  //
  // 즉:
  // 마우스 휠 아래로 → 공지 카드 오른쪽으로 이동
  // 마우스 휠 위로 → 공지 카드 왼쪽으로 이동
  //

  if (noticeScroll) {
    noticeScroll.addEventListener(
      "wheel",
      (event) => {
        // 세로 휠 움직임이 가로 움직임보다 클 때만 실행
        // 트랙패드에서 대각선 움직임이 이상하게 먹히는 걸 막기 위함
        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
          // 기본 세로 스크롤 막기
          event.preventDefault();

          // 세로 휠 움직임을 가로 스크롤 값으로 바꿔줌
          noticeScroll.scrollLeft += event.deltaY;
        }
      },
      {
        // preventDefault를 쓰려면 passive를 false로 해야 함
        passive: false,
      }
    );

    // =========================
    // 4. 공지 영역 마우스 드래그 스크롤
    // =========================
    //
    // 공지 카드를 마우스로 잡고 옆으로 끌 수 있게 만듦.
    //
    // 동작 방식:
    // 1. 마우스를 누른 순간 위치 저장
    // 2. 마우스를 움직이면 이동 거리 계산
    // 3. 그 거리만큼 noticeScroll.scrollLeft 변경
    // 4. 마우스를 떼면 드래그 종료
    //

    let isDragging = false; // 현재 드래그 중인지 확인
    let startX = 0; // 처음 마우스를 누른 X 좌표
    let scrollLeft = 0; // 드래그 시작 당시의 스크롤 위치

    // 마우스를 눌렀을 때 드래그 시작
    noticeScroll.addEventListener("mousedown", (event) => {
      isDragging = true;

      // CSS에서 드래그 중 스타일을 주고 싶으면 사용 가능
      noticeScroll.classList.add("dragging");

      // 공지 영역 기준으로 마우스 X 위치 저장
      startX = event.pageX - noticeScroll.offsetLeft;

      // 현재 가로 스크롤 위치 저장
      scrollLeft = noticeScroll.scrollLeft;
    });

    // 마우스가 공지 영역 밖으로 나가면 드래그 종료
    noticeScroll.addEventListener("mouseleave", () => {
      isDragging = false;
      noticeScroll.classList.remove("dragging");
    });

    // 마우스를 떼면 드래그 종료
    noticeScroll.addEventListener("mouseup", () => {
      isDragging = false;
      noticeScroll.classList.remove("dragging");
    });

    // 마우스를 움직일 때 실제 가로 스크롤 처리
    noticeScroll.addEventListener("mousemove", (event) => {
      // 드래그 중이 아니면 아무것도 안 함
      if (!isDragging) return;

      // 기본 텍스트 선택 같은 동작 방지
      event.preventDefault();

      // 현재 마우스 X 위치
      const x = event.pageX - noticeScroll.offsetLeft;

      // 처음 위치에서 얼마나 움직였는지 계산
      // 1.4를 곱해서 드래그 속도를 살짝 빠르게 만듦
      const walk = (x - startX) * 1.4;

      // 계산한 거리만큼 가로 스크롤 이동
      noticeScroll.scrollLeft = scrollLeft - walk;
    });
  }

  // =========================
  // 5. 스크롤 시 Header 그림자 효과
  // =========================
  //
  // 페이지 맨 위에서는 header가 깔끔하게 보이고,
  // 조금이라도 아래로 스크롤하면 그림자를 추가해서
  // header가 떠 있는 느낌을 줌.
  //
  // CSS에 .header.scrolled 스타일이 있어야 작동함.
  //

  function toggleHeaderShadow() {
    if (!header) return;

    // 20px 이상 내려가면 scrolled 클래스 추가
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  // 스크롤할 때마다 header 그림자 상태 확인
  window.addEventListener("scroll", toggleHeaderShadow);

  // 페이지 처음 열렸을 때도 한 번 실행
  toggleHeaderShadow();
});