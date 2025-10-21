(function(){
  const scriptEl = document.currentScript;
  const baseHref = scriptEl && scriptEl.src
    ? scriptEl.src.substring(0, scriptEl.src.lastIndexOf('/') + 1)
    : '';
  const CSS_ID = 'its-wave-chat-styles';
  const CSS_FILE = 'Chat.css';

  function readScriptAttr(name){
    if(!scriptEl) return null;
    const raw = scriptEl.getAttribute(name);
    if(raw == null) return null;
    const trimmed = raw.trim();
    if(!trimmed || trimmed.toLowerCase() === 'null') return null;
    return trimmed;
  }

  function normalizeColor(value, fallback){
    const option = document.createElement('option');
    option.style.color = '';
    option.style.color = fallback;
    const fallbackColor = option.style.color || fallback;
    if(value){
      option.style.color = '';
      option.style.color = value;
      if(option.style.color){
        return option.style.color;
      }
    }
    return fallbackColor;
  }

  function colorToRgbComponents(color, fallback){
    if(!color){
      return fallback;
    }
    const normalized = color.trim().toLowerCase();
    const rgbMatch = normalized.match(/rgba?\(([^)]+)\)/);
    if(rgbMatch){
      const parts = rgbMatch[1].split(',').slice(0, 3).map((part)=>{
        const num = parseFloat(part.trim());
        return Number.isFinite(num) ? Math.round(num) : 0;
      });
      if(parts.length === 3 && parts.every((num)=>Number.isFinite(num))){
        return parts.join(', ');
      }
    }
    if(normalized.startsWith('#')){
      let hex = normalized.slice(1);
      if(hex.length === 3){
        hex = hex.split('').map((ch)=>ch + ch).join('');
      }
      if(hex.length === 6){
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        if([r, g, b].every((num)=>Number.isFinite(num))){
          return `${r}, ${g}, ${b}`;
        }
      }
    }
    return fallback;
  }

  function pickContrastColor(rgbString, lightColor, darkColor){
    if(!rgbString){
      return lightColor;
    }
    const parts = rgbString.split(',').map((part)=>parseInt(part.trim(), 10));
    if(parts.length !== 3 || parts.some((num)=>!Number.isFinite(num))){
      return lightColor;
    }
    const [r, g, b] = parts;
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance > 0.6 ? darkColor : lightColor;
  }

  const chatUrlFromAttr = readScriptAttr('data-chat-url');
  const CHAT_URL = chatUrlFromAttr ? chatUrlFromAttr : null;
  const hasChatUrl = !!CHAT_URL;
  const CONTACT_PHONE = readScriptAttr('data-contact-phone');
  const CONTACT_EMAIL = readScriptAttr('data-contact-email');
  const primaryColorAttr = readScriptAttr('data-primary-color');
  const secondaryColorAttr = readScriptAttr('data-secondary-color');
  const textPrimaryAttr = readScriptAttr('data-text-primary-color');
  const textSecondaryAttr = readScriptAttr('data-text-secondary-color');
  const pillTextAttr = readScriptAttr('data-pill-text');
  const DEFAULT_PRIMARY = '#143382';
  const DEFAULT_SECONDARY = '#f1b800';
  const DEFAULT_PRIMARY_RGB = '20, 51, 130';
  const DEFAULT_SECONDARY_RGB = '241, 184, 0';
  const DEFAULT_TEXT_PRIMARY = '#0e2541';
  const DEFAULT_TEXT_SECONDARY = '#2c5cc5';
  const PRIMARY_COLOR = normalizeColor(primaryColorAttr, DEFAULT_PRIMARY);
  const SECONDARY_COLOR = normalizeColor(secondaryColorAttr, DEFAULT_SECONDARY);
  const PRIMARY_COLOR_RGB = colorToRgbComponents(PRIMARY_COLOR, DEFAULT_PRIMARY_RGB);
  const SECONDARY_COLOR_RGB = colorToRgbComponents(SECONDARY_COLOR, DEFAULT_SECONDARY_RGB);
  const PRIMARY_CONTRAST_COLOR = pickContrastColor(PRIMARY_COLOR_RGB, '#ffffff', '#0e1c40');
  const SECONDARY_CONTRAST_COLOR = pickContrastColor(SECONDARY_COLOR_RGB, '#ffffff', '#0e2541');
  const TEXT_PRIMARY_COLOR = normalizeColor(textPrimaryAttr, DEFAULT_TEXT_PRIMARY);
  const TEXT_SECONDARY_COLOR = normalizeColor(textSecondaryAttr, DEFAULT_TEXT_SECONDARY);
  const PILL_TEXT = pillTextAttr || null;

  function buildTelHref(phone){
    if(!phone) return null;
    const trimmed = phone.trim();
    let normalized = '';
    let hasPlus = false;
    for(const ch of trimmed){
      if(ch === '+' && !hasPlus){
        normalized += '+';
        hasPlus = true;
      } else if(ch >= '0' && ch <= '9'){
        normalized += ch;
      }
    }
    if(!normalized){
      return `tel:${encodeURIComponent(trimmed)}`;
    }
    return `tel:${normalized}`;
  }

  function buildFallbackContent(container){
    if(!container) return;
    container.textContent = '';
    container.setAttribute('role', 'alert');

    const title = document.createElement('p');
    title.className = 'its-chat-fallback__title';
    title.textContent = 'Sorry, we can’t open chat right now.';
    container.appendChild(title);

    const body = document.createElement('p');
    body.className = 'its-chat-fallback__body';
    if(CONTACT_PHONE || CONTACT_EMAIL){
      body.textContent = 'You can still reach our team using one of the options below:';
    } else {
      body.textContent = 'Please try again in a few moments or reach out through your usual channels.';
    }
    container.appendChild(body);

    if(CONTACT_PHONE || CONTACT_EMAIL){
      const list = document.createElement('ul');
      list.className = 'its-chat-fallback__list';

      if(CONTACT_PHONE){
        const item = document.createElement('li');
        item.className = 'its-chat-fallback__item';
        item.textContent = 'Call us at ';
        const link = document.createElement('a');
        link.className = 'its-chat-fallback__link';
        link.href = buildTelHref(CONTACT_PHONE);
        link.textContent = CONTACT_PHONE;
        item.appendChild(link);
        list.appendChild(item);
      }

      if(CONTACT_EMAIL){
        const item = document.createElement('li');
        item.className = 'its-chat-fallback__item';
        item.textContent = 'Email us at ';
        const link = document.createElement('a');
        link.className = 'its-chat-fallback__link';
        link.href = `mailto:${CONTACT_EMAIL}`;
        link.textContent = CONTACT_EMAIL;
        item.appendChild(link);
        list.appendChild(item);
      }

      container.appendChild(list);
    }
  }

  function showFallback(container, frame){
    if(!container || !frame) return;
    buildFallbackContent(container);
    container.hidden = false;
    container.removeAttribute('hidden');
    frame.hidden = true;
    frame.setAttribute('aria-hidden', 'true');
  }

  function hideFallback(container, frame){
    if(!container || !frame) return;
    container.hidden = true;
    if(!container.hasAttribute('hidden')){
      container.setAttribute('hidden', '');
    }
    frame.hidden = false;
    frame.removeAttribute('aria-hidden');
  }

  function applyThemeColors(){
    const target = document.documentElement;
    if(!target) return;
    target.style.setProperty('--its-primary-color', PRIMARY_COLOR);
    target.style.setProperty('--its-primary-color-rgb', PRIMARY_COLOR_RGB);
    target.style.setProperty('--its-secondary-color', SECONDARY_COLOR);
    target.style.setProperty('--its-secondary-color-rgb', SECONDARY_COLOR_RGB);
    target.style.setProperty('--its-primary-contrast-color', PRIMARY_CONTRAST_COLOR);
    target.style.setProperty('--its-secondary-contrast-color', SECONDARY_CONTRAST_COLOR);
    target.style.setProperty('--its-text-primary-color', TEXT_PRIMARY_COLOR);
    target.style.setProperty('--its-text-secondary-color', TEXT_SECONDARY_COLOR);
  }

  const MARKUP = `
<div id="itsChatLauncher" class="its-chat-launcher" aria-label="Open live chat" title="Chat with us">
  💬
  <span id="itsChatBadge" class="its-chat-badge" aria-hidden="true"></span>
</div>

<div id="itsChatPanel" class="its-chat-panel" role="dialog" aria-modal="true" aria-label="Live chat">
  <div class="its-drag-handle" aria-hidden="true"></div>
  <div class="its-peek-hint" aria-hidden="true">Swipe up to show chat</div>
  <div class="its-chat-controls" role="toolbar" aria-label="Chat controls">
    <button id="itsChatMinimize" class="its-chat-btn" title="Minimize" aria-label="Minimize">–</button>
    <button id="itsChatClose" class="its-chat-btn" title="Close" aria-label="Close">×</button>
  </div>
  <div class="its-chat-body">
    <iframe
      id="itsChatFrame"
      class="its-chat-iframe"
      title="Live chat"
      loading="lazy"
      scrolling="no"
      referrerpolicy="no-referrer-when-downgrade"
      allow="clipboard-read; clipboard-write">
    </iframe>
    <div id="itsChatFallback" class="its-chat-fallback" hidden></div>
  </div>
</div>
`;

  let initialized = false;

  function resolveAssetUrl(filename){
    if(baseHref){
      return baseHref + filename;
    }
    return filename;
  }

  function ensureStyles(){
    if(document.getElementById(CSS_ID)) return;
    const link = document.createElement('link');
    link.id = CSS_ID;
    link.rel = 'stylesheet';
    link.href = resolveAssetUrl(CSS_FILE);
    document.head.appendChild(link);
  }

  function injectMarkup(){
    if(document.getElementById('itsChatLauncher')) return;
    const template = document.createElement('template');
    template.innerHTML = MARKUP.trim();
    document.body.appendChild(template.content.cloneNode(true));
  }

  function init(){
    if(initialized) return;
    applyThemeColors();
    ensureStyles();
    injectMarkup();

    const $launcher = document.getElementById('itsChatLauncher');
    const $panel    = document.getElementById('itsChatPanel');
    const $frame    = document.getElementById('itsChatFrame');
    if(!$launcher || !$panel || !$frame) return;

    initialized = true;

    const $peekHint = $panel.querySelector('.its-peek-hint');
    const $close    = document.getElementById('itsChatClose');
    const $minimize = document.getElementById('itsChatMinimize');
    const $handle   = $panel.querySelector('.its-drag-handle');
    const $controls = $panel.querySelector('.its-chat-controls');
    const $fallback = document.getElementById('itsChatFallback');
    const $badge    = document.getElementById('itsChatBadge');

    let chatDisabled = !hasChatUrl;
    let loaded = false;
    let loadSucceeded = false;
    let endpointState = hasChatUrl ? 'pending' : 'fail'; // 'pending' | 'ok' | 'unknown' | 'fail'
    const PEEK_THRESHOLD = 120;
    const OPEN_THRESHOLD = 64;
    const CLOSE_PEEK_THRESHOLD = 28;

    function setVh(){
      document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
    }
    setVh();
    window.addEventListener('resize', ()=>{
      setVh();
      clampPanelToViewport();
    });

    function ensureLoaded(){
      if(chatDisabled || loaded) return;
      $frame.src = CHAT_URL;
      loaded = true;
    }

    const isPeek = () => $panel.getAttribute('data-peek') === 'true';
    const hideLauncher = () => { if($launcher) $launcher.dataset.hidden = 'true'; };
    const showLauncher = () => { if($launcher) delete $launcher.dataset.hidden; };
    const isPhone = ()=>{
      const narrowViewport = window.matchMedia('(max-width: 600px)').matches;
      const coarseLandscape = window.matchMedia('(pointer: coarse) and (max-height: 520px)').matches;
      return narrowViewport || coarseLandscape;
    };

    function updatePeekHint(peek){
      if(!$peekHint) return;
      if(chatDisabled){
        $peekHint.textContent = 'Chat unavailable';
        return;
      }
      if(peek){
        $peekHint.textContent = isPhone()
          ? 'Tap + or swipe up to reopen chat'
          : 'Chat minimized — click + to reopen';
      } else {
        $peekHint.textContent = 'Swipe up to show chat';
      }
    }

    function updateMinimizeButton(){
      if(!$minimize) return;
      if(chatDisabled){
        $minimize.style.display = 'none';
        return;
      }
      $minimize.style.display = '';
      const peek = isPeek();
      const label = peek ? 'Expand chat' : 'Minimize chat';
      $minimize.textContent = peek ? '+' : '–';
      $minimize.setAttribute('aria-label', label);
      $minimize.setAttribute('title', label);
    }

    function renderUnavailableState(reason){
      if(chatDisabled && endpointState === 'fail') return;
      chatDisabled = true;
      loaded = true;
      loadSucceeded = false;
      endpointState = 'fail';
      const errorValue = reason || 'unavailable';
      $panel.setAttribute('data-chat-error', errorValue);
      showFallback($fallback, $frame);
      updateMinimizeButton();
      updatePeekHint(isPeek());
    }

    updateMinimizeButton();

    if($badge){
      if(PILL_TEXT){
        $badge.textContent = PILL_TEXT;
      } else {
        $badge.remove();
      }
    }

    if(chatDisabled){
      renderUnavailableState('missing-url');
      return;
    }

    function clampPanelToViewport(padding = 16){
      if(!$panel) return;
      const rect = $panel.getBoundingClientRect();
      if(rect.width === 0 && rect.height === 0) return;
      const hasInlineLeft = $panel.style.left !== '';
      const hasInlineTop = $panel.style.top !== '';
      if(!hasInlineLeft && !hasInlineTop) return;
      const safe = Number.isFinite(padding) ? padding : 16;

      if(hasInlineLeft){
        const minLeft = safe;
        const maxLeft = Math.max(minLeft, window.innerWidth - rect.width - safe);
        let targetLeft = rect.left;
        if(rect.left < minLeft){
          targetLeft = minLeft;
        } else if(rect.right > window.innerWidth - safe){
          targetLeft = maxLeft;
        }
        targetLeft = Math.min(Math.max(targetLeft, minLeft), maxLeft);
        if(Math.abs(targetLeft - rect.left) > 0.5){
          $panel.style.left = `${Math.round(targetLeft)}px`;
          $panel.style.right = '';
        }
      }

      if(hasInlineTop){
        const minTop = safe;
        const maxTop = window.innerHeight - rect.height - safe;
        let targetTop = rect.top;
        if(rect.top < minTop){
          targetTop = minTop;
        } else if(rect.bottom > window.innerHeight - safe){
          targetTop = Math.min(rect.top, maxTop);
        }
        const clampTop = maxTop < minTop ? minTop : Math.min(Math.max(targetTop, minTop), maxTop);
        if(Math.abs(clampTop - rect.top) > 0.5){
          $panel.style.top = `${Math.round(clampTop)}px`;
          $panel.style.bottom = '';
        }
      }
    }

    function setOpenState(){
      $panel.style.display = 'block';
      $panel.setAttribute('data-open', 'true');
      $panel.removeAttribute('data-peek');
      $panel.removeAttribute('data-swiping');
      $panel.removeAttribute('data-closing');
      $panel.removeAttribute('aria-hidden');
      if(!chatDisabled){
        hideFallback($fallback, $frame);
      } else {
        showFallback($fallback, $frame);
      }
      $panel.style.removeProperty('--its-shift');
      $panel.style.transform = '';
      $panel.style.opacity = '';
      updateMinimizeButton();
      updatePeekHint(false);
      hideLauncher();
      requestAnimationFrame(()=>{ clampPanelToViewport(); });
    }

    function setPeekState(){
      $panel.removeAttribute('data-open');
      $panel.setAttribute('data-peek', 'true');
      $panel.style.display = 'block';
      if(isPhone()){
        $panel.setAttribute('aria-hidden', 'true');
      } else {
        $panel.removeAttribute('aria-hidden');
      }
      $panel.removeAttribute('data-swiping');
      $panel.removeAttribute('data-closing');
      if(chatDisabled){
        if($fallback){
          $fallback.hidden = true;
          if(!$fallback.hasAttribute('hidden')){
            $fallback.setAttribute('hidden', '');
          }
        }
        if($frame){
          $frame.hidden = true;
          $frame.setAttribute('aria-hidden', 'true');
        }
      } else {
        hideFallback($fallback, $frame);
      }
      $frame.setAttribute('aria-hidden', 'true');
      $panel.style.transform = '';
      $panel.style.removeProperty('--its-shift');
      if($panel.contains(document.activeElement)){
        try { document.activeElement.blur(); } catch(e){}
      }
      $panel.style.opacity = '';
      updateMinimizeButton();
      updatePeekHint(true);
      hideLauncher();
    }

    const isOpen = () => $panel.getAttribute('data-open') === 'true';

    function openChat(){
      ensureLoaded();
      setOpenState();
      if(!chatDisabled){
        setTimeout(()=>{ try { $frame.contentWindow?.focus(); } catch(e){} }, 150);
      }
    }
    function closeChat(){
      const wasPeek = $panel.getAttribute('data-peek') === 'true';
      const wasOpen = isOpen();
      if(!wasPeek && !wasOpen) return;

      const duration = 220;
      $panel.setAttribute('data-closing', wasPeek ? 'peek' : 'open');
      void window.getComputedStyle($panel).transform;

      requestAnimationFrame(()=>{
        const rect = $panel.getBoundingClientRect();
        const travel = wasPeek
          ? Math.max(120, Math.ceil(window.innerHeight - rect.top + 40))
          : 24;
        $panel.style.transform = `translateY(${travel}px)`;
        $panel.style.opacity = '0';
      });

      setTimeout(()=>{
        $panel.removeAttribute('data-open');
        $panel.removeAttribute('data-peek');
        $panel.removeAttribute('data-swiping');
        $panel.removeAttribute('data-closing');
        $panel.removeAttribute('aria-hidden');
        if(!chatDisabled){
          hideFallback($fallback, $frame);
        } else {
          showFallback($fallback, $frame);
        }
        $panel.style.display = 'none';
        $panel.style.opacity = '';
        $panel.style.transform = '';
        $panel.style.removeProperty('--its-shift');
        updateMinimizeButton();
        updatePeekHint(false);
        showLauncher();
      }, duration);
    }
    const toggleChat = () => { isOpen() ? closeChat() : openChat(); };

    $launcher.addEventListener('click', toggleChat);
    if($minimize){
      $minimize.addEventListener('click', ()=>{
        if(chatDisabled) return;
        if(isPeek()){
          ensureLoaded();
          setOpenState();
        } else {
          if(!isOpen()){
            ensureLoaded();
          }
          setPeekState();
        }
      });
    }
    if($close){
      $close.addEventListener('click', closeChat);
    }
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && isOpen()) closeChat(); });

    let dragging=false, startX=0, startY=0, startLeft=0, startTop=0, panelW=0, panelH=0;

    if($handle){
      $handle.addEventListener('pointerdown', (e)=>{
        if (isPhone()) return;
        dragging = true;
        $handle.setPointerCapture(e.pointerId);
        const rect = $panel.getBoundingClientRect();
        panelW = rect.width;
        panelH = rect.height;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = rect.left;
        startTop = rect.top;
        $panel.style.right = '';
        $panel.style.bottom = '';
        $panel.style.left = `${startLeft}px`;
        $panel.style.top = `${startTop}px`;
        $handle.style.cursor = 'grabbing';
      });
    }
    window.addEventListener('pointermove', (e)=>{
      if(!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const maxLeft = window.innerWidth - panelW;
      const maxTop = window.innerHeight - panelH;
      $panel.style.left = Math.max(0, Math.min(maxLeft, startLeft + dx)) + 'px';
      $panel.style.top  = Math.max(0, Math.min(maxTop,  startTop + dy)) + 'px';
    });
    window.addEventListener('pointerup', ()=>{
      if(!dragging) return;
      dragging = false;
      if($handle){
        $handle.style.cursor = 'grab';
      }
    });

    let swiping=false, swipeStartY=0, deltaY=0, peekAtStart=false;
    const handleTouchStart = (e)=>{
      if(!isPhone()) return;
      if(swiping) return;
      if(e.target.closest('.its-chat-controls')) return;
      const isPeekState = $panel.getAttribute('data-peek') === 'true';
      const startedOnHandle = $handle && $handle.contains(e.target);
      if(isPeekState && e.target.closest('.its-chat-controls')) return;
      if(!isPeekState && !startedOnHandle) return;
      swiping = true;
      deltaY = 0;
      swipeStartY = e.touches[0].clientY;
      peekAtStart = isPeekState;
      $panel.style.transition = 'none';
      $panel.style.willChange = 'transform';
      $panel.setAttribute('data-swiping', 'true');
      $panel.style.removeProperty('--its-shift');
    };
    const handleTouchMove = (e)=>{
      if(!swiping) return;
      const currentY = e.touches[0].clientY;
      deltaY = currentY - swipeStartY;
      const rawHeight = $panel.clientHeight || window.innerHeight;
      const limit = Math.min(rawHeight, window.innerHeight);
      const translate = peekAtStart
        ? Math.max(-limit, Math.min(0, deltaY))
        : Math.max(0, Math.min(deltaY, limit));
      $panel.setAttribute('data-swiping', 'true');
      $panel.style.setProperty('--its-shift', `${translate}px`);
    };
    const finishSwipe = ()=>{
      if(!swiping) return;
      swiping = false;
      $panel.style.transition = '';
      $panel.style.removeProperty('willChange');
      $panel.style.removeProperty('--its-shift');
      $panel.removeAttribute('data-swiping');
      const isTap = Math.abs(deltaY) <= 10;
      const shouldPeek = !peekAtStart && deltaY > PEEK_THRESHOLD;
      const shouldOpen = peekAtStart && (deltaY < -OPEN_THRESHOLD || isTap);
      const shouldClosePeek = peekAtStart && deltaY > CLOSE_PEEK_THRESHOLD;
      if(shouldClosePeek){
        closeChat();
      } else if(shouldPeek){
        setPeekState();
      } else if(shouldOpen){
        ensureLoaded();
        setOpenState();
      } else {
        if(peekAtStart){
          setPeekState();
        } else {
          setOpenState();
        }
      }
      deltaY = 0;
    };
    [$handle, $panel].forEach((el)=>{
      if(!el) return;
      el.addEventListener('touchstart', handleTouchStart, {passive:true});
      el.addEventListener('touchmove', handleTouchMove, {passive:true});
      el.addEventListener('touchend', finishSwipe);
      el.addEventListener('touchcancel', finishSwipe);
    });

    function verifyChatUrl(){
      if(chatDisabled) return;
      if(typeof fetch !== 'function') return;
      let resolvedUrl;
      try {
        resolvedUrl = new URL(CHAT_URL, window.location.href).toString();
      } catch (_) {
        return;
      }
      endpointState = 'pending';
      fetch(resolvedUrl, {
        method: 'HEAD',
        mode: 'cors',
        redirect: 'follow',
        cache: 'no-store',
        credentials: 'omit'
      }).then((response)=>{
        if(chatDisabled) return;
        if(response.status >= 400){
          renderUnavailableState('unreachable');
        } else if(response.status >= 200){
          endpointState = 'ok';
        }
      }).catch(()=>{
        if(chatDisabled || endpointState === 'fail') return;
        fetch(resolvedUrl, {
          method: 'GET',
          mode: 'no-cors',
          redirect: 'follow',
          cache: 'no-store',
          credentials: 'omit'
        }).then(()=>{
          if(chatDisabled || endpointState === 'fail') return;
          if(endpointState === 'pending'){
            endpointState = 'unknown';
          }
        }).catch(()=>{
          if(chatDisabled || endpointState === 'fail') return;
          renderUnavailableState('unreachable');
        });
      });
    }

    if(hasChatUrl){
      verifyChatUrl();
    }

    if(hasChatUrl){
      const loadHandler = ()=>{
        if(chatDisabled) return;
        if(endpointState === 'fail'){
          renderUnavailableState('unreachable');
          return;
        }
        loadSucceeded = true;
        hideFallback($fallback, $frame);
      };

      const errorHandler = ()=>{
        if(chatDisabled) return;
        renderUnavailableState('unreachable');
      };

      $frame.addEventListener('load', loadHandler, {once:false});
      $frame.addEventListener('error', errorHandler, {once:false});

      const fallbackTimer = setTimeout(()=>{
        if(chatDisabled || loadSucceeded) return;
        renderUnavailableState('unreachable');
      }, 3500);

      const clearTimer = ()=>{
        clearTimeout(fallbackTimer);
        $frame.removeEventListener('load', clearTimer);
        $frame.removeEventListener('error', clearTimer);
      };
      $frame.addEventListener('load', clearTimer, {once:true});
      $frame.addEventListener('error', clearTimer, {once:true});

      ensureLoaded();

      const link = document.createElement('link');
      link.rel = 'preconnect';
      try {
        link.href = new URL(CHAT_URL, window.location.href).origin;
        document.head.appendChild(link);
      } catch (_) {
        // Ignore malformed URLs provided via data-chat-url.
      }
    } else {
      renderUnavailableState('missing-url');
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
