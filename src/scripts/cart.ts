import type { VintageHallApp as App } from './app';
import { $ } from './dom-utils';
import { ICON_PATHS } from '../data/products';
import { UI } from '../data/i18n';
import type { Category, Lang } from '../types';

declare module './app' {
  interface VintageHallApp {
  addToCart(id: number): void;
  changeQty(id: number, delta: number): void;
  removeItem(id: number): void;
  renderCart(): void;
  openDrawer(): void;
  closeDrawer(): void;
  openCheckout(): void;
  fillRequiredLabel(): string;
  submitOrder(): void;
  finishOrder(): void;
  closeCheckout(): void;
  catLabel(category: Category): string;
  }
}

export const cartMethods = {
  addToCart(this: App, id: number): void {
    const existing = this.cart.find(c => c.id === id);
    const prod = this.products.find(p => p.id === id);
    if (!prod) return;
    if (existing) { existing.qty++; }
    else {
      this.cart.push({ id, qty: 1, icon: prod.icon, price: prod.price, custom: prod.custom });
    }
    this.renderCart();
    this.openDrawer();
    const tr = this.getProductText(prod);
    this.showToast(`${tr.name} — <span class="mono">${(prod.price ?? 0).toLocaleString('uk-UA')} ₴</span>`);
  },
  changeQty(this: App, id: number, delta: number): void {
    const item = this.cart.find(c => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) this.cart = this.cart.filter(c => c.id !== id);
    this.renderCart();
  },
  removeItem(this: App, id: number): void {
    this.cart = this.cart.filter(c => c.id !== id);
    this.renderCart();
  },
  renderCart(this: App): void {
    this.saveCart();
    const itemsEl = $('cartItems');
    const footEl = $('cartFoot');
    const totalQty = this.cart.reduce((s, c) => s + c.qty, 0);
    $('cartCount').textContent = String(totalQty);

    if (this.cart.length === 0) {
      itemsEl.innerHTML = `<div class="drawer-empty">${this.t('cart_empty')}</div>`;
      footEl.innerHTML = '';
      return;
    }

    itemsEl.innerHTML = this.cart.map(c => {
      const tr = this.getProductText(c);
      return `
      <div class="cart-row">
        <div class="cart-row-media"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.4">${ICON_PATHS[c.icon]}</svg></div>
        <div class="cart-row-info">
          <div class="cart-row-name">${tr.name}</div>
          <div class="cart-row-price mono">${(c.price ?? 0).toLocaleString('uk-UA')} ₴</div>
          <div class="qty-control">
            <button data-action="qty-dec" data-id="${c.id}">−</button>
            <span>${c.qty}</span>
            <button data-action="qty-inc" data-id="${c.id}">+</button>
          </div>
          <button class="cart-remove" data-action="remove-item" data-id="${c.id}">${this.t('cart_remove')}</button>
        </div>
      </div>`;
    }).join('');

    const total = this.cart.reduce((s, c) => s + (c.price ?? 0) * c.qty, 0);
    footEl.innerHTML = `
      <div class="drawer-total"><span>${this.t('cart_total')}</span><span class="mono">${total.toLocaleString('uk-UA')} ₴</span></div>
      <button class="btn btn-primary checkout-btn" data-action="open-checkout">${this.t('cart_checkout')}</button>
    `;
  },
  openDrawer(this: App): void {
    $('cartDrawer').classList.add('active');
    $('overlay').classList.add('active');
  },
  closeDrawer(this: App): void {
    $('cartDrawer').classList.remove('active');
    $('overlay').classList.remove('active');
  },
  openCheckout(this: App): void {
    if (this.cart.length === 0) return;
    const total = this.cart.reduce((s, c) => s + (c.price ?? 0) * c.qty, 0);
    $('checkoutCard').innerHTML = `
      <h3>${this.t('checkout_title')}</h3>
      <div class="sub">${this.t('checkout_sub')}<span class="mono">${total.toLocaleString('uk-UA')} ₴</span></div>
      <div class="field"><label>${this.t('field_name')}</label><input id="ckName"></div>
      <div class="field"><label>${this.t('field_phone')}</label><input id="ckPhone" placeholder="+380 ..."></div>
      <div class="field"><label>${this.t('field_delivery')}</label>
        <select id="ckDelivery">
          <option>${this.t('opt_np')}</option>
          <option>${this.t('opt_courier')}</option>
          <option>${this.t('opt_pickup')}</option>
        </select>
      </div>
      <div class="field"><label>${this.t('field_address')}</label><input id="ckAddress"></div>
      <div class="pay-note">${this.t('pay_note')}</div>
      <div class="modal-actions">
        <button class="btn btn-ghost" data-action="close-checkout">${this.t('btn_cancel')}</button>
        <button class="btn btn-primary" data-action="submit-order">${this.t('btn_confirm')}</button>
      </div>
    `;
    $('checkoutModal').classList.add('active');
  },
  fillRequiredLabel(this: App): string {
    const map: Record<Lang, string> = {
      en: 'Please fill in your name and phone.', pl: 'Podaj imię i telefon.',
      ru: 'Пожалуйста, заполните имя и телефон.', uk: "Будь ласка, заповніть ім'я та телефон."
    };
    return map[this.currentLang];
  },
  submitOrder(this: App): void {
    const name = $<HTMLInputElement>('ckName').value.trim();
    const phone = $<HTMLInputElement>('ckPhone').value.trim();
    if (!name || !phone) { alert(this.fillRequiredLabel()); return; }

    if (this.currentUser) {
      const total = this.cart.reduce((s, c) => s + (c.price ?? 0) * c.qty, 0);
      const itemNames = this.cart.map(c => this.getProductText(c).name).join(', ');
      this.purchaseHistory.unshift({ date: new Date().toLocaleDateString('uk-UA'), itemNames, total });
    }

    $('checkoutCard').innerHTML = `
      <div class="confirm-screen">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>
        <h3>${this.t('confirm_title')}</h3>
        <p class="sub">${this.t('confirm_sub')}${phone}${this.t('confirm_sub2')}</p>
        <button class="btn btn-primary" style="margin-top:10px; width:100%; justify-content:center;" data-action="finish-order">${this.t('btn_done')}</button>
      </div>
    `;
  },
  finishOrder(this: App): void {
    this.cart = [];
    this.renderCart();
    this.closeCheckout();
    this.closeDrawer();
  },
  closeCheckout(this: App): void {
    $('checkoutModal').classList.remove('active');
    $('checkoutCard').classList.remove('wide');
    $('checkoutCard').classList.remove('lot-form-card');
    this.closeLightbox();
    this.editingLotId = null;
    this.currentLotDetailId = null;
  },
  catLabel(this: App, category: Category): string {
    const map: Record<Category, keyof typeof UI['uk']> = {
      decor: 'tab_decor', numismatics: 'tab_numismatics', porcelain: 'tab_porcelain', special: 'tab_vip',
      silver: 'tab_silver', painting: 'tab_painting', militaria: 'tab_militaria', jewelry: 'tab_jewelry',
      clocks: 'tab_clocks', glass: 'tab_glass', philately: 'tab_philately', books: 'tab_books'
    };
    return this.t(map[category]);
  },
};
