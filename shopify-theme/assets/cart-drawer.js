/**
 * AGNI FORGED WHEELS - Cart Drawer & Line Item Properties Manager
 * Manages the slide-out cart drawer, vehicle fitment metadata, and checkout handoff.
 */

window.AgniCart = (function() {
  let cart = {
    items: [
      {
        id: 'agni-af01-set',
        title: 'AGNI AF-01 Monoblock Set (x4)',
        price: 4600,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=400&q=80',
        properties: {
          'Vehicle': 'Porsche 911 GT3 (992) (2024)',
          'Trim': 'GT3 Standard / Touring (Centerlock)',
          'Wheel Model': 'AF-01',
          'Finish': 'Satin Charcoal',
          'Fitment Status': 'VERIFIED',
          'Front Spec': '20" 9.5J ET46',
          'Rear Spec': '21" 12.0J ET45',
          'Render Reference ID': 'AGNI-GARAGE-992GT3-01'
        }
      }
    ]
  };

  const backdrop = document.getElementById('AgniCartBackdrop');
  const drawer = document.getElementById('AgniCartDrawer');

  function init() {
    render();
    bindEvents();
  }

  function bindEvents() {
    document.querySelectorAll('[data-action="open-cart"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer();
      });
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeDrawer);
    }

    const closeBtn = document.querySelector('.btn-close-cart');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeDrawer);
    }
  }

  function openDrawer() {
    if (backdrop && drawer) {
      backdrop.classList.add('is-open');
      drawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (backdrop && drawer) {
      backdrop.classList.remove('is-open');
      drawer.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  function addItem(item) {
    const existingIndex = cart.items.findIndex(i => i.id === item.id && i.properties['Vehicle'] === item.properties['Vehicle']);
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += (item.quantity || 1);
    } else {
      cart.items.push({
        id: item.id,
        title: item.title,
        price: item.price || 4400,
        quantity: item.quantity || 1,
        image: item.image || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=400&q=80',
        properties: item.properties || {}
      });
    }
    render();
  }

  function removeItem(index) {
    cart.items.splice(index, 1);
    render();
  }

  function updateQuantity(index, delta) {
    cart.items[index].quantity += delta;
    if (cart.items[index].quantity <= 0) {
      removeItem(index);
    } else {
      render();
    }
  }

  function getSubtotal() {
    return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  function render() {
    const itemsContainer = document.querySelector('.cart-drawer-items');
    const countBadge = document.querySelector('.cart-count-badge');
    const subtotalEl = document.querySelector('.cart-subtotal-val');

    const totalCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    if (countBadge) countBadge.textContent = totalCount;

    if (subtotalEl) {
      subtotalEl.textContent = `$${getSubtotal().toLocaleString()}`;
    }

    if (!itemsContainer) return;

    if (cart.items.length === 0) {
      itemsContainer.innerHTML = `
        <div style="text-align:center; padding: 3rem 1rem; color: var(--color-text-secondary);">
          <p style="font-family: var(--font-mono); font-size: 0.85rem; margin-bottom: 1.5rem;">YOUR FACTORY BUILD QUEUE IS EMPTY</p>
          <button class="btn-primary" data-action="open-ai-garage" style="width: 100%;">LAUNCH AI GARAGE</button>
        </div>
      `;
      return;
    }

    itemsContainer.innerHTML = cart.items.map((item, idx) => `
      <div class="cart-item">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.title}" />
        </div>
        <div class="cart-item-info">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div class="cart-item-title">${item.title}</div>
            <button class="btn-remove-item" onclick="AgniCart.removeItem(${idx})" style="color:var(--color-text-muted); font-size:0.75rem;">✕</button>
          </div>
          <div class="cart-item-props">
            <div><strong style="color:var(--color-accent);">VEHICLE:</strong> ${item.properties['Vehicle'] || 'Custom'}</div>
            <div><strong>FINISH:</strong> ${item.properties['Finish'] || 'Satin'}</div>
            <div><strong>FRONT:</strong> ${item.properties['Front Spec'] || '20x9.5'} | <strong>REAR:</strong> ${item.properties['Rear Spec'] || '21x12'}</div>
            <div style="margin-top:4px;">
              <span class="${item.properties['Fitment Status'] === 'VERIFIED' ? 'badge-verified' : 'badge-unverified'}" style="font-size:0.65rem; padding: 2px 6px;">
                ${item.properties['Fitment Status'] === 'VERIFIED' ? '✓ VERIFIED FITMENT' : '⚠ REVIEW PENDING'}
              </span>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem;">
            <div style="font-family:var(--font-mono); font-size:0.85rem; font-weight:700;">$${(item.price * item.quantity).toLocaleString()}</div>
            <div style="display:flex; align-items:center; gap:0.5rem; font-family:var(--font-mono); font-size:0.75rem;">
              <button onclick="AgniCart.updateQuantity(${idx}, -1)" style="color:#aaa; padding:2px 6px; border:1px solid #333;">-</button>
              <span>${item.quantity}</span>
              <button onclick="AgniCart.updateQuantity(${idx}, 1)" style="color:#aaa; padding:2px 6px; border:1px solid #333;">+</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    init,
    openDrawer,
    closeDrawer,
    addItem,
    removeItem,
    updateQuantity,
    getSubtotal
  };
})();

