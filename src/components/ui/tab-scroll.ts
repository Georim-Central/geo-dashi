const PAGE_SCROLL_ROOT_SELECTOR = '[data-page-scroll-root]';
const SCROLLABLE_OVERFLOW_VALUES = new Set(['auto', 'scroll', 'overlay']);

function findNearestScrollableAncestor(node: HTMLElement | null): HTMLElement | null {
  let current = node?.parentElement ?? null;

  while (current) {
    const styles = window.getComputedStyle(current);
    if (SCROLLABLE_OVERFLOW_VALUES.has(styles.overflowY)) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

export function scrollTabPageToTop(node: HTMLElement | null) {
  if (typeof window === 'undefined' || !node) {
    return;
  }

  const pageScrollRoot = node.closest(PAGE_SCROLL_ROOT_SELECTOR);
  const scrollTarget =
    pageScrollRoot instanceof HTMLElement ? pageScrollRoot : findNearestScrollableAncestor(node);

  if (scrollTarget) {
    scrollTarget.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
