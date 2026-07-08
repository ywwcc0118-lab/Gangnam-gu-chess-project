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

// 공지 API URL
const NOTICE_API_URL="https://script.google.com/macros/s/AKfycbwSLSHgC4OfUcj4-z-3AdQGLY5qEnrtlTDyFnbzY3qRJgxwWqZ8zlGlxRK1CyWvB-ip/exec"

let noticeData = [];

const NOTICES_PER_PAGE = 8;

function renderNoticeBoard(notices, page = 1) {
  const container =
    document.querySelector("#notice-list");

  const pagination =
    document.querySelector("#notice-pagination");

  if (!container) return;

  if (notices.length === 0) {
    container.innerHTML = `
      <p class="notice-empty">
        등록된 공지사항이 없습니다.
      </p>
    `;

    if (pagination) {
      pagination.innerHTML = "";
    }

    return;
  }

  const totalPages = Math.ceil(
    notices.length / NOTICES_PER_PAGE
  );

  const safePage = Math.min(
    Math.max(page, 1),
    totalPages
  );

  const startIndex =
    (safePage - 1) * NOTICES_PER_PAGE;

  const noticesForPage = notices.slice(
    startIndex,
    startIndex + NOTICES_PER_PAGE
  );

  container.innerHTML = `
    <div class="notice-board-header">
      <span>분류</span>
      <span>제목</span>
      <span>날짜</span>
    </div>

    ${noticesForPage
      .map(createNoticeListItem)
      .join("")}
  `;

  renderPagination(
    pagination,
    totalPages,
    safePage
  );
}

// 공지 불러오기
async function loadNotices() {
  const container = document.querySelector("#notice-list");

  // 공지 영역이 없는 페이지에서는 실행하지 않음
  if (!container) return;

  container.innerHTML = `
    <p class="notice-loading">
      공지사항을 불러오는 중입니다.
    </p>
  `;

  try {
    const response = await fetch(NOTICE_API_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(
        result.message || "공지 데이터를 불러오지 못했습니다."
      );
    }

    // 여기서 최신 날짜순으로 정렬
    noticeData = [...result.notices].sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();

      const safeATime =
        Number.isNaN(aTime) ? -Infinity : aTime;

      const safeBTime =
        Number.isNaN(bTime) ? -Infinity : bTime;

      return safeBTime - safeATime;
    });

    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";

    const isHomePage =
      currentPage === "index.html" ||
      currentPage === "";

    if (isHomePage) {
      // 메인 페이지: 최신 4개 카드
      renderNotices(container, noticeData.slice(0, 4));
    } else {
      // 전체 공지 페이지: 게시판 목록
      renderNoticeBoard(noticeData, 1);
    }
  } catch (error) {
    console.error("공지사항 로딩 실패:", error);

    container.innerHTML = `
      <p class="notice-error">
        공지사항을 불러오지 못했습니다.
        잠시 후 다시 시도해 주세요.
      </p>
    `;
  }
}

function createNoticeListItem(notice) { // 공지 제목 클릭 -> 채널로 연결
  const externalUrl =
    String(notice.externalUrl ?? "").trim();

  const titleHtml = externalUrl
    ? `
      <a
        href="${escapeHtml(externalUrl)}"
        target="_blank"
        rel="noopener noreferrer"
        class="notice-board-title"
      >
        ${escapeHtml(notice.title)}
      </a>
    `
    : `
      <span class="notice-board-title disabled">
        ${escapeHtml(notice.title)}
      </span>
    `;

  return `
    <article class="notice-board-item">
      <span class="notice-board-category">
        ${escapeHtml(notice.category)}
      </span>

      <div class="notice-board-content">
        ${titleHtml}

        <p>
          ${escapeHtml(notice.summary)}
        </p>
      </div>

      <time class="notice-board-date">
        ${formatDate(notice.date)}
      </time>
    </article>
  `;
}

function renderPagination( // 페이지 번호 함수
  container,
  totalPages,
  currentPage
) {
  if (!container || totalPages <= 1) {
    if (container) {
      container.innerHTML = "";
    }

    return;
  }

  let paginationHtml = "";

  if (currentPage > 1) {
    paginationHtml += `
      <button
        type="button"
        class="pagination-button"
        data-page="${currentPage - 1}"
      >
        이전
      </button>
    `;
  }

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    paginationHtml += `
      <button
        type="button"
        class="pagination-button ${
          page === currentPage ? "active" : ""
        }"
        data-page="${page}"
        aria-current="${
          page === currentPage ? "page" : "false"
        }"
      >
        ${page}
      </button>
    `;
  }

  if (currentPage < totalPages) {
    paginationHtml += `
      <button
        type="button"
        class="pagination-button"
        data-page="${currentPage + 1}"
      >
        다음
      </button>
    `;
  }

  container.innerHTML = paginationHtml;
}

