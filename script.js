// =========================
// Gangnam Chess Federation
// script.js
// =========================

// script.js가 들어 있는 홈페이지 기준 폴더 주소
const SCRIPT_FILE_URL =
  document.currentScript?.src ||
  window.location.href;

const SITE_BASE_URL = new URL(
  "./",
  SCRIPT_FILE_URL
);

// 공통 컴포넌트 주소
const HEADER_COMPONENT_URL = new URL(
  "components/header.html",
  SITE_BASE_URL
);

const FOOTER_COMPONENT_URL = new URL(
  "components/footer.html",
  SITE_BASE_URL
);

// 공지 API URL
const NOTICE_API_URL =
  "https://script.google.com/macros/s/AKfycbwSLSHgC4OfUcj4-z-3AdQGLY5qEnrtlTDyFnbzY3qRJgxwWqZ8zlGlxRK1CyWvB-ip/exec";

// 엘리트 선수단 대회 이력 API URL
const ELITE_RECORD_API_URL =
  "https://script.google.com/macros/s/AKfycbwv24W3Xb30jmXvfOEsu1UQ6EbYpjhvT6OgOQScZhokv7OsXQYNGz-v1noNYJZB-UjH/exec";

let noticeData = [];
let visibleNoticeData = [];
let noticeSearchActive = false;

const NOTICES_PER_PAGE = 8;

const ELITE_CATEGORY_ORDER = [
  "Olympiad",
  "Kadet",
  "League",
];

// =========================
// 공통 헤더·푸터
// =========================

async function fetchComponent(componentUrl) {
  const response = await fetch(componentUrl, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `컴포넌트 로딩 실패: ${response.status}`
    );
  }

  const html = await response.text();

  // header.html과 footer.html 안의
  // {{BASE}}를 홈페이지 기준 주소로 교체
  return html.replaceAll(
    "{{BASE}}",
    SITE_BASE_URL.href
  );
}

function replaceComponent({
  html,
  placeholderSelector,
  existingSelector,
  insertPosition,
}) {
  const placeholder =
    document.querySelector(
      placeholderSelector
    );

  if (placeholder) {
    placeholder.outerHTML = html;
    return;
  }

  const existingElement =
    document.querySelector(
      existingSelector
    );

  if (existingElement) {
    existingElement.outerHTML = html;
    return;
  }

  document.body.insertAdjacentHTML(
    insertPosition,
    html
  );
}

async function loadHeader() {
  try {
    const headerHtml =
      await fetchComponent(
        HEADER_COMPONENT_URL
      );

    replaceComponent({
      html: headerHtml,
      placeholderSelector:
        "#site-header",
      existingSelector:
        "header.header",
      insertPosition:
        "afterbegin",
    });
  } catch (error) {
    console.error(
      "공통 헤더 로딩 실패:",
      error
    );
  }
}

async function loadFooter() {
  try {
    const footerHtml =
      await fetchComponent(
        FOOTER_COMPONENT_URL
      );

    replaceComponent({
      html: footerHtml,
      placeholderSelector:
        "#site-footer",
      existingSelector:
        "footer.footer",
      insertPosition:
        "beforeend",
    });
  } catch (error) {
    console.error(
      "공통 푸터 로딩 실패:",
      error
    );
  }
}

async function loadSiteComponents() {
  await Promise.all([
    loadHeader(),
    loadFooter(),
  ]);

  updateCopyrightYear();
  setActivePageNavigation();
}

function updateCopyrightYear() {
  const yearElements =
    document.querySelectorAll(
      "[data-current-year]"
    );

  const currentYear =
    new Date().getFullYear();

  yearElements.forEach((element) => {
    element.textContent =
      String(currentYear);
  });
}

// =========================
// 현재 페이지 메뉴 활성화
// =========================

