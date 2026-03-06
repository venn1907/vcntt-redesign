import { escapeHtml } from "../core/dom.js";
import { renderNewsCards } from "../components/news-cards.js";

export function initNewsList(newsData) {
  const grid = document.getElementById("news-grid");
  if (!grid) return;

  const categorySelect = document.getElementById("categoryFilter");
  const searchInput = document.getElementById("searchInput");
  const pagination = document.getElementById("pagination");
  const countEl = document.getElementById("resultCount");
  let categoryChoices = null;

  const pageSize = 6;
  let currentPage = 1;

  const categories = ["Tất cả", ...Array.from(new Set(newsData.map((n) => n.category)))];
  categorySelect.innerHTML = categories
    .map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)
    .join("");

  if (window.Choices) {
    categoryChoices = new window.Choices(categorySelect, {
      searchEnabled: false,
      itemSelectText: "",
      shouldSort: false,
      allowHTML: false,
      position: "bottom",
    });
  }

  function getFiltered() {
    const cat = categoryChoices ? String(categoryChoices.getValue(true) || "Tất cả") : categorySelect.value;
    const q = (searchInput.value || "").trim().toLowerCase();

    return newsData.filter((n) => {
      const okCat = cat === "Tất cả" || n.category === cat;
      const okQ = !q || n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }

  function renderPagination(totalItems) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    currentPage = Math.min(currentPage, totalPages);

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
      .map(
        (i) => `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" data-page="${i}" aria-label="Trang ${i}">${i}</a>
      </li>
    `,
      )
      .join("");

    pagination.innerHTML = `
      <nav aria-label="Điều hướng trang">
        <ul class="pagination pagination-dark justify-content-center mb-0">
          <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" data-prev="1" aria-label="Trang trước">‹</a>
          </li>
          ${pages}
          <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="#" data-next="1" aria-label="Trang sau">›</a>
          </li>
        </ul>
      </nav>
    `;

    pagination.querySelectorAll("a.page-link").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const p = a.dataset.page;
        if (p) currentPage = Number(p);
        if (a.dataset.prev) currentPage = Math.max(1, currentPage - 1);
        if (a.dataset.next) currentPage = Math.min(totalPages, currentPage + 1);
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function render() {
    const filtered = getFiltered();
    const start = (currentPage - 1) * pageSize;

    renderNewsCards("news-grid", filtered.slice(start, start + pageSize));
    renderPagination(filtered.length);
    if (countEl) countEl.textContent = `${filtered.length} kết quả`;
  }

  categorySelect.addEventListener("change", () => {
    currentPage = 1;
    render();
  });
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    render();
  });

  render();
}