function renderNotices(container, notices) {
  if (notices.length === 0) {
    container.innerHTML = `
      <p class="notice-empty">
        등록된 공지사항이 없습니다.
      </p>
    `;
    return;
  }

  container.innerHTML = notices
    .map(createNoticeCard)
    .join("");
}

function createNoticeCard(notice) {
  const highlightClass =
    notice.important === true ? " highlight" : "";

  const externalUrl =
    String(notice.externalUrl ?? "").trim();

  const imageUrl =
    String(notice.imageUrl ?? "").trim();

  const imageHtml = imageUrl
    ? `
      <img
        src="${escapeHtml(imageUrl)}"
        alt="${escapeHtml(notice.title)} 관련 이미지"
        class="notice-card-image"
        loading="lazy"
      />
    `
    : "";

  const detailLink = externalUrl
    ? `
      <a
        href="${escapeHtml(externalUrl)}"
        class="notice-detail-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        자세히 보기
      </a>
    `
    : `
      <span class="notice-link-disabled">
        링크 준비 중
      </span>
    `;

  return `
    <article class="notice-card${highlightClass}">
      ${imageHtml}

      <div class="notice-card-body">
        <span class="notice-tag">
          ${escapeHtml(notice.category)}
        </span>

        <h3>${escapeHtml(notice.title)}</h3>

        <p>${escapeHtml(notice.summary)}</p>

        <div class="notice-meta">
          <span>${formatDate(notice.date)}</span>
          ${detailLink}
        </div>
      </div>
    </article>
  `;
}

function formatDate(dateValue) {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue)
      .split("T")[0]
      .replaceAll("-", ".");
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  })
    .format(date)
    .replaceAll(". ", ".")
    .replace(/\.$/, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getSafeExternalUrl(value) {
  const url = String(value ?? "").trim();

  if (!url) return "";

  try {
    const parsedUrl = new URL(url);

    // http 또는 https 주소만 허용
    if (
      parsedUrl.protocol !== "http:" &&
      parsedUrl.protocol !== "https:"
    ) {
      return "";
    }

    return parsedUrl.href;
  } catch {
    return "";
  }
}

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
        const targetId = link.getAttribute("href");

        if (!targetId || !targetId.startsWith("#")) return;

        const targetElement =
          document.querySelector(targetId);

        if (!targetElement) return;

        event.preventDefault();

        const headerHeight =
          header ? header.offsetHeight : 0;

        const targetTop =
          targetElement.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          12;

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
    // 트랙패드에서 이미 가로로 움직이는 경우는
    // 브라우저 기본 동작에 맡김
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }

    const maxScrollLeft =
      noticeScroll.scrollWidth - noticeScroll.clientWidth;

    // 카드가 영역보다 작아서 가로 스크롤이 필요 없는 경우
    if (maxScrollLeft <= 1) {
      return;
    }

    const isScrollingRight = event.deltaY > 0;
    const isScrollingLeft = event.deltaY < 0;

    const isAtStart = noticeScroll.scrollLeft <= 0;
    const isAtEnd =
      noticeScroll.scrollLeft >= maxScrollLeft - 1;

    // 오른쪽으로 더 이동할 수 있는지
    const canScrollRight =
      isScrollingRight && !isAtEnd;

    // 왼쪽으로 더 이동할 수 있는지
    const canScrollLeft =
      isScrollingLeft && !isAtStart;

    // 실제로 가로 이동할 수 있을 때만
    // 페이지의 세로 스크롤을 막음
    if (canScrollRight || canScrollLeft) {
      event.preventDefault();

      noticeScroll.scrollLeft += event.deltaY;
    }
  },
  {
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

const pagination =
  document.querySelector("#notice-pagination");

if (pagination) {
  pagination.addEventListener(
    "click",
    (event) => {
      const button = event.target.closest(
        "[data-page]"
      );

      if (!button) return;

      const page = Number(
        button.dataset.page
      );

      if (!Number.isInteger(page)) return;

      renderNoticeBoard(noticeData, page);

      const board =
        document.querySelector("#notice-list");

      if (board) {
        const headerHeight =
          header ? header.offsetHeight : 0;

        const targetTop =
          board.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          24;

        window.scrollTo({
          top: targetTop,
          behavior: "smooth",
        });
      }
    }
  );
}

  // 공지사항은 한 번만 불러오기
  loadNotices();
});