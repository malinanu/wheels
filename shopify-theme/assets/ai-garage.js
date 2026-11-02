/**
 * AGNI FORGED WHEELS - AI Garage Controller
 * Manages the photorealistic before/after visualizer, custom rendering states,
 * and vehicle fitment integration.
 */

document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('AgniAiGarageModal');
  if (!modal) return;

  // State
  let currentWheel = 'AF-03';
  let currentFinish = 'Ferrari Bronze Spec';
  let currentVehicle = window.AgniFitmentEngine ? window.AgniFitmentEngine.getSelectedVehicle() : { make: 'Ferrari', model: '812 GTS / Superfast', year: '2024' };
  let isDraggingSplit = false;
  let sliderPosition = 50; // percentage
  let isSimulatingInference = false;

  // Elements
  const splitContainer = modal.querySelector('.split-slider-container');
  const splitAfterLayer = modal.querySelector('.split-layer.after');
  const splitDivider = modal.querySelector('.split-divider');
  const wheelButtons = modal.querySelectorAll('.wheel-thumb-btn');
  const finishButtons = modal.querySelectorAll('.finish-swatch-btn');
  const statusVehicleName = modal.querySelector('.garage-vehicle-name');
  const statusVehicleSpecs = modal.querySelector('.garage-vehicle-specs');
  const statusFitmentBadge = modal.querySelector('.garage-fitment-badge');
  const activeWheelTitle = modal.querySelector('.garage-active-wheel-title');
  const activeWheelBadge = modal.querySelector('.garage-active-wheel-badge');
  const activeWheelSpecs = modal.querySelector('.garage-active-wheel-specs');
  const activeFinishLabel = modal.querySelector('.garage-active-finish-label');
  const setPriceEl = modal.querySelector('.garage-set-price');
  const btnAddToCart = modal.querySelector('.btn-garage-add-to-cart');
  const fileInput = modal.querySelector('#garage-file-upload');
  const previewContainer = modal.querySelector('.garage-preview-active');
  const placeholderContainer = modal.querySelector('.garage-placeholder-state');
  const presetButtons = modal.querySelectorAll('.demo-car-preset');

  // Open/Close triggers
  document.querySelectorAll('[data-action="open-ai-garage"]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const preselectedWheel = trigger.getAttribute('data-wheel-code');
      if (preselectedWheel) {
        selectWheel(preselectedWheel);
      }
      openModal();
    });
  });

  const closeBtn = modal.querySelector('.btn-close-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  function openModal() {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    updateFitmentDisplay();
    updateWheelDetails();
    showActivePreview();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Wheel selection
  wheelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-wheel');
      selectWheel(code);
    });
  });

  function selectWheel(code) {
    currentWheel = code;
    wheelButtons.forEach(b => b.classList.toggle('is-active', b.getAttribute('data-wheel') === code));
    updateWheelDetails();
    triggerRenderUpdate();
  }

  function updateWheelDetails() {
    if (!window.AgniFitmentEngine) return;
    const wheel = window.AgniFitmentEngine.getWheelByCode(currentWheel);
    if (!wheel) return;
    if (activeWheelTitle) activeWheelTitle.textContent = `AGNI ${wheel.name}`;
    if (activeWheelBadge) activeWheelBadge.textContent = wheel.construction.toUpperCase();
    if (activeWheelSpecs) activeWheelSpecs.textContent = `${wheel.weightFrom} • ${wheel.diameters} • ${wheel.brakes}`;
    if (setPriceEl) setPriceEl.textContent = `$${wheel.basePrice.toLocaleString()}`;
    if (btnAddToCart) {
      btnAddToCart.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>ADD TO PRODUCTION QUEUE — $${wheel.basePrice.toLocaleString()}</span>
      `;
    }
  }

  // Finish selection
  finishButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const finish = btn.getAttribute('data-finish');
      selectFinish(finish);
    });
  });

  function selectFinish(finish) {
    currentFinish = finish;
    finishButtons.forEach(b => b.classList.toggle('is-active', b.getAttribute('data-finish') === finish));
    if (activeFinishLabel) activeFinishLabel.innerHTML = `<span>FINISH:</span> <strong style="color: #ffffff; margin-left: 0.25rem;">${finish.toUpperCase()}</strong>`;
    triggerRenderUpdate();
  }

  // Vehicle Presets
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const make = btn.getAttribute('data-make');
      const model = btn.getAttribute('data-model');
      const year = btn.getAttribute('data-year');
      const trim = btn.getAttribute('data-trim');
      if (window.AgniFitmentEngine) {
        window.AgniFitmentEngine.setVehicle(make, model, year, trim);
      }
      presetButtons.forEach(b => b.classList.toggle('active', b === btn));
      triggerRenderUpdate();
    });
  });

  // Re-render simulation with tactile loader
  function triggerRenderUpdate() {
    if (isSimulatingInference) return;
    isSimulatingInference = true;

    const overlay = modal.querySelector('.rendering-feedback-overlay');
    if (overlay) overlay.style.opacity = '1';

    setTimeout(() => {
      if (overlay) overlay.style.opacity = '0';
      isSimulatingInference = false;
      updateFitmentDisplay();
      updateRenderVisuals();
    }, 400);
  }

  function updateFitmentDisplay() {
    if (!window.AgniFitmentEngine) return;
    const v = window.AgniFitmentEngine.getSelectedVehicle();
    currentVehicle = v;
    if (statusVehicleName) {
      statusVehicleName.textContent = `${v.make} ${v.model} (${v.year})`;
    }
    if (statusVehicleSpecs && v.fitmentData) {
      statusVehicleSpecs.textContent = `Front: ${v.fitmentData.front.diameter} ${v.fitmentData.front.width} ${v.fitmentData.front.offset} | Rear: ${v.fitmentData.rear.diameter} ${v.fitmentData.rear.width} ${v.fitmentData.rear.offset} (${v.fitmentData.brakes})`;
    }
    if (statusFitmentBadge) {
      if (v.status === 'VERIFIED') {
        statusFitmentBadge.className = 'badge-verified';
        statusFitmentBadge.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> <span>VERIFIED FITMENT</span>`;
      } else {
        statusFitmentBadge.className = 'badge-unverified';
        statusFitmentBadge.textContent = `Fitment Review Required`;
      }
    }

    // Sync active preset chip
    presetButtons.forEach(b => {
      const isMatch = b.getAttribute('data-make').toLowerCase() === v.make.toLowerCase() &&
                      b.getAttribute('data-model').toLowerCase().includes(v.model.toLowerCase().split(' ')[0]);
      b.classList.toggle('active', isMatch);
    });
  }

  function updateRenderVisuals() {
    const afterBadge = modal.querySelector('.split-badge.badge-right');
    if (afterBadge) {
      afterBadge.textContent = `AGNI ${currentWheel} • ${currentFinish.toUpperCase()}`;
    }
  }

  function showActivePreview() {
    if (placeholderContainer) placeholderContainer.style.display = 'none';
    if (previewContainer) previewContainer.style.display = 'block';
  }

  // File Upload Handlers
  if (fileInput) {
    fileInput.addEventListener('change', handleFile);
  }

  function handleFile() {
    const file = fileInput.files[0];
    if (!file) return;
    showActivePreview();
    triggerRenderUpdate();
  }

  // Split Slider Touch & Mouse Logic (Pixel-Perfect Clip-Path Architecture)
  function setPosition(xPercent) {
    sliderPosition = Math.max(0, Math.min(100, xPercent));
    if (splitAfterLayer) {
      splitAfterLayer.style.clipPath = `inset(0 0 0 ${sliderPosition}%)`;
      splitAfterLayer.style.webkitClipPath = `inset(0 0 0 ${sliderPosition}%)`;
    }
    if (splitDivider) {
      splitDivider.style.left = `${sliderPosition}%`;
    }
  }

  if (splitContainer && splitAfterLayer && splitDivider) {
    function onPointerMove(e) {
      if (!isDraggingSplit) return;
      const rect = splitContainer.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const xOffset = clientX - rect.left;
      const percent = (xOffset / rect.width) * 100;
      setPosition(percent);
    }

    function startDragging(e) {
      isDraggingSplit = true;
      splitContainer.classList.add('is-dragging');
      onPointerMove(e);
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('touchmove', onPointerMove, { passive: false });
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchend', stopDragging);
    }

    function stopDragging() {
      isDraggingSplit = false;
      splitContainer.classList.remove('is-dragging');
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchend', stopDragging);
    }

    splitContainer.addEventListener('mousedown', startDragging);
    splitContainer.addEventListener('touchstart', startDragging, { passive: true });
    // Initial position
    setPosition(50);
  }

  // Quick Comparison Buttons in Modal
  modal.querySelectorAll('[data-action="garage-split"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseFloat(btn.getAttribute('data-val'));
      setPosition(val);
      modal.querySelectorAll('[data-action="garage-split"]').forEach(b => b.classList.toggle('active', b === btn));
    });
  });

  // Add To Cart with Line Item Properties
  if (btnAddToCart) {
    btnAddToCart.addEventListener('click', function() {
      const v = window.AgniFitmentEngine ? window.AgniFitmentEngine.getSelectedVehicle() : currentVehicle;
      const wheel = window.AgniFitmentEngine ? window.AgniFitmentEngine.getWheelByCode(currentWheel) : { code: currentWheel, name: currentWheel, basePrice: 4396 };
      const lineItemProperties = {
        'Vehicle': `${v.make} ${v.model} (${v.year})`,
        'Trim': v.trim || 'Standard',
        'Wheel Model': wheel.name || currentWheel,
        'Finish': currentFinish,
        'Fitment Status': v.status || 'VERIFIED',
        'Front Spec': v.fitmentData ? `${v.fitmentData.front.diameter} ${v.fitmentData.front.width} ${v.fitmentData.front.offset}` : '21x10.0J ET44',
        'Rear Spec': v.fitmentData ? `${v.fitmentData.rear.diameter} ${v.fitmentData.rear.width} ${v.fitmentData.rear.offset}` : '22x12.5J ET38',
        'Render Reference ID': `AGNI-GARAGE-${Date.now().toString(36).toUpperCase()}`
      };

      if (window.AgniCart) {
        window.AgniCart.addItem({
          id: `agni-${currentWheel.toLowerCase()}-set`,
          title: `AGNI ${wheel.name || currentWheel} Set (x4)`,
          price: wheel.basePrice || 4396,
          finish: currentFinish,
          properties: lineItemProperties
        });
        closeModal();
        window.AgniCart.openDrawer();
      } else {
        alert(`Setup added to order pipeline!\nWheel: ${wheel.name}\nFinish: ${currentFinish}\nVehicle: ${lineItemProperties.Vehicle}`);
      }
    });
  }
});