function normalizePathname(pathname) {
  let normalizedPath =
    pathname.replace(
      /\/index\.html$/i,
      "/"
    );

  if (
    normalizedPath.length > 1 &&
    normalizedPath.endsWith("/")
  ) {
    normalizedPath =
      normalizedPath.slice(0, -1);
  }

  return normalizedPath;
}

function setActivePageNavigation() {
  const navLinks =
    document.querySelectorAll(
      ".nav a"
    );

  const currentPath =
    normalizePathname(
      window.location.pathname
    );

  navLinks.forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute(
      "aria-current"
    );

    const linkUrl = new URL(
      link.href,
      window.location.href
    );

    const linkPath =
      normalizePathname(
        linkUrl.pathname
      );

    if (linkPath === currentPath) {
      link.classList.add("active");

      link.setAttribute(
        "aria-current",
        "page"
      );
    }
  });
}

// =========================
// 공지사항
// =========================

function renderNoticeBoard(
  notices,
  page = 1
) {
  const container =
    document.querySelector(
      "#notice-list"
    );

  const pagination =
    document.querySelector(
      "#notice-pagination"
    );

  if (!container) {
    return;
  }

  if (notices.length === 0) {
    const emptyMessage =
      noticeSearchActive
        ? "검색 조건에 맞는 공지사항이 없습니다."
        : "등록된 공지사항이 없습니다.";

    container.innerHTML = `
      <p class="notice-empty">
        ${emptyMessage}
      </p>
    `;

    if (pagination) {
      pagination.innerHTML = "";
    }

    return;
  }

  const totalPages = Math.ceil(
    notices.length /
      NOTICES_PER_PAGE
  );

  const safePage = Math.min(
    Math.max(page, 1),
    totalPages
  );

  const startIndex =
    (safePage - 1) *
    NOTICES_PER_PAGE;

  const noticesForPage =
    notices.slice(
      startIndex,
      startIndex +
        NOTICES_PER_PAGE
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

function normalizeNoticeSearchText(value) {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("ko-KR");
}

function getNoticeDateKey(value) {
  const dateText = String(
    value ?? ""
  ).trim();

  if (!dateText) {
    return "";
  }

  const dateOnlyMatch =
    dateText.match(
      /^(\d{4})[-./](\d{1,2})[-./](\d{1,2})$/
    );

  if (dateOnlyMatch) {
    const [, year, month, day] =
      dateOnlyMatch;

    return `${year}-${month.padStart(
      2,
      "0"
    )}-${day.padStart(2, "0")}`;
  }

  const koreanDateMatch =
    dateText.match(
      /^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/
    );

  if (koreanDateMatch) {
    const [, year, month, day] =
      koreanDateMatch;

    return `${year}-${month.padStart(
      2,
      "0"
    )}-${day.padStart(2, "0")}`;
  }

  const date = new Date(dateText);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const dateParts =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Seoul",
      }
    ).formatToParts(date);

  const year = dateParts.find(
    (part) => part.type === "year"
  )?.value;

  const month = dateParts.find(
    (part) => part.type === "month"
  )?.value;

  const day = dateParts.find(
    (part) => part.type === "day"
  )?.value;

  if (!year || !month || !day) {
    return "";
  }

  return `${year}-${month}-${day}`;
}

function updateNoticeSearchStatus({
  titleQuery = "",
  dateQuery = "",
  resultCount = noticeData.length,
} = {}) {
  const status =
    document.querySelector(
      "#notice-search-result"
    );

  if (!status) {
    return;
  }

  if (!titleQuery && !dateQuery) {
    status.textContent =
      `전체 ${noticeData.length}개의 공지사항입니다.`;
    return;
  }

  const conditions = [];

  if (titleQuery) {
    conditions.push(
      `제목 “${titleQuery}”`
    );
  }

  if (dateQuery) {
    conditions.push(
      `날짜 ${dateQuery.replaceAll(
        "-",
        "."
      )}`
    );
  }

  status.textContent =
    `${conditions.join(
      ", "
    )} 검색 결과 ${resultCount}개입니다.`;
}

