import type { VintageHallApp as App } from './app';
import { SEARCH_INDEX, type SearchItem } from '../data/search-index';
import { $ } from './dom-utils';

/** Site-wide quick search (Ctrl/Cmd+K) — distinct from the catalog-only search box in the
    header, which only filters lots on /catalog. This one jumps anywhere on the site: pages,
    homepage sections, categories, sellers and individual lots, via the static index built in
    src/data/search-index.ts. Only wired up on pages that load the full app bundle (see
    LiteHeader.astro for why /lot, /category and /seller intentionally opt out). */

declare module './app' {
  interface VintageHallApp {
    initSiteSearch(): void;
    openSiteSearch(): void;
    closeSiteSearch(): void;
    renderSiteSearchResults(query: string): void;
    setSiteSearchActive(index: number): void;
  }
}

let searchResults: SearchItem[] = [];
let searchActiveIndex = -1;
let searchLastFocused: HTMLElement | null = null;

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlight(text: string, query: string): string {
  if (!query) return escapeHtml(text);
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return escapeHtml(text);
  return (
    escapeHtml(text.slice(0, idx)) +
    '<mark>' + escapeHtml(text.slice(idx, idx + query.length)) + '</mark>' +
    escapeHtml(text.slice(idx + query.length))
  );
}

function runSearch(query: string): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return SEARCH_INDEX.filter((i) => i.group === 'Сторінки' || i.group === 'Розділи головної').slice(0, 8);
  }
  return SEARCH_INDEX
    .map((item) => {
      const titleHit = item.title.toLowerCase().indexOf(q);
      const subHit = item.subtitle ? item.subtitle.toLowerCase().indexOf(q) : -1;
      if (titleHit === -1 && subHit === -1) return null;
      const score = titleHit === 0 ? 0 : titleHit > -1 ? 1 : 2;
      return { item, score };
    })
    .filter((r): r is { item: SearchItem; score: number } => r !== null)
    .sort((a, b) => a.score - b.score)
    .slice(0, 8)
    .map((r) => r.item);
}

export const searchMethods = {
  initSiteSearch(this: App): void {
    const toggle = document.getElementById('siteSearchBtn');
    const overlay = document.getElementById('siteSearchOverlay');
    if (!toggle || !overlay) return;

    toggle.addEventListener('click', () => this.openSiteSearch());
    document.getElementById('siteSearchBtnMobile')?.addEventListener('click', () => {
      this.closeSitemap();
      this.openSiteSearch();
    });
    $('siteSearchClose').addEventListener('click', () => this.closeSiteSearch());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeSiteSearch();
    });
    $<HTMLInputElement>('siteSearchInput').addEventListener('input', (e) => {
      this.renderSiteSearchResults((e.target as HTMLInputElement).value);
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        overlay.classList.contains('open') ? this.closeSiteSearch() : this.openSiteSearch();
        return;
      }
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') {
        this.closeSiteSearch();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (searchResults.length) this.setSiteSearchActive((searchActiveIndex + 1) % searchResults.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (searchResults.length) this.setSiteSearchActive((searchActiveIndex - 1 + searchResults.length) % searchResults.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const target = searchResults[searchActiveIndex];
        if (target) window.location.href = target.href;
      }
    });
  },

  openSiteSearch(this: App): void {
    const input = $<HTMLInputElement>('siteSearchInput');
    searchLastFocused = document.activeElement as HTMLElement;
    $('siteSearchOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    input.value = '';
    this.renderSiteSearchResults('');
    input.focus();
  },

  closeSiteSearch(this: App): void {
    $('siteSearchOverlay').classList.remove('open');
    document.body.style.overflow = '';
    (searchLastFocused ?? document.getElementById('siteSearchBtn'))?.focus();
  },

  renderSiteSearchResults(this: App, query: string): void {
    searchResults = runSearch(query);
    searchActiveIndex = searchResults.length ? 0 : -1;
    const list = $('siteSearchResults');
    list.innerHTML = '';
    $('siteSearchEmpty').classList.toggle('hidden', searchResults.length > 0 || !query.trim());

    let lastGroup = '';
    searchResults.forEach((item, i) => {
      if (item.group !== lastGroup) {
        const label = document.createElement('div');
        label.className = 'search-group-label';
        label.textContent = item.group;
        list.appendChild(label);
        lastGroup = item.group;
      }
      const a = document.createElement('a');
      a.href = item.href;
      a.id = `search-result-${i}`;
      a.setAttribute('role', 'option');
      a.className = 'search-result' + (i === searchActiveIndex ? ' active' : '');
      a.innerHTML =
        `<div class="search-result-title">${highlight(item.title, query)}</div>` +
        (item.subtitle ? `<div class="search-result-sub">${escapeHtml(item.subtitle)}</div>` : '');
      a.addEventListener('mouseenter', () => this.setSiteSearchActive(i));
      list.appendChild(a);
    });
    $<HTMLInputElement>('siteSearchInput').setAttribute(
      'aria-activedescendant',
      searchActiveIndex > -1 ? `search-result-${searchActiveIndex}` : ''
    );
  },

  setSiteSearchActive(this: App, i: number): void {
    searchActiveIndex = i;
    document.querySelectorAll('#siteSearchResults a').forEach((a, idx) => a.classList.toggle('active', idx === searchActiveIndex));
    $<HTMLInputElement>('siteSearchInput').setAttribute(
      'aria-activedescendant',
      searchActiveIndex > -1 ? `search-result-${searchActiveIndex}` : ''
    );
  },
};
