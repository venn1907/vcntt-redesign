import { inject } from "./core/include.js";
import { setActiveNav, setFooterYear } from "./core/nav.js";
import { newsData } from "./data/news.js";
import { initHome } from "./pages/home.js";
import { initNewsList } from "./pages/news-list.js";
import { initNewsDetail } from "./pages/news-detail.js";
import { initHeaderCollapse } from "./core/header-scroll.js";

(async function boot() {
  await inject("#site-header", "/layouts/header.html");
  await inject("#site-footer", "/layouts/footer.html");

  initHeaderCollapse();
  setActiveNav();
  setFooterYear();

  initHome(newsData);
  initNewsList(newsData);
  initNewsDetail(newsData);
})();