function applyNoticeSearch() {
  const titleInput =
    document.querySelector(
      "#notice-title-search"
    );

  const dateInput =
    document.querySelector(
      "#notice-date-search"
    );

  if (!titleInput || !dateInput) {
    return;
  }

  const titleQuery =
    normalizeNoticeSearchText(
      titleInput.value
    );

  const dateQuery =
    dateInput.value.trim();

  noticeSearchActive = Boolean(
    titleQuery || dateQuery
  );

  visibleNoticeData =
    noticeData.filter((notice) => {
      const noticeTitle =
        normalizeNoticeSearchText(
          notice.title
        );

      const matchesTitle =
        !titleQuery ||
        noticeTitle.includes(
          titleQuery
        );

      const matchesDate =
        !dateQuery ||
        getNoticeDateKey(
          notice.date
        ) === dateQuery;

      return (
        matchesTitle &&
        matchesDate
      );
    });

  renderNoticeBoard(
    visibleNoticeData,
    1
  );

  updateNoticeSearchStatus({
    titleQuery:
      titleInput.value.trim(),
    dateQuery,
    resultCount:
      visibleNoticeData.length,
  });
}

function initializeNoticeSearch() {
  const form =
    document.querySelector(
      "#notice-search-form"
    );

  if (!form) {
    return;
  }

  const resetButton =
    document.querySelector(
      "#notice-search-reset"
    );

  const titleInput =
    document.querySelector(
      "#notice-title-search"
    );

  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      applyNoticeSearch();
    }
  );

  resetButton?.addEventListener(
    "click",
    () => {
      form.reset();

      noticeSearchActive = false;

      visibleNoticeData = [
        ...noticeData,
      ];

      renderNoticeBoard(
        visibleNoticeData,
        1
      );

      updateNoticeSearchStatus();
      titleInput?.focus();
    }
  );
}

async function loadNotices() {
  const container =
    document.querySelector(
      "#notice-list"
    );

  if (!container) {
    return;
  }

  container.innerHTML = `
    <p class="notice-loading">
      공지사항을 불러오는 중입니다.
    </p>
  `;

  try {
    const response = await fetch(
      NOTICE_API_URL,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        `HTTP 오류: ${response.status}`
      );
    }

    const result =
      await response.json();

    if (!result.success) {
      throw new Error(
        result.message ||
        "공지 데이터를 불러오지 못했습니다."
      );
    }

    const notices = Array.isArray(
      result.notices
    )
      ? result.notices
      : [];

    noticeData = [...notices].sort(
      (a, b) => {
        const aTime =
          new Date(
            a.date
          ).getTime();

        const bTime =
          new Date(
            b.date
          ).getTime();

        const safeATime =
          Number.isNaN(aTime)
            ? -Infinity
            : aTime;

        const safeBTime =
          Number.isNaN(bTime)
            ? -Infinity
            : bTime;

        return (
          safeBTime -
          safeATime
        );
      }
    );

    visibleNoticeData = [
      ...noticeData,
    ];

    const isHomePage =
      document.body.classList.contains(
        "home-page"
      );

    if (isHomePage) {
      renderNotices(
        container,
        noticeData.slice(0, 4)
      );
    } else {
      renderNoticeBoard(
        visibleNoticeData,
        1
      );

      updateNoticeSearchStatus();
    }
  } catch (error) {
    console.error(
      "공지사항 로딩 실패:",
      error
    );

    container.innerHTML = `
      <p class="notice-error">
        공지사항을 불러오지 못했습니다.
        잠시 후 다시 시도해 주세요.
      </p>
    `;

    const searchResult =
      document.querySelector(
        "#notice-search-result"
      );

    if (searchResult) {
      searchResult.textContent =
        "공지사항을 불러오지 못했습니다.";
    }
  }
}

