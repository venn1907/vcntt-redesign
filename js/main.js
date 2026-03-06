import { inject } from "./core/include.js";
import { setActiveNav, setFooterYear } from "./core/nav.js";
import { newsData } from "./data/news.js";
import { initHome } from "./pages/home.js";
import { initNewsList } from "./pages/news-list.js";
import { initNewsDetail } from "./pages/news-detail.js";
import { initHeaderCollapse } from "./core/header-scroll.js";

function initScrollToTop() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "vc-scroll-top";
  button.id = "scrollTopButton";
  button.setAttribute("aria-label", "Cuon len dau trang");
  button.innerHTML =
    '<span class="material-symbols-rounded" aria-hidden="true">arrow_upward</span>';

  const updateVisibility = () => {
    const visible = window.scrollY > 280;
    button.classList.toggle("is-visible", visible);
    button.setAttribute("aria-hidden", visible ? "false" : "true");
    button.tabIndex = visible ? 0 : -1;
  };

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", updateVisibility, { passive: true });
  window.addEventListener("resize", updateVisibility);
  document.body.appendChild(button);
  updateVisibility();
}

(async function boot() {
  await inject("#site-header", "layouts/header.html");
  await inject("#site-footer", "layouts/footer.html");

  initHeaderCollapse();
  initScrollToTop();
  setActiveNav();
  setFooterYear();

  initHome(newsData);
  initNewsList(newsData);
  initNewsDetail(newsData);
})();

