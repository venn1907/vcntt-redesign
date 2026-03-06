export async function inject(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;

  const res = await fetch(url);
  if (!res.ok) {
    el.innerHTML = `<div class="container py-3 text-danger">
      Failed to load ${url}. Run with a local server.
    </div>`;
    return;
  }
  el.innerHTML = await res.text();
}