function getSafeUrl(value) {
  const urlValue = String(
    value ?? ""
  ).trim();

  if (!urlValue) {
    return "";
  }

  try {
    const parsedUrl = new URL(
      urlValue,
      window.location.href
    );

    if (
      parsedUrl.protocol !==
        "http:" &&
      parsedUrl.protocol !==
        "https:"
    ) {
      return "";
    }

    return parsedUrl.href;
  } catch {
    return "";
  }
}

function createNoticeListItem(
  notice
) {
  const externalUrl =
    getSafeUrl(
      notice.externalUrl
    );

  const title =
    escapeHtml(
      notice.title
    );

  const titleHtml =
    externalUrl
      ? `
        <a
          href="${escapeHtml(
            externalUrl
          )}"
          target="_blank"
          rel="noopener noreferrer"
          class="notice-board-title"
        >
          ${title}
        </a>
      `
      : `
        <span
          class="notice-board-title disabled"
        >
          ${title}
        </span>
      `;

  return `
    <article class="notice-board-item">
      <span
        class="notice-board-category"
      >
        ${escapeHtml(
          notice.category
        )}
      </span>

      <div
        class="notice-board-content"
      >
        ${titleHtml}

        <p>
          ${escapeHtml(
            notice.summary
          )}
        </p>
      </div>

      <time
        class="notice-board-date"
        datetime="${escapeHtml(
          getNoticeDateKey(
            notice.date
          )
        )}"
      >
        ${formatDate(
          notice.date
        )}
      </time>
    </article>
  `;
}

function renderPagination(
  container,
  totalPages,
  currentPage
) {
  if (
    !container ||
    totalPages <= 1
  ) {
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
        data-page="${
          currentPage - 1
        }"
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
    const activeClass =
      page === currentPage
        ? "active"
        : "";

    const ariaCurrent =
      page === currentPage
        ? "page"
        : "false";

    paginationHtml += `
      <button
        type="button"
        class="pagination-button ${activeClass}"
        data-page="${page}"
        aria-current="${ariaCurrent}"
      >
        ${page}
      </button>
    `;
  }

  if (
    currentPage <
    totalPages
  ) {
    paginationHtml += `
      <button
        type="button"
        class="pagination-button"
        data-page="${
          currentPage + 1
        }"
      >
        다음
      </button>
    `;
  }

  container.innerHTML =
    paginationHtml;
}

function renderNotices(
  container,
  notices
) {
  if (notices.length === 0) {
    container.innerHTML = `
      <p class="notice-empty">
        등록된 공지사항이 없습니다.
      </p>
    `;

    return;
  }

  container.innerHTML =
    notices
      .map(createNoticeCard)
      .join("");
}

function createNoticeCard(notice) {
  const highlightClass =
    notice.important === true
      ? " highlight"
      : "";

  const externalUrl =
    getSafeUrl(
      notice.externalUrl
    );

  const imageUrl =
    getSafeUrl(
      notice.imageUrl
    );

  const imageHtml = imageUrl
    ? `
      <img
        src="${escapeHtml(
          imageUrl
        )}"
        alt="${escapeHtml(
          notice.title
        )} 관련 이미지"
        class="notice-card-image"
        loading="lazy"
      />
    `
    : "";

  const detailLink =
    externalUrl
      ? `
        <a
          href="${escapeHtml(
            externalUrl
          )}"
          class="notice-detail-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          자세히 보기
        </a>
      `
      : `
        <span
          class="notice-link-disabled"
        >
          링크 준비 중
        </span>
      `;

  return `
    <article
      class="notice-card${highlightClass}"
    >
      ${imageHtml}

      <div
        class="notice-card-body"
      >
        <span
          class="notice-tag"
        >
          ${escapeHtml(
            notice.category
          )}
        </span>

        <h3>
          ${escapeHtml(
            notice.title
          )}
        </h3>

        <p>
          ${escapeHtml(
            notice.summary
          )}
        </p>

        <div class="notice-meta">
          <span>
            ${formatDate(
              notice.date
            )}
          </span>

          ${detailLink}
        </div>
      </div>
    </article>
  `;
}

