export function setActiveNav() {
  const page = document.body?.dataset?.page;
  if (!page) return;

  document.querySelectorAll("[data-nav]").forEach((a) => {
    const active = a.dataset.nav === page;
    a.classList.toggle("is-active", active);
    if (active) a.setAttribute("aria-current", "page");
  });
}

export function setFooterYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

