// =========================
// Gangnam Chess Federation
// script.js
// =========================

// 공지 API URL
const NOTICE_API_URL =
  "https://script.google.com/macros/s/AKfycbwSLSHgC4OfUcj4-z-3AdQGLY5qEnrtlTDyFnbzY3qRJgxwWqZ8zlGlxRK1CyWvB-ip/exec";

// 엘리트 선수단 대회 이력 API URL
const ELITE_RECORD_API_URL =
  "https://script.google.com/macros/s/AKfycbwv24W3Xb30jmXvfOEsu1UQ6EbYpjhvT6OgOQScZhokv7OsXQYNGz-v1noNYJZB-UjH/exec";

let noticeData = [];

const NOTICES_PER_PAGE = 8;

// 카테고리 카드 고정 순서
const ELITE_CATEGORY_ORDER = [
  "Olympiad",
  "Kadet",
  "League",
];

// =========================
// 공지사항 기능
// =========================

function renderNoticeBoard(notices, page = 1) {
  const container = document.querySelector("#notice-list");
  const pagination = document.querySelector("#notice-pagination");

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

  const totalPages = Math.ceil(notices.length / NOTICES_PER_PAGE);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * NOTICES_PER_PAGE;

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

    ${noticesForPage.map(createNoticeListItem).join("")}
  `;

  renderPagination(pagination, totalPages, safePage);
}

async function loadNotices() {
  const container = document.querySelector("#notice-list");

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

    noticeData = [...result.notices].sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();

      const safeATime = Number.isNaN(aTime) ? -Infinity : aTime;
      const safeBTime = Number.isNaN(bTime) ? -Infinity : bTime;

      return safeBTime - safeATime;
    });

    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";

    const isHomePage =
      currentPage === "index.html" ||
      currentPage === "";

    if (isHomePage) {
      renderNotices(container, noticeData.slice(0, 4));
    } else {
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

function createNoticeListItem(notice) {
  const externalUrl = String(notice.externalUrl ?? "").trim();

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

function renderPagination(container, totalPages, currentPage) {
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

  for (let page = 1; page <= totalPages; page++) {
    paginationHtml += `
      <button
        type="button"
        class="pagination-button ${page === currentPage ? "active" : ""}"
        data-page="${page}"
        aria-current="${page === currentPage ? "page" : "false"}"
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

  container.innerHTML = notices.map(createNoticeCard).join("");
}