// =========================
// 엘리트 선수단
// =========================

async function loadEliteRecords() {
  const container =
    document.querySelector(
      "#elite-record-grid"
    );

  if (!container) {
    return;
  }

  container.innerHTML = `
    <p class="notice-loading">
      대회 이력을 불러오는 중입니다.
    </p>
  `;

  try {
    const response = await fetch(
      ELITE_RECORD_API_URL,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        `HTTP 오류: ${response.status}`
      );
    }

    const result =
      await response.json();

    if (
      result.success === false
    ) {
      throw new Error(
        result.message ||
        "대회 이력 데이터를 불러오지 못했습니다."
      );
    }

    const records =
      getEliteRecordsFromResult(
        result
      );

    if (
      records.length === 0
    ) {
      container.innerHTML = `
        <p class="notice-empty">
          등록된 대회 이력이 없습니다.
        </p>
      `;

      return;
    }

    container.innerHTML =
      renderLatestEliteRecordByCategory(
        records
      );
  } catch (error) {
    console.error(
      "대회 이력 로딩 실패:",
      error
    );

    container.innerHTML = `
      <p class="notice-error">
        대회 이력을 불러오지 못했습니다.
        잠시 후 다시 시도해 주세요.
      </p>
    `;
  }
}

function getEliteRecordsFromResult(
  result
) {
  let records = [];

  if (Array.isArray(result)) {
    records = result;
  } else if (
    Array.isArray(
      result.records
    )
  ) {
    records =
      result.records;
  } else if (
    Array.isArray(
      result.data
    )
  ) {
    records =
      result.data;
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

function normalizeEliteRecord(
  record
) {
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

function normalizeEliteCategory(
  categoryValue
) {
  const category = String(
    categoryValue
  )
    .trim()
    .toLowerCase();

  if (
    category ===
    "olympiad"
  ) {
    return "Olympiad";
  }

  if (
    category === "kadet" ||
    category === "cadet"
  ) {
    return "Kadet";
  }

  if (
    category === "league"
  ) {
    return "League";
  }

  return "";
}

function renderLatestEliteRecordByCategory(
  records
) {
  return ELITE_CATEGORY_ORDER
    .map((category) => {
      const latestRecord =
        records
          .filter(
            (record) =>
              record.category ===
              category
          )
          .sort((a, b) => {
            return (
              parseEliteDate(
                b.date
              ) -
              parseEliteDate(
                a.date
              )
            );
          })[0];

      return createEliteCategoryCard(
        category,
        latestRecord
      );
    })
    .join("");
}

function createEliteCategoryCard(
  category,
  record
) {
  if (!record) {
    return `
      <article class="record-card">
        <h4>
          ${escapeHtml(
            category
          )}
        </h4>

        <ul>
          <li>
            등록된 대회 이력이 없습니다.
          </li>
        </ul>
      </article>
    `;
  }

  return `
    <article class="record-card">
      <h4>
        ${escapeHtml(
          category
        )}
      </h4>

      <ul>
        <li>
          <strong>대회:</strong>
          ${escapeHtml(
            record.eventName
          )}
        </li>

        <li>
          <strong>날짜:</strong>
          ${escapeHtml(
            record.date
          )}
        </li>

        <li>
          <strong>장소:</strong>
          ${escapeHtml(
            record.location
          )}
        </li>

        <li>
          <strong>주요 성과:</strong>
          ${escapeHtml(
            record.achievement
          )}
        </li>

        <li>
          <strong>대표 선수:</strong>
          ${escapeHtml(
            record.players
          )}
        </li>
      </ul>
    </article>
  `;
}

function parseEliteDate(
  dateValue
) {
  if (!dateValue) {
    return 0;
  }

  const dateText = String(
    dateValue
  ).trim();

  const koreanDateMatch =
    dateText.match(
      /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/
    );

  if (koreanDateMatch) {
    const year =
      koreanDateMatch[1];

    const month =
      koreanDateMatch[2].padStart(
        2,
        "0"
      );

    const day =
      koreanDateMatch[3].padStart(
        2,
        "0"
      );

    return new Date(
      `${year}-${month}-${day}T00:00:00+09:00`
    ).getTime();
  }

  const koreanMonthMatch =
    dateText.match(
      /(\d{4})년\s*(\d{1,2})월/
    );

  if (koreanMonthMatch) {
    const year =
      koreanMonthMatch[1];

    const month =
      koreanMonthMatch[2].padStart(
        2,
        "0"
      );

    return new Date(
      `${year}-${month}-01T00:00:00+09:00`
    ).getTime();
  }

  if (
    /^\d{4}-\d{1,2}-\d{1,2}$/.test(
      dateText
    )
  ) {
    const [
      year,
      month,
      day,
    ] = dateText.split("-");

    return new Date(
      `${year}-${month.padStart(
        2,
        "0"
      )}-${day.padStart(
        2,
        "0"
      )}T00:00:00+09:00`
    ).getTime();
  }

  if (
    /^\d{4}-\d{1,2}$/.test(
      dateText
    )
  ) {
    const [
      year,
      month,
    ] = dateText.split("-");

    return new Date(
      `${year}-${month.padStart(
        2,
        "0"
      )}-01T00:00:00+09:00`
    ).getTime();
  }

  if (
    /^\d{4}$/.test(
      dateText
    )
  ) {
    return new Date(
      `${dateText}-01-01T00:00:00+09:00`
    ).getTime();
  }

  if (
    /^\d{4}\.\d{1,2}\.\d{1,2}$/.test(
      dateText
    )
  ) {
    const [
      year,
      month,
      day,
    ] = dateText.split(".");

    return new Date(
      `${year}-${month.padStart(
        2,
        "0"
      )}-${day.padStart(
        2,
        "0"
      )}T00:00:00+09:00`
    ).getTime();
  }

  if (
    /^\d{4}\.\d{1,2}$/.test(
      dateText
    )
  ) {
    const [
      year,
      month,
    ] = dateText.split(".");

    return new Date(
      `${year}-${month.padStart(
        2,
        "0"
      )}-01T00:00:00+09:00`
    ).getTime();
  }

  const parsedDate =
    new Date(
      dateText
    ).getTime();

  if (
    Number.isNaN(
      parsedDate
    )
  ) {
    return 0;
  }

  return parsedDate;
}

// =========================
// 공통 함수
// =========================

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date =
    new Date(dateValue);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(dateValue)
      .split("T")[0]
      .replaceAll("-", ".");
  }

  return new Intl.DateTimeFormat(
    "ko-KR",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone:
        "Asia/Seoul",
    }
  )
    .format(date)
    .replaceAll(". ", ".")
    .replace(/\.$/, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}

// =========================
// 화면 이벤트
// =========================

function initializeSmoothScroll() {
  const anchorLinks =
    document.querySelectorAll(
      'a[href^="#"]'
    );

  anchorLinks.forEach((link) => {
    link.addEventListener(
      "click",
      (event) => {
        const targetId =
          link.getAttribute(
            "href"
          );

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }

        const targetElement =
          document.querySelector(
            targetId
          );

        if (!targetElement) {
          return;
        }

        event.preventDefault();

        const header =
          document.querySelector(
            ".header"
          );

        const headerHeight =
          header
            ? header.offsetHeight
            : 0;

        const targetTop =
          targetElement
            .getBoundingClientRect()
            .top +
          window.scrollY -
          headerHeight -
          12;

        window.scrollTo({
          top: targetTop,
          behavior: "smooth",
        });
      }
    );
  });
}

