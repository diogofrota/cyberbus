(function () {
  "use strict";

  var data = window.CYBERBUS_DATA || {};

  var icons = {
    home: '<path d="M3 11.5 12 4l9 7.5M5.5 10.5V20h13v-9.5M9.5 20v-6h5v6"></path>',
    ticket: '<path d="M4 7.5h16M6 4.5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2ZM8 11h5M8 15h8"></path>',
    bus: '<path d="M6 4h12a2 2 0 0 1 2 2v11H4V6a2 2 0 0 1 2-2ZM4 13h16M7 20v-3M17 20v-3M8 8h8"></path>',
    terminal: '<path d="M4 21V9l8-5 8 5v12M2 21h20M8 21v-8h8v8M8 9h.01M12 9h.01M16 9h.01"></path>',
    route: '<path d="M6 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.5 14.5l7-5M4 13V8a3 3 0 0 1 3-3h2"></path>',
    pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Zm-8 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>',
    stops: '<path d="M6 3v18M6 5h11l-2 4 2 4H6M18 19h3"></path>',
    share: '<path d="M8.5 13.5 15.5 10M8.5 10.5 15.5 7M18 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12 4a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>',
    store: '<path d="M4 10v10h16V10M3 10l2-6h14l2 6M8 20v-6h8v6M3 10a3 3 0 0 0 5 2 3 3 0 0 0 4 0 3 3 0 0 0 4 0 3 3 0 0 0 5-2"></path>',
    more: '<path d="M5 12h.01M12 12h.01M19 12h.01"></path>',
    chevron: '<path d="m9 18 6-6-6-6"></path>',
    back: '<path d="m15 18-6-6 6-6"></path>',
    close: '<path d="m6 6 12 12M18 6 6 18"></path>',
    clock: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
    check: '<path d="m20 6-11 11-5-5"></path>',
    shield: '<path d="m12 3 7 3v5c0 4.4-2.7 8.1-7 10-4.3-1.9-7-5.6-7-10V6l7-3Zm-3 9 2 2 4-4"></path>',
    alert: '<path d="M12 3 2.5 20h19L12 3Zm0 6v5m0 3h.01"></path>',
    copy: '<rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m4 7 8 6 8-6"></path>',
    whatsapp: '<path d="M20 11.5a8 8 0 0 1-11.8 7l-4.2 1 1.1-4A8 8 0 1 1 20 11.5Z"></path><path d="M9 8.5c.5 3 2 4.5 5 5l1-1.3 2 .8c-.1 1.8-1 2.5-2.5 2.5-4.2-.4-7.6-3.8-8-8 0-1.4.8-2.3 2.5-2.5l.8 2L9 8.5Z"></path>',
    external: '<path d="M14 5h5v5M11 13l8-8M19 13v6H5V5h6"></path>',
    info: '<circle cx="12" cy="12" r="9"></circle><path d="M12 11v5m0-8h.01"></path>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"></path>',
    utensils: '<path d="M7 3v7m-2-7v4a2 2 0 0 0 4 0V3M7 10v11M16 3v18M16 3c3 2 4 5 4 8h-4"></path>',
    coffee: '<path d="M5 8h12v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Zm12 2h1a3 3 0 0 1 0 6h-1M8 3v2m4-2v2"></path>',
    wifi: '<path d="M4 9a12 12 0 0 1 16 0M7 12a8 8 0 0 1 10 0m-7 3a4 4 0 0 1 4 0m-2 4h.01"></path>',
    restroom: '<path d="M7 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM4 21l1-8H3l1-6h6l1 6H9l1 8m4 0v-7h-2l2-7h6l2 7h-2v7"></path>',
    parking: '<rect x="4" y="3" width="16" height="18" rx="2"></rect><path d="M9 17V7h4a3 3 0 0 1 0 6H9"></path>',
    bank: '<path d="m3 9 9-5 9 5M5 10v7m5-7v7m4-7v7m5-7v7M3 20h18M2 17h20"></path>',
    cart: '<path d="M3 4h2l2 11h10l3-7H6M9 20h.01M17 20h.01"></path>',
    location: '<circle cx="12" cy="12" r="3"></circle><circle cx="12" cy="12" r="8"></circle><path d="M12 2v2m0 16v2M2 12h2m16 0h2"></path>',
    weather: '<path d="M12 3v2m0 14v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2m14 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path><circle cx="12" cy="12" r="4"></circle>',
    moon: '<path d="M20.5 14.3A8.7 8.7 0 0 1 9.7 3.5 8.8 8.8 0 1 0 20.5 14.3Z"></path>',
    landmark: '<path d="m3 9 9-5 9 5M4 10h16M6 10v9m4-9v9m4-9v9m4-9v9M3 20h18"></path>',
    phone: '<path d="M8 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-3l-4-1-2 2c-3.8-1.2-6.8-4.2-8-8l2-2-1-4Z"></path>'
  };

  function icon(name, className) {
    return '<svg class="' + (className || "") + '" aria-hidden="true" viewBox="0 0 24 24">' + (icons[name] || icons.info) + "</svg>";
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function withTrip(url) {
    var separator = url.indexOf("?") >= 0 ? "&" : "?";
    return url + separator + "trip=" + encodeURIComponent(data.code || "BR1024");
  }

  function getStop(id) {
    var stop = data.stops && data.stops.find(function (item) { return item.id === id; });
    return stop || (data.stops && data.stops[2]) || null;
  }

  function getEstablishment(id) {
    var item = data.establishments && data.establishments.find(function (entry) { return entry.id === id; });
    return item || (data.establishments && data.establishments[0]) || null;
  }

  function setButtonLoading(button, isLoading, loadingLabel) {
    if (!button) return;
    var label = button.querySelector(".button__label");
    if (isLoading) {
      if (!button.dataset.defaultLabel && label) button.dataset.defaultLabel = label.textContent;
      if (label && loadingLabel) label.textContent = loadingLabel;
      button.classList.add("is-loading");
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
      return;
    }
    if (label && button.dataset.defaultLabel) label.textContent = button.dataset.defaultLabel;
    button.classList.remove("is-loading");
    button.disabled = false;
    button.removeAttribute("aria-busy");
  }

  function showToast(title, message, type) {
    var region = document.getElementById("toast-region");
    if (!region) return;
    var tone = type || "success";
    var toast = document.createElement("div");
    toast.className = "toast toast--" + tone;
    if (tone === "error") toast.setAttribute("role", "alert");
    toast.innerHTML = icon(tone === "error" ? "alert" : tone === "info" ? "info" : "check") + '<div><strong></strong><span></span></div>';
    toast.querySelector("strong").textContent = title;
    toast.querySelector("span").textContent = message;
    region.appendChild(toast);
    window.setTimeout(function () {
      toast.classList.add("is-leaving");
      window.setTimeout(function () { toast.remove(); }, 180);
    }, 4200);
  }

  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value);
    }
    return new Promise(function (resolve, reject) {
      var textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        var copied = document.execCommand("copy");
        textarea.remove();
        copied ? resolve() : reject(new Error("Falha ao copiar"));
      } catch (error) {
        textarea.remove();
        reject(error);
      }
    });
  }

  function renderHtml(container, markup) {
    if (!container) return;
    var active = document.activeElement;
    var shouldRestore = active && container.contains(active);
    var activeId = shouldRestore ? active.id : "";
    var activeHref = shouldRestore && active.getAttribute ? active.getAttribute("href") : "";
    container.innerHTML = markup;
    if (!shouldRestore) return;
    var replacement = activeId ? document.getElementById(activeId) : null;
    if (!replacement && activeHref) {
      replacement = Array.prototype.find.call(container.querySelectorAll("a[href]"), function (link) {
        return link.getAttribute("href") === activeHref;
      });
    }
    if (replacement && typeof replacement.focus === "function") replacement.focus({ preventScroll: true });
  }

  function brandMarkup(light) {
    return '<a class="brand ' + (light ? "brand--light" : "") + '" href="index.html" aria-label="CyberBus — início">' +
      '<span class="brand__mark" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M7.5 7.5h13a4 4 0 0 1 4 4v9.25a2.75 2.75 0 0 1-2.75 2.75H9.5a3 3 0 0 1-3-3v-12a1 1 0 0 1 1-1Z"></path><path d="M9.5 11h11.75v6.5H9.5z"></path><path d="M11 23.5v2M21 23.5v2M6.5 19h18M24.5 13h1.75"></path></svg></span>' +
      '<span>Cyber<span>Bus</span></span></a>';
  }

  function activeFor(page, item) {
    if (item === page) return " is-active";
    if (item === "paradas" && ["parada-detalhes", "estabelecimentos", "estabelecimento-detalhes"].indexOf(page) >= 0) return " is-active";
    return "";
  }

  function injectHeader() {
    var mount = document.querySelector("[data-app-header]");
    if (!mount) return;
    var page = document.body.dataset.page || "viagem";
    var links = [
      ["viagem", "viagem.html", "Viagem"],
      ["onibus", "onibus.html", "Ônibus", "trip"],
      ["rodoviaria", "rodoviaria.html", "Rodoviária", "trip"],
      ["rota", "rota.html", "Rota", "trip"],
      ["paradas", "paradas.html", "Paradas", "trip"],
      ["compartilhar", "compartilhar.html", "Compartilhar", "trip"],
      ["clima", "clima.html", "Clima", "complete"],
      ["roteiros", "roteiros.html", "Roteiros", "complete"],
      ["avaliacao", "avaliacao.html", "Avaliação", "complete"]
    ];
    mount.innerHTML = '<header class="app-header"><div class="container app-header__inner">' +
      brandMarkup(false) +
      '<nav class="desktop-nav" aria-label="Navegação principal">' + links.map(function (entry) {
        var active = activeFor(page, entry[0]);
        var visibility = entry[3] === "trip" ? " data-trip-only" : entry[3] === "complete" ? " data-complete-only hidden" : "";
        if (entry[0] === "onibus" || entry[0] === "rodoviaria") visibility += " data-preparing-only hidden";
        return '<a class="desktop-nav__link' + active + '" href="' + withTrip(entry[1]) + '"' + visibility + (active ? ' aria-current="page"' : "") + '>' + escapeHtml(entry[2]) + "</a>";
      }).join("") + "</nav>" +
      '<a class="app-header__home-link" href="' + withTrip("viagem.html") + '" aria-label="Abrir minha viagem">' + icon("home") + "Início</a>" +
      "</div></header>";
  }

  function injectBottomNav() {
    var mount = document.querySelector("[data-bottom-nav]");
    if (!mount) return;
    var page = document.body.dataset.page || "viagem";
    var moreActive = ["rodoviaria", "estabelecimentos", "estabelecimento-detalhes", "compartilhar", "emergencia", "clima", "roteiros"].indexOf(page) >= 0;
    var tripActive = page === "viagem";
    var busActive = page === "onibus";
    var routeActive = page === "rota";
    var stopsActive = ["paradas", "parada-detalhes"].indexOf(page) >= 0;
    mount.innerHTML = '<nav class="bottom-nav" aria-label="Navegação principal no celular"><div class="bottom-nav__inner">' +
      '<a class="bottom-nav__item' + (tripActive ? " is-active" : "") + '" href="' + withTrip("viagem.html") + '"' + (tripActive ? ' aria-current="page"' : "") + '>' + icon("home") + "<span>Viagem</span></a>" +
      '<a class="bottom-nav__item' + (busActive ? " is-active" : "") + '" href="' + withTrip("onibus.html") + '" data-trip-only data-preparing-only hidden' + (busActive ? ' aria-current="page"' : "") + '>' + icon("bus") + "<span>Embarque</span></a>" +
      '<a class="bottom-nav__item' + (routeActive ? " is-active" : "") + '" href="' + withTrip("rota.html") + '" data-trip-only' + (routeActive ? ' aria-current="page"' : "") + '>' + icon("route") + "<span>Rota</span></a>" +
      '<a class="bottom-nav__item' + (stopsActive ? " is-active" : "") + '" href="' + withTrip("paradas.html") + '" data-trip-only' + (stopsActive ? ' aria-current="page"' : "") + '>' + icon("stops") + "<span>Paradas</span></a>" +
      '<a class="bottom-nav__item' + (page === "avaliacao" ? " is-active" : "") + '" href="' + withTrip("avaliacao.html") + '" data-complete-only hidden' + (page === "avaliacao" ? ' aria-current="page"' : "") + '>' + icon("star") + "<span>Avaliar</span></a>" +
      '<button class="bottom-nav__item' + (moreActive ? " is-active" : "") + '" type="button" data-open-more aria-haspopup="dialog" aria-expanded="false">' + icon("more") + "<span>Mais</span></button>" +
      "</div></nav>";
  }

  function injectMoreSheet() {
    var mount = document.querySelector("[data-more-sheet]");
    if (!mount) return;
    mount.innerHTML = '<div class="sheet-backdrop" data-close-more hidden></div>' +
      '<section class="more-sheet" role="dialog" aria-modal="true" aria-labelledby="more-title" aria-hidden="true" hidden inert>' +
      '<div class="more-sheet__handle" aria-hidden="true"></div>' +
      '<div class="more-sheet__header"><div><p class="eyebrow">Outros recursos</p><h2 id="more-title">O que você precisa?</h2></div><button class="icon-button" type="button" data-close-more aria-label="Fechar menu">' + icon("close") + "</button></div>" +
      '<div class="more-sheet__grid">' +
      '<a data-trip-only data-preparing-only hidden href="' + withTrip("rodoviaria.html") + '"><span class="feature-icon">' + icon("terminal") + "</span><span><strong>Rodoviária</strong><small>Encontre a plataforma</small></span>" + icon("chevron") + "</a>" +
      '<a data-trip-only href="' + withTrip("estabelecimentos.html?stop=resende") + '"><span class="feature-icon feature-icon--amber">' + icon("store") + "</span><span><strong>Restaurantes e lojas</strong><small>Veja o que há nas paradas</small></span>" + icon("chevron") + "</a>" +
      '<a href="' + withTrip("clima.html") + '"><span class="feature-icon feature-icon--cyan">' + icon("weather") + "</span><span><strong>Clima na chegada</strong><small>Veja a previsão simulada no destino</small></span>" + icon("chevron") + "</a>" +
      '<a href="' + withTrip("roteiros.html") + '"><span class="feature-icon feature-icon--violet">' + icon("landmark") + "</span><span><strong>Roteiros turísticos</strong><small>Explore São Paulo após a viagem</small></span>" + icon("chevron") + "</a>" +
      '<a data-complete-only hidden href="' + withTrip("avaliacao.html") + '"><span class="feature-icon feature-icon--green">' + icon("star") + "</span><span><strong>Avaliar viagem</strong><small>Conte como foi sua experiência</small></span>" + icon("chevron") + "</a>" +
      '<a data-trip-only href="' + withTrip("compartilhar.html") + '"><span class="feature-icon feature-icon--green">' + icon("share") + "</span><span><strong>Compartilhar viagem</strong><small>Mantenha a família informada</small></span>" + icon("chevron") + "</a>" +
      '<a data-trip-only class="more-sheet__danger" href="' + withTrip("emergencia.html") + '"><span class="feature-icon feature-icon--red">' + icon("alert") + "</span><span><strong>Emergência</strong><small>Dados e suporte da viagem</small></span>" + icon("chevron") + "</a>" +
      "</div></section>";

    var sheet = mount.querySelector(".more-sheet");
    var backdrop = mount.querySelector(".sheet-backdrop");
    var opener = document.querySelector("[data-open-more]");
    var closeButtons = mount.querySelectorAll("[data-close-more]");
    var previousFocus = null;

    function openSheet() {
      previousFocus = document.activeElement;
      backdrop.hidden = false;
      sheet.hidden = false;
      sheet.removeAttribute("inert");
      sheet.setAttribute("aria-hidden", "false");
      if (opener) opener.setAttribute("aria-expanded", "true");
      void sheet.offsetHeight;
      document.body.classList.add("sheet-open");
      requestAnimationFrame(function () {
        sheet.querySelector("[data-close-more]").focus();
      });
    }

    function closeSheet() {
      document.body.classList.remove("sheet-open");
      sheet.setAttribute("aria-hidden", "true");
      sheet.setAttribute("inert", "");
      if (opener) opener.setAttribute("aria-expanded", "false");
      window.setTimeout(function () {
        backdrop.hidden = true;
        sheet.hidden = true;
      }, 220);
      if (previousFocus) previousFocus.focus();
    }

    if (opener) opener.addEventListener("click", openSheet);
    closeButtons.forEach(function (button) { button.addEventListener("click", closeSheet); });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && document.body.classList.contains("sheet-open")) closeSheet();
      if (event.key === "Tab" && document.body.classList.contains("sheet-open")) {
        var focusable = sheet.querySelectorAll('a[href]:not([hidden]), button:not([disabled]):not([hidden])');
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  var navigationPhase = null;

  function updateTripNavigation(snapshot) {
    var complete = Boolean(snapshot.isComplete);
    var preparing = Boolean(snapshot.isPreparing) && !complete;
    var phase = complete ? "complete" : preparing ? "preparing" : "underway";
    if (navigationPhase === phase) return;
    navigationPhase = phase;
    document.querySelectorAll("[data-trip-only]").forEach(function (element) { element.hidden = complete; });
    document.querySelectorAll("[data-preparing-only]").forEach(function (element) { element.hidden = !preparing; });
    document.querySelectorAll("[data-complete-only]").forEach(function (element) { element.hidden = !complete; });
    var bottomNav = document.querySelector(".bottom-nav__inner");
    if (bottomNav) {
      bottomNav.classList.toggle("is-complete", complete);
      bottomNav.classList.toggle("is-underway", !complete && !preparing);
    }
    var title = document.getElementById("more-title");
    if (title) title.textContent = complete ? "Depois da chegada" : "O que você precisa?";
    if (document.activeElement && document.activeElement.hidden) {
      var sheet = document.querySelector(".more-sheet");
      var focusTarget = sheet && !sheet.hidden ? sheet.querySelector("[data-close-more]") : document.querySelector(".app-header__home-link");
      if (focusTarget) focusTarget.focus();
    }
  }

  function injectFooter() {
    var mount = document.querySelector("[data-app-footer]");
    if (!mount) return;
    mount.innerHTML = '<footer class="app-footer container"><span>CyberBus · Protótipo demonstrativo</span><a href="index.html">Consultar outra viagem</a></footer>';
  }

  function markPageReady() {
    window.setTimeout(function () {
      document.body.classList.add("is-ready");
      document.body.setAttribute("aria-busy", "false");
      var loader = document.querySelector(".page-loader");
      if (loader) {
        loader.textContent = "Conteúdo carregado.";
        window.setTimeout(function () { loader.remove(); }, 800);
      }
    }, 180);
  }

  function initializeShell() {
    var loader = document.createElement("span");
    loader.className = "page-loader sr-only";
    loader.setAttribute("role", "status");
    loader.setAttribute("aria-live", "polite");
    loader.textContent = "Carregando informações da viagem.";
    document.body.appendChild(loader);
    injectHeader();
    injectBottomNav();
    injectMoreSheet();
    injectFooter();
    if (document.body.classList.contains("app-page") && window.CyberBusSimulation) {
      window.CyberBusSimulation.subscribe(updateTripNavigation);
    }
    markPageReady();
  }

  window.CyberBus = {
    data: data,
    icon: icon,
    escapeHtml: escapeHtml,
    getQueryParam: getQueryParam,
    withTrip: withTrip,
    getStop: getStop,
    getEstablishment: getEstablishment,
    setButtonLoading: setButtonLoading,
    showToast: showToast,
    copyText: copyText,
    renderHtml: renderHtml,
    brandMarkup: brandMarkup
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeShell);
  } else {
    initializeShell();
  }
}());