function createNoticeCard(notice) {
  const highlightClass = notice.important === true ? " highlight" : "";

  const externalUrl = String(notice.externalUrl ?? "").trim();
  const imageUrl = String(notice.imageUrl ?? "").trim();

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

// =========================
// 엘리트 선수단 대회 이력 기능
// =========================

async function loadEliteRecords() {
  const container = document.querySelector("#elite-record-grid");

  if (!container) return;

  container.innerHTML = `
    <p class="notice-loading">
      대회 이력을 불러오는 중입니다.
    </p>
  `;

  try {
    const response = await fetch(ELITE_RECORD_API_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }

    const result = await response.json();

    if (result.success === false) {
      throw new Error(
        result.message || "대회 이력 데이터를 불러오지 못했습니다."
      );
    }

    const records = getEliteRecordsFromResult(result);

    if (records.length === 0) {
      container.innerHTML = `
        <p class="notice-empty">
          등록된 대회 이력이 없습니다.
        </p>
      `;

      return;
    }

    container.innerHTML = renderLatestEliteRecordByCategory(records);
  } catch (error) {
    console.error("대회 이력 로딩 실패:", error);

    container.innerHTML = `
      <p class="notice-error">
        대회 이력을 불러오지 못했습니다.
        잠시 후 다시 시도해 주세요.
      </p>
    `;
  }
}

function getEliteRecordsFromResult(result) {
  let records = [];

  if (Array.isArray(result)) {
    records = result;
  } else if (Array.isArray(result.records)) {
    records = result.records;
  } else if (Array.isArray(result.data)) {
    records = result.data;
  }

  return records
    .map(normalizeEliteRecord)
    .filter((record) => {
      return (
        record.category ||
        record.eventName ||
        record.date ||
        record.location ||
        record.achievement ||
        record.players
      );
    });
}

function normalizeEliteRecord(record) {
  return {
    category:
      normalizeEliteCategory(
        record.category ||
        record.Category ||
        ""
      ),

    eventName:
      record.eventName ||
      record["event name"] ||
      record["Event Name"] ||
      record.event_name ||
      "",

    date:
      record.date ||
      record.Date ||
      "",

    location:
      record.location ||
      record.Location ||
      "",

    achievement:
      record.achievement ||
      record.Achievement ||
      "",

    players:
      record.players ||
      record.Players ||
      "",
  };
}

function normalizeEliteCategory(categoryValue) {
  const category = String(categoryValue).trim().toLowerCase();

  if (category === "olympiad") {
    return "Olympiad";
  }

  if (category === "kadet" || category === "cadet") {
    return "Kadet";
  }

  if (category === "league") {
    return "League";
  }

  return "";
}

// 핵심:
// 카테고리 카드는 고정으로 만들고,
// 각 카테고리 안에서는 날짜가 가장 최신인 대회 1개만 표시함.
function renderLatestEliteRecordByCategory(records) {
  return ELITE_CATEGORY_ORDER
    .map((category) => {
      const latestRecord = records
        .filter((record) => record.category === category)
        .sort((a, b) => {
          const dateA = parseEliteDate(a.date);
          const dateB = parseEliteDate(b.date);

          return dateB - dateA;
        })[0];

      return createEliteCategoryCard(category, latestRecord);
    })
    .join("");
}

function createEliteCategoryCard(category, record) {
  if (!record) {
    return `
      <article class="record-card">
        <h4>${escapeHtml(category)}</h4>

        <ul>
          <li>등록된 대회 이력이 없습니다.</li>
        </ul>
      </article>
    `;
  }

  return `
    <article class="record-card">
      <h4>${escapeHtml(category)}</h4>

      <ul>
        <li>
          <strong>대회:</strong>
          ${escapeHtml(record.eventName)}
        </li>

        <li>
          <strong>날짜:</strong>
          ${escapeHtml(record.date)}
        </li>

        <li>
          <strong>장소:</strong>
          ${escapeHtml(record.location)}
        </li>

        <li>
          <strong>주요 성과:</strong>
          ${escapeHtml(record.achievement)}
        </li>

        <li>
          <strong>대표 선수:</strong>
          ${escapeHtml(record.players)}
        </li>
      </ul>
    </article>
  `;
}

function parseEliteDate(dateValue) {
  if (!dateValue) return 0;

  const dateText = String(dateValue).trim();

  // 2026년 5월 14일 - 5월 19일 형식
  // 2026년 5월 14일 형식
  const koreanDateMatch = dateText.match(
    /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/
  );

  if (koreanDateMatch) {
    const year = koreanDateMatch[1];
    const month = koreanDateMatch[2].padStart(2, "0");
    const day = koreanDateMatch[3].padStart(2, "0");

    return new Date(`${year}-${month}-${day}T00:00:00+09:00`).getTime();
  }

  // 2026년 5월 형식
  const koreanMonthMatch = dateText.match(
    /(\d{4})년\s*(\d{1,2})월/
  );

  if (koreanMonthMatch) {
    const year = koreanMonthMatch[1];
    const month = koreanMonthMatch[2].padStart(2, "0");

    return new Date(`${year}-${month}-01T00:00:00+09:00`).getTime();
  }

  // 2025-09-13 형식
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateText)) {
    const [year, month, day] = dateText.split("-");

    return new Date(
      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00+09:00`
    ).getTime();
  }

  // 2025-09 형식
  if (/^\d{4}-\d{1,2}$/.test(dateText)) {
    const [year, month] = dateText.split("-");

    return new Date(
      `${year}-${month.padStart(2, "0")}-01T00:00:00+09:00`
    ).getTime();
  }

  // 2025 형식
  if (/^\d{4}$/.test(dateText)) {
    return new Date(`${dateText}-01-01T00:00:00+09:00`).getTime();
  }

  // 2025.09.13 또는 2025.9.13 형식
  if (/^\d{4}\.\d{1,2}\.\d{1,2}$/.test(dateText)) {
    const [year, month, day] = dateText.split(".");

    return new Date(
      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00+09:00`
    ).getTime();
  }

  // 2025.09 또는 2025.9 형식
  if (/^\d{4}\.\d{1,2}$/.test(dateText)) {
    const [year, month] = dateText.split(".");

    return new Date(
      `${year}-${month.padStart(2, "0")}-01T00:00:00+09:00`
    ).getTime();
  }

  const parsedDate = new Date(dateText).getTime();

  if (Number.isNaN(parsedDate)) {
    return 0;
  }

  return parsedDate;
}