function initializeHeaderShadow() {
  const header =
    document.querySelector(
      ".header"
    );

  if (!header) {
    return;
  }

  function toggleHeaderShadow() {
    if (
      window.scrollY > 20
    ) {
      header.classList.add(
        "scrolled"
      );
    } else {
      header.classList.remove(
        "scrolled"
      );
    }
  }

  window.addEventListener(
    "scroll",
    toggleHeaderShadow
  );

  toggleHeaderShadow();
}

function initializeNoticeScroll() {
  const noticeScroll =
    document.querySelector(
      ".home-page .notice-scroll"
    );

  if (!noticeScroll) {
    return;
  }

  noticeScroll.addEventListener(
    "wheel",
    (event) => {
      if (
        Math.abs(event.deltaY) <=
        Math.abs(event.deltaX)
      ) {
        return;
      }

      const maxScrollLeft =
        noticeScroll.scrollWidth -
        noticeScroll.clientWidth;

      if (
        maxScrollLeft <= 1
      ) {
        return;
      }

      const scrollingRight =
        event.deltaY > 0;

      const scrollingLeft =
        event.deltaY < 0;

      const atStart =
        noticeScroll.scrollLeft <=
        0;

      const atEnd =
        noticeScroll.scrollLeft >=
        maxScrollLeft - 1;

      if (
        (scrollingRight &&
          !atEnd) ||
        (scrollingLeft &&
          !atStart)
      ) {
        event.preventDefault();

        noticeScroll.scrollLeft +=
          event.deltaY;
      }
    },
    {
      passive: false,
    }
  );

  let isDragging = false;
  let startX = 0;
  let initialScrollLeft = 0;

  noticeScroll.addEventListener(
    "mousedown",
    (event) => {
      isDragging = true;

      noticeScroll.classList.add(
        "dragging"
      );

      startX =
        event.pageX -
        noticeScroll.offsetLeft;

      initialScrollLeft =
        noticeScroll.scrollLeft;
    }
  );

  noticeScroll.addEventListener(
    "mouseleave",
    () => {
      isDragging = false;

      noticeScroll.classList.remove(
        "dragging"
      );
    }
  );

  noticeScroll.addEventListener(
    "mouseup",
    () => {
      isDragging = false;

      noticeScroll.classList.remove(
        "dragging"
      );
    }
  );

  noticeScroll.addEventListener(
    "mousemove",
    (event) => {
      if (!isDragging) {
        return;
      }

      event.preventDefault();

      const currentX =
        event.pageX -
        noticeScroll.offsetLeft;

      const distance =
        (currentX - startX) *
        1.4;

      noticeScroll.scrollLeft =
        initialScrollLeft -
        distance;
    }
  );
}

