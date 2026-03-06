import { escapeHtml, formatDate } from "../core/dom.js";
import { eventsData } from "../data/events.js";

const NOTICE_TAB_ITEMS = [
  { key: "all", label: "Tổng hợp" },
  { key: "admissions", label: "Thông báo tuyển sinh" },
  { key: "students", label: "Thông báo sinh viên" },
  { key: "jobs", label: "Tuyển dụng" },
];

function detailHref(id) {
  return `/pages/news/detail.html?id=${encodeURIComponent(id)}`;
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectNoticeBucket(item) {
  const category = normalizeText(item.category);
  const title = normalizeText(item.title);
  const combined = `${category} ${title}`;

  if (combined.includes("tuyen dung") || combined.includes("viec lam")) return "jobs";
  if (combined.includes("sinh vien")) return "students";
  if (combined.includes("tuyen sinh")) return "admissions";
  if (combined.includes("thong bao")) return "all";
  if (combined.includes("thong b") || combined.includes("tuyen sinh") || combined.includes("sinh vi")) return "all";
  return null;
}

function selectFeaturedItem(newsData) {
  return [...newsData].sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;
}

function renderLandingSlideshow(newsData) {
  const mount = document.getElementById("home-slideshow");
  if (!mount) return;

  const slides = [...newsData].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  if (!slides.length) return;

  mount.innerHTML = `
    <div class="vc-slider-track" id="home-slider-track">
      ${slides
        .map(
          (item) => `
        <article class="vc-slide">
          <img class="vc-slide-media" src="${escapeHtml(item.cover)}" alt="${escapeHtml(item.title)}" loading="lazy"
            onerror="this.src='/assets/img/bg-landing.jpg'" />
          <div class="vc-slide-overlay" aria-hidden="true"></div>
          <div class="vc-slide-content">
            <p class="vc-slide-meta">${escapeHtml(formatDate(item.date))} • ${escapeHtml(item.category)}</p>
            <h2 class="vc-slide-title"><a href="${detailHref(item.id)}">${escapeHtml(item.title)}</a></h2>
            <p class="vc-slide-excerpt">${escapeHtml(item.excerpt)}</p>
          </div>
        </article>
      `,
        )
        .join("")}
    </div>
    <button class="vc-slider-control prev" type="button" aria-label="Slide trước">
      <span class="material-symbols-rounded" aria-hidden="true">chevron_left</span>
    </button>
    <button class="vc-slider-control next" type="button" aria-label="Slide sau">
      <span class="material-symbols-rounded" aria-hidden="true">chevron_right</span>
    </button>
    <div class="vc-slider-dots" role="tablist" aria-label="Điều hướng slideshow">
      ${slides
        .map(
          (_, idx) => `<button class="vc-slider-dot" type="button" data-slide="${idx}" aria-label="Slide ${idx + 1}" aria-current="${idx === 0 ? "true" : "false"}"></button>`,
        )
        .join("")}
    </div>
  `;

  const track = mount.querySelector("#home-slider-track");
  const dots = Array.from(mount.querySelectorAll(".vc-slider-dot"));
  const prev = mount.querySelector(".vc-slider-control.prev");
  const next = mount.querySelector(".vc-slider-control.next");

  let activeIndex = 0;
  let timer = null;

  const apply = (nextIndex) => {
    activeIndex = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    dots.forEach((dot, idx) => {
      dot.setAttribute("aria-current", idx === activeIndex ? "true" : "false");
    });
  };

  const start = () => {
    stop();
    timer = window.setInterval(() => apply(activeIndex + 1), 5000);
  };

  const stop = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  prev.addEventListener("click", () => {
    apply(activeIndex - 1);
    start();
  });

  next.addEventListener("click", () => {
    apply(activeIndex + 1);
    start();
  });

  mount.addEventListener("click", (event) => {
    const dot = event.target.closest(".vc-slider-dot");
    if (!dot) return;
    apply(Number(dot.dataset.slide || 0));
    start();
  });

  mount.addEventListener("mouseenter", stop);
  mount.addEventListener("mouseleave", start);

  apply(0);
  start();
}

function renderSpotlight(item) {
  const mount = document.getElementById("home-spotlight");
  if (!mount || !item) return;

  mount.innerHTML = `
    <p class="vc-spotlight-meta">
      <span>${escapeHtml(formatDate(item.date))}</span>
      <span>${escapeHtml(item.category)}</span>
      <span>${escapeHtml(item.views)} lượt xem</span>
    </p>
    <h2 class="vc-spotlight-title">
      <a href="${detailHref(item.id)}">${escapeHtml(item.title)}</a>
    </h2>
    <p class="vc-spotlight-excerpt">${escapeHtml(item.excerpt)}</p>
    <a class="vc-spotlight-cta" href="${detailHref(item.id)}">Đọc tiếp</a>
  `;
}

function renderNewsListCards(newsData) {
  const mount = document.getElementById("home-news");
  if (!mount) return;

  const items = [...newsData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter((item) => item.id)
    .slice(0, 6);

  const [featured, ...rest] = items;

  const featuredHtml = featured
    ? `
      <article class="vc-news-card vc-news-card--feature">
        <img class="vc-news-thumb" src="${escapeHtml(featured.cover)}" alt="${escapeHtml(featured.title)}" loading="lazy"
          onerror="this.src='/assets/img/bg-landing.jpg'" />
        <div>
          <p class="vc-news-meta">${escapeHtml(formatDate(featured.date))} • ${escapeHtml(featured.category)}</p>
          <h3 class="vc-news-title">
            <a href="${detailHref(featured.id)}">${escapeHtml(featured.title)}</a>
          </h3>
          <p class="vc-news-excerpt mb-0">${escapeHtml(featured.excerpt)}</p>
        </div>
      </article>
    `
    : "";

  const restHtml = rest
    .map(
      (item) => `
      <article class="vc-news-card vc-news-card--compact">
        <div>
          <p class="vc-news-meta">${escapeHtml(formatDate(item.date))} • ${escapeHtml(item.category)}</p>
          <h3 class="vc-news-title clamp-2">
            <a href="${detailHref(item.id)}">${escapeHtml(item.title)}</a>
          </h3>
          <p class="vc-news-excerpt clamp-2 mb-0">${escapeHtml(item.excerpt)}</p>
        </div>
      </article>
    `,
    )
    .join("");

  mount.innerHTML = `${featuredHtml}${restHtml}`;
}

function buildNoticeIndex(newsData) {
  const buckets = {
    all: [],
    admissions: [],
    students: [],
    jobs: [],
  };

  [...newsData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((item) => {
      const bucket = detectNoticeBucket(item);
      if (!bucket) return;

      buckets.all.push(item);
      if (bucket !== "all") buckets[bucket].push(item);
    });

  // TODO: Khi data có category chuẩn, map trực tiếp category -> tab key.
  if (!buckets.admissions.length) {
    buckets.admissions = buckets.all.filter((item) => normalizeText(item.title).includes("tuyen sinh")).slice(0, 6);
  }
  if (!buckets.students.length) {
    buckets.students = buckets.all.filter((item) => normalizeText(item.title).includes("sinh vien")).slice(0, 6);
  }
  if (!buckets.jobs.length) {
    buckets.jobs = buckets.all.filter((item) => normalizeText(item.title).includes("tuyen dung")).slice(0, 6);
  }

  return buckets;
}

function renderNoticeList(items) {
  const mount = document.getElementById("home-notices-list");
  if (!mount) return;

  if (!items.length) {
    mount.innerHTML = `<p class="text-sm text-muted mb-0">Chưa có dữ liệu cho nhóm thông báo này.</p>`;
    return;
  }

  mount.innerHTML = items
    .slice(0, 7)
    .map(
      (item) => `
      <article class="vc-notice-item">
        <a class="vc-notice-item-title" href="${detailHref(item.id)}">${escapeHtml(item.title)}</a>
        <span class="vc-notice-item-date">${escapeHtml(formatDate(item.date))}</span>
      </article>
    `,
    )
    .join("");
}

function renderNoticeTabs(index) {
  const tabsMount = document.getElementById("home-notices-tabs");
  const panel = document.getElementById("home-notices-list");
  if (!tabsMount || !panel) return;

  let activeTab = "all";

  tabsMount.innerHTML = NOTICE_TAB_ITEMS.map(
    (tab, idx) => `<button
      class="vc-notice-tab"
      id="notice-tab-${tab.key}"
      type="button"
      role="tab"
      tabindex="${idx === 0 ? "0" : "-1"}"
      aria-selected="${idx === 0 ? "true" : "false"}"
      aria-controls="home-notices-list"
      data-tab="${tab.key}">
      ${tab.label}
    </button>`,
  ).join("");

  panel.setAttribute("aria-labelledby", "notice-tab-all");

  const applyTab = (nextTab) => {
    activeTab = nextTab;
    tabsMount.querySelectorAll("[data-tab]").forEach((button) => {
      const isActive = button.dataset.tab === activeTab;
      button.setAttribute("aria-selected", isActive ? "true" : "false");
      button.setAttribute("tabindex", isActive ? "0" : "-1");
      if (isActive) panel.setAttribute("aria-labelledby", button.id);
    });
    renderNoticeList(index[activeTab] || []);
  };

  tabsMount.addEventListener("click", (event) => {
    const tabButton = event.target.closest("[data-tab]");
    if (!tabButton || !tabsMount.contains(tabButton)) return;
    applyTab(tabButton.dataset.tab);
  });

  tabsMount.addEventListener("keydown", (event) => {
    const current = event.target.closest("[data-tab]");
    if (!current) return;

    const tabs = Array.from(tabsMount.querySelectorAll("[data-tab]"));
    const currentIndex = tabs.indexOf(current);
    if (currentIndex < 0) return;

    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();

    const delta = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + delta + tabs.length) % tabs.length;
    tabs[nextIndex].focus();
    applyTab(tabs[nextIndex].dataset.tab);
  });

  applyTab(activeTab);
}

function renderEvents(items) {
  const mount = document.getElementById("home-events");
  if (!mount) return;

  mount.innerHTML = items
    .slice(0, 5)
    .map((event) => {
      const [day = "", time = ""] = String(event.datetime).split(" ");
      return `
      <article class="vc-event-item">
        <div class="vc-event-dot" aria-hidden="true"></div>
        <p class="vc-event-time mb-0">${escapeHtml(day)}${time ? ` • ${escapeHtml(time)}` : ""}</p>
        <h3 class="vc-event-title">${escapeHtml(event.title)}</h3>
        <p class="vc-event-meta mb-0">${escapeHtml(event.location)}</p>
      </article>
    `;
    })
    .join("");
}

export function initHome(newsData) {
  if (!document.getElementById("home-spotlight")) return;

  renderLandingSlideshow(newsData);

  const featured = selectFeaturedItem(newsData);
  renderSpotlight(featured);
  renderNewsListCards(newsData);

  const noticeIndex = buildNoticeIndex(newsData);
  renderNoticeTabs(noticeIndex);
  renderEvents(eventsData);
}