// =========================
// 공통 함수
// =========================

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

// =========================
// 페이지 로딩 후 실행
// =========================

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const navLinks = document.querySelectorAll(".nav a");
  const sections = document.querySelectorAll("section[id]");
  const noticeScroll = document.querySelector(".notice-scroll");

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || !targetId.startsWith("#")) return;

      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;

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

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove("active");

          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav();

  if (noticeScroll) {
    noticeScroll.addEventListener(
      "wheel",
      (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
          return;
        }

        const maxScrollLeft =
          noticeScroll.scrollWidth - noticeScroll.clientWidth;

        if (maxScrollLeft <= 1) {
          return;
        }

        const isScrollingRight = event.deltaY > 0;
        const isScrollingLeft = event.deltaY < 0;

        const isAtStart = noticeScroll.scrollLeft <= 0;
        const isAtEnd =
          noticeScroll.scrollLeft >= maxScrollLeft - 1;

        const canScrollRight =
          isScrollingRight && !isAtEnd;

        const canScrollLeft =
          isScrollingLeft && !isAtStart;

        if (canScrollRight || canScrollLeft) {
          event.preventDefault();

          noticeScroll.scrollLeft += event.deltaY;
        }
      },
      {
        passive: false,
      }
    );

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    noticeScroll.addEventListener("mousedown", (event) => {
      isDragging = true;

      noticeScroll.classList.add("dragging");

      startX = event.pageX - noticeScroll.offsetLeft;
      scrollLeft = noticeScroll.scrollLeft;
    });

    noticeScroll.addEventListener("mouseleave", () => {
      isDragging = false;

      noticeScroll.classList.remove("dragging");
    });

    noticeScroll.addEventListener("mouseup", () => {
      isDragging = false;

      noticeScroll.classList.remove("dragging");
    });

    noticeScroll.addEventListener("mousemove", (event) => {
      if (!isDragging) return;

      event.preventDefault();

      const x = event.pageX - noticeScroll.offsetLeft;
      const walk = (x - startX) * 1.4;

      noticeScroll.scrollLeft = scrollLeft - walk;
    });
  }

  function toggleHeaderShadow() {
    if (!header) return;

    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", toggleHeaderShadow);
  toggleHeaderShadow();

  const pagination = document.querySelector("#notice-pagination");

  if (pagination) {
    pagination.addEventListener("click", (event) => {
      const button = event.target.closest("[data-page]");

      if (!button) return;

      const page = Number(button.dataset.page);

      if (!Number.isInteger(page)) return;

      renderNoticeBoard(noticeData, page);

      const board = document.querySelector("#notice-list");

      if (board) {
        const headerHeight = header ? header.offsetHeight : 0;

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
    });
  }

  loadNotices();

  loadEliteRecords();
});