import { qs, escapeHtml, formatDate } from "../core/dom.js";
import { renderNewsCards } from "../components/news-cards.js";

export function initNewsDetail(newsData) {
  const mount = document.getElementById("news-detail");
  if (!mount) return;

  const id = qs("id") || newsData[0]?.id;
  const item = newsData.find((n) => n.id === id) || newsData[0];
  const related = newsData.filter((n) => n.id !== item.id).slice(0, 3);

  mount.innerHTML = `
    <article class="vc-news-detail-panel">
      <header class="vc-news-detail-header">
        <nav aria-label="Breadcrumb" class="vc-news-breadcrumb mb-3">
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item"><a href="/index.html">Trang chủ</a></li>
            <li class="breadcrumb-item"><a href="/pages/news/index.html">Tin tức</a></li>
            <li class="breadcrumb-item active" aria-current="page">Chi tiết</li>
          </ol>
        </nav>

        <h1 class="vc-news-detail-title">${escapeHtml(item.title)}</h1>

        <div class="vc-news-detail-meta">
          <span class="vc-news-meta-chip vc-news-meta-chip--category">${escapeHtml(item.category)}</span>
          <span class="vc-news-meta-chip">
            <span class="material-symbols-rounded opacity-6" aria-hidden="true">calendar_month</span>
            ${escapeHtml(formatDate(item.date))}
          </span>
          <span class="vc-news-meta-chip">
            <span class="material-symbols-rounded opacity-6" aria-hidden="true">visibility</span>
            ${escapeHtml(item.views)} lượt xem
          </span>
        </div>
      </header>

      <img class="vc-news-detail-cover mb-4"
        src="${escapeHtml(item.cover)}" alt="${escapeHtml(item.title)}" loading="lazy"
        onerror="this.src='/assets/img/bg-landing.jpg'"/>

      <div class="article-container mx-auto">
        <div class="article-content">
          <p class="text-dark">${escapeHtml(item.excerpt)}</p>

          <h2>Điểm nổi bật</h2>
          <ul>
            <li>Thiết kế giao diện đồng bộ với trang chủ, nhấn mạnh khả năng đọc nhanh.</li>
            <li>Phân tầng thông tin rõ ràng: tiêu đề, metadata, nội dung, bài liên quan.</li>
            <li>Trải nghiệm responsive tối ưu cho mobile và màn hình desktop.</li>
          </ul>

          <blockquote class="text-dark">
            “Ưu tiên trải nghiệm người dùng: nhanh - rõ - dễ thao tác.”
          </blockquote>

          <p class="mb-0">
            (Nội dung demo. Khi triển khai thật, cập nhật nội dung chính thức theo heading, paragraph và media của bài viết.)
          </p>
        </div>
      </div>
    </article>

    <section class="vc-news-related-wrap">
      <div class="vc-news-related-panel">
        <div class="vc-news-related-head">
          <h2>Bài liên quan</h2>
          <a href="/pages/news/index.html">Xem tất cả</a>
        </div>
        <div class="row g-4" id="related-grid"></div>
      </div>
    </section>
  `;

  renderNewsCards("related-grid", related, {
    showExcerpt: false,
    titleClass: "mb-0 clamp-2",
  });
}