function initializePagination() {
  const pagination =
    document.querySelector(
      "#notice-pagination"
    );

  if (!pagination) {
    return;
  }

  pagination.addEventListener(
    "click",
    (event) => {
      const button =
        event.target.closest(
          "[data-page]"
        );

      if (!button) {
        return;
      }

      const page = Number(
        button.dataset.page
      );

      if (
        !Number.isInteger(page)
      ) {
        return;
      }

      renderNoticeBoard(
        visibleNoticeData,
        page
      );

      const board =
        document.querySelector(
          "#notice-list"
        );

      if (!board) {
        return;
      }

      const header =
        document.querySelector(
          ".header"
        );

      const headerHeight =
        header
          ? header.offsetHeight
          : 0;

      const targetTop =
        board
          .getBoundingClientRect()
          .top +
        window.scrollY -
        headerHeight -
        24;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    }
  );
}

// =========================
// 페이지 로딩 후 실행
// =========================

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    // 모든 페이지에서 기존 헤더와 푸터를
    // 공통 컴포넌트로 교체
    await loadSiteComponents();

    initializeSmoothScroll();
    initializeHeaderShadow();
    initializeNoticeScroll();
    initializeNoticeSearch();
    initializePagination();

    loadNotices();
    loadEliteRecords();
  }
);