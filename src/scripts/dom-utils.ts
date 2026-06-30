/** Looks up an element by id, throwing if it's missing — used throughout the app instead of
    `document.getElementById` directly so a missing element fails loudly during development. */
export function $<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Expected element #${id} to exist`);
  return el as T;
}
