(function () {
  "use strict";

  var popupSequence = 0;

  function asElement(element) {
    return typeof element === "string" ? document.querySelector(element) : element;
  }

  function normalizeCoordinate(value) {
    if (!Array.isArray(value) || value.length < 2) return null;
    var latitude = Number(value[0]);
    var longitude = Number(value[1]);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;
    return [latitude, longitude];
  }

  function normalizePath(path) {
    if (!Array.isArray(path)) return [];
    return path.map(normalizeCoordinate).filter(function (coordinate) { return coordinate !== null; });
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function sameCoordinate(first, second) {
    return first && second && first[0] === second[0] && first[1] === second[1];
  }

  function iconMarkup(name) {
    var app = window.CyberBus;
    if (!app || typeof app.icon !== "function") return "";
    try {
      return app.icon(name);
    } catch (error) {
      return "";
    }
  }

  function createFeedback(element) {
    var overlay = document.createElement("div");
    var panel = document.createElement("div");
    var dots = document.createElement("span");
    var warning = document.createElement("span");
    var message = document.createElement("strong");

    overlay.className = "cyberbus-real-map__feedback cyberbus-real-map__feedback--loading";
    overlay.style.position = "absolute";
    overlay.style.zIndex = "1000";
    overlay.style.inset = "0";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "24px";
    overlay.style.background = "rgba(244, 248, 251, 0.9)";
    overlay.style.pointerEvents = "none";

    panel.className = "cyberbus-real-map__feedback-panel inline-alert inline-alert--info";
    panel.style.maxWidth = "360px";
    panel.style.margin = "0";
    panel.style.background = "#ffffff";
    panel.style.boxShadow = "0 16px 48px rgba(3, 18, 32, 0.16)";

    dots.className = "growing-dots cyberbus-real-map__loading-dots";
    dots.setAttribute("aria-hidden", "true");
    dots.style.display = "inline-flex";
    dots.innerHTML = "<i></i><i></i><i></i>";

    warning.className = "cyberbus-real-map__warning";
    warning.setAttribute("aria-hidden", "true");
    warning.style.display = "none";
    warning.style.width = "20px";
    warning.style.height = "20px";
    warning.style.flex = "0 0 20px";
    warning.innerHTML = iconMarkup("alert") || "!";
    if (warning.firstElementChild) {
      warning.firstElementChild.style.width = "20px";
      warning.firstElementChild.style.height = "20px";
    }

    message.className = "cyberbus-real-map__feedback-message";
    message.textContent = "Carregando mapa…";
    panel.appendChild(dots);
    panel.appendChild(warning);
    panel.appendChild(message);
    overlay.appendChild(panel);
    element.appendChild(overlay);

    function showLoading(text) {
      overlay.className = "cyberbus-real-map__feedback cyberbus-real-map__feedback--loading";
      overlay.setAttribute("role", "status");
      overlay.setAttribute("aria-live", "polite");
      overlay.removeAttribute("aria-hidden");
      overlay.style.display = "flex";
      panel.className = "cyberbus-real-map__feedback-panel inline-alert inline-alert--info";
      dots.style.display = "inline-flex";
      warning.style.display = "none";
      message.textContent = text || "Carregando mapa…";
    }

    function showError(text) {
      overlay.className = "cyberbus-real-map__feedback cyberbus-real-map__feedback--error";
      overlay.setAttribute("role", "alert");
      overlay.setAttribute("aria-live", "assertive");
      overlay.removeAttribute("aria-hidden");
      overlay.style.display = "flex";
      panel.className = "cyberbus-real-map__feedback-panel inline-alert inline-alert--danger";
      dots.style.display = "none";
      warning.style.display = "block";
      message.textContent = text;
    }

    function hide() {
      overlay.setAttribute("aria-hidden", "true");
      overlay.style.display = "none";
    }

    return {
      element: overlay,
      showLoading: showLoading,
      showError: showError,
      hide: hide,
      remove: function () { overlay.remove(); }
    };
  }

  function createPopup(title, description) {
    var wrapper = document.createElement("div");
    var heading = document.createElement("strong");
    var detail = document.createElement("span");
    popupSequence += 1;

    wrapper.className = "cyberbus-real-map__popup";
    wrapper.setAttribute("tabindex", "-1");
    wrapper.dataset.popupLabel = title;
    heading.id = "cyberbus-map-popup-title-" + popupSequence;
    heading.textContent = title;
    heading.style.display = "block";
    detail.textContent = description || "";
    detail.style.display = "block";
    wrapper.appendChild(heading);
    if (description) wrapper.appendChild(detail);

    return { element: wrapper, heading: heading, detail: detail };
  }

  function markerLabel(item, fallback) {
    return item.city || item.name || item.title || item.label || fallback;
  }

  function markerDescription(item) {
    var parts = [];
    var placeName = item.name || item.title;
    var time = item.estimated || item.actual || item.scheduled;
    if (placeName && placeName !== item.city) parts.push(placeName);
    if (time) parts.push("Horário " + time);
    if (item.location) parts.push(item.location);
    if (item.description) parts.push(item.description);
    return parts.join(" · ");
  }

  function classToken(value, fallback) {
    var token = String(value || "").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
    return token || fallback;
  }

  function makeLayerAccessible(layer, label) {
    var keyHandler;
    var shouldRestoreFocus = false;

    function enhanceElement() {
      var markerElement = layer.getElement && layer.getElement();
      if (!markerElement || keyHandler) return;
      markerElement.setAttribute("tabindex", "0");
      markerElement.setAttribute("role", "button");
      markerElement.setAttribute("aria-label", label);
      markerElement.setAttribute("aria-haspopup", "dialog");
      markerElement.setAttribute("aria-expanded", "false");
      keyHandler = function (event) {
        if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") return;
        event.preventDefault();
        shouldRestoreFocus = true;
        layer.openPopup();
        window.setTimeout(function () {
          var popup = layer.getPopup && layer.getPopup();
          var content = popup && popup.getContent();
          if (content && typeof content.focus === "function") content.focus({ preventScroll: true });
        }, 0);
      };
      markerElement.addEventListener("keydown", keyHandler);
    }

    layer.on("add", enhanceElement);
    layer.on("popupopen", function () {
      var markerElement = layer.getElement && layer.getElement();
      if (markerElement) markerElement.setAttribute("aria-expanded", "true");
    });
    layer.on("popupclose", function () {
      var markerElement = layer.getElement && layer.getElement();
      if (markerElement) markerElement.setAttribute("aria-expanded", "false");
      if (markerElement && shouldRestoreFocus && typeof markerElement.focus === "function") {
        markerElement.focus({ preventScroll: true });
      }
      shouldRestoreFocus = false;
    });
    layer.on("remove", function () {
      var markerElement = layer.getElement && layer.getElement();
      if (markerElement && keyHandler) markerElement.removeEventListener("keydown", keyHandler);
      keyHandler = null;
    });
    enhanceElement();
  }

  function create(element, options) {
    var target = asElement(element);
    var settings = options || {};
    if (!target || target.nodeType !== 1) throw new TypeError("CyberBusRealMap.create requer um elemento válido.");

    if (target.__cyberBusRealMap && typeof target.__cyberBusRealMap.destroy === "function") {
      target.__cyberBusRealMap.destroy();
    }

    var data = settings.data || window.CyberBusData || window.CYBERBUS_DATA || {};
    var route = data.route || {};
    var path = normalizePath(settings.mapPath || route.mapPath);
    var stops = Array.isArray(settings.stops) ? settings.stops : (Array.isArray(data.stops) ? data.stops : []);
    var pois = Array.isArray(settings.pois) ? settings.pois : (Array.isArray(data.pois) ? data.pois : (Array.isArray(route.pois) ? route.pois : []));
    var leaflet = window.L;
    var originalPosition = target.style.position;
    var originalRole = target.getAttribute("role");
    var originalLabel = target.getAttribute("aria-label");
    var originalBusy = target.getAttribute("aria-busy");
    var addedRootClass = !target.classList.contains("cyberbus-real-map");
    var computedPosition = window.getComputedStyle ? window.getComputedStyle(target).position : target.style.position;
    var feedback;
    var api;
    var destroyed = false;

    if (!computedPosition || computedPosition === "static") target.style.position = "relative";
    if (addedRootClass) target.classList.add("cyberbus-real-map");
    if (!originalRole) target.setAttribute("role", "region");
    if (!originalLabel) target.setAttribute("aria-label", settings.ariaLabel || "Mapa da rota da viagem");
    target.setAttribute("aria-busy", "true");
    feedback = createFeedback(target);

    function restoreTarget() {
      target.style.position = originalPosition;
      if (addedRootClass) target.classList.remove("cyberbus-real-map");
      if (originalRole === null) target.removeAttribute("role");
      else target.setAttribute("role", originalRole);
      if (originalLabel === null) target.removeAttribute("aria-label");
      else target.setAttribute("aria-label", originalLabel);
      if (originalBusy === null) target.removeAttribute("aria-busy");
      else target.setAttribute("aria-busy", originalBusy);
      if (target.__cyberBusRealMap === api) delete target.__cyberBusRealMap;
    }

    function unavailable(message) {
      target.setAttribute("aria-busy", "false");
      feedback.showError(message);
      api = {
        update: function () { return false; },
        recenter: function () { return false; },
        fitRoute: function () { return false; },
        destroy: function () {
          if (destroyed) return;
          destroyed = true;
          feedback.remove();
          restoreTarget();
        }
      };
      target.__cyberBusRealMap = api;
      return api;
    }

    if (!leaflet || typeof leaflet.map !== "function") {
      return unavailable("Não foi possível iniciar o mapa. A biblioteca de mapas não está disponível.");
    }
    if (path.length < 2) {
      return unavailable("Não foi possível carregar a rota desta viagem.");
    }

    var map;
    try {
      map = leaflet.map(target, {
        attributionControl: true,
        keyboard: true,
        scrollWheelZoom: settings.scrollWheelZoom === true,
        zoomControl: settings.zoomControl !== false
      });
    } catch (error) {
      return unavailable("Não foi possível iniciar o mapa neste momento.");
    }

    var tileLayer = leaflet.tileLayer(settings.tileUrl || "https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: settings.tileAttribution || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      crossOrigin: true,
      maxZoom: Number.isFinite(settings.maxZoom) ? settings.maxZoom : 19
    });
    map.attributionControl.addAttribution(settings.routeAttribution || 'Rota: <a href="https://project-osrm.org/" target="_blank" rel="noopener">OSRM</a>');
    var routeWeight = Number.isFinite(settings.routeWeight) ? settings.routeWeight : 7;
    var routeOutlineLayer = leaflet.polyline(path, {
      className: "cyberbus-real-map__route-outline",
      color: settings.routeOutlineColor || "#ffffff",
      interactive: false,
      lineCap: "round",
      lineJoin: "round",
      opacity: 0.96,
      weight: Number.isFinite(settings.routeOutlineWeight) ? settings.routeOutlineWeight : routeWeight + 5
    }).addTo(map);
    var routeLayer = leaflet.polyline(path, {
      className: "cyberbus-real-map__route",
      color: settings.routeColor || "#93a8b8",
      interactive: false,
      lineCap: "round",
      lineJoin: "round",
      opacity: 0.9,
      weight: routeWeight
    }).addTo(map);
    var traveledLayer = leaflet.polyline([path[0], path[0]], {
      className: "cyberbus-real-map__route-traveled",
      color: settings.traveledColor || "#1769e0",
      interactive: false,
      lineCap: "round",
      lineJoin: "round",
      opacity: 1,
      weight: Number.isFinite(settings.traveledWeight) ? settings.traveledWeight : 7
    }).addTo(map);
    var stopGroup = leaflet.layerGroup().addTo(map);
    var poiGroup = leaflet.layerGroup().addTo(map);
    var stopLayers = [];
    var currentPosition = normalizeCoordinate(settings.initialPosition) || path[0];
    var currentProgress = 0;
    var loadTimeoutId = null;
    var tileCycleFailed = false;
    var resizeObserver = null;
    var resizeFrame = null;
    var defaultBusLabel = data.bus && data.bus.number ? "Ônibus " + data.bus.number : "Ônibus";
    var busLabel = settings.busLabel == null ? defaultBusLabel : String(settings.busLabel).trim();
    var busTooltipContent = document.createElement("span");
    if (!busLabel) busLabel = defaultBusLabel;
    busTooltipContent.className = "cyberbus-real-map__bus-tooltip-label";
    busTooltipContent.textContent = busLabel;
    var busPopup = createPopup(busLabel, "Progresso da viagem: 0%");
    var busHtml = iconMarkup("bus");
    var busIcon = leaflet.divIcon({
      className: "cyberbus-real-map__bus-marker",
      html: '<span aria-hidden="true" style="display:grid;width:42px;height:42px;place-items:center;border:4px solid #fff;border-radius:14px;color:#fff;background:linear-gradient(145deg,#1769e0,#0893c7);box-shadow:0 8px 20px rgba(23,105,224,.35)">' + (busHtml || "🚌") + "</span>",
      iconAnchor: [21, 21],
      iconSize: [42, 42],
      popupAnchor: [0, -24]
    });
    var busMarker = leaflet.marker(currentPosition, {
      icon: busIcon,
      keyboard: true,
      riseOnHover: true,
      title: busLabel,
      zIndexOffset: 1000
    }).bindPopup(busPopup.element, {
      autoPan: true,
      className: "cyberbus-real-map__leaflet-popup",
      closeButton: true
    }).bindTooltip(busTooltipContent, {
      className: "cyberbus-real-map__bus-tooltip",
      direction: "bottom",
      interactive: false,
      offset: [0, 24],
      opacity: 1,
      permanent: true
    }).addTo(map);

    makeLayerAccessible(busMarker, busLabel + " — localização atual simulada");

    function addPointLayer(item, kind) {
      var coordinate = normalizeCoordinate(item.coordinates || item.coordinate || item.latLng);
      if (!coordinate) return null;
      var label = markerLabel(item, kind === "stop" ? "Parada da viagem" : "Ponto de interesse");
      var popup = createPopup(label, markerDescription(item));
      var type = item.type || "stop";
      var isEndpoint = type === "origin" || type === "destination";
      var typeClass = classToken(type, "stop");
      var idClass = classToken(item.id, "sem-id");
      var marker = leaflet.circleMarker(coordinate, {
        className: "cyberbus-real-map__" + kind + "-marker cyberbus-real-map__" + kind + "-marker--" + type,
        color: "#ffffff",
        fillColor: kind === "poi" ? "#8b5a06" : (isEndpoint ? "#071f33" : "#5e7182"),
        fillOpacity: 1,
        opacity: 1,
        radius: isEndpoint ? 8 : (kind === "poi" ? 6 : 7),
        weight: 3
      }).bindPopup(popup.element, {
        autoPan: true,
        className: "cyberbus-real-map__leaflet-popup",
        closeButton: true
      });
      if (kind === "stop") {
        var tooltipContent = document.createElement("span");
        tooltipContent.className = "cyberbus-real-map__stop-tooltip-label";
        tooltipContent.textContent = item.shortName || label;
        marker.__cyberBusTooltipContent = tooltipContent;
        marker.__cyberBusIsNext = false;
        marker.bindTooltip(tooltipContent, {
          className: "cyberbus-real-map__stop-tooltip cyberbus-real-map__stop-tooltip--" + typeClass + " cyberbus-real-map__stop-tooltip--id-" + idClass,
          direction: "top",
          interactive: false,
          offset: [0, -8],
          opacity: 1,
          permanent: true
        });
        marker.on("tooltipopen", function (event) {
          var tooltipElement = event.tooltip && event.tooltip.getElement();
          if (tooltipElement) tooltipElement.classList.toggle("is-next", marker.__cyberBusIsNext);
        });
      }
      marker.addTo(kind === "poi" ? poiGroup : stopGroup);
      makeLayerAccessible(marker, (kind === "stop" ? "Parada: " : "Ponto de interesse: ") + label);
      return marker;
    }

    if (settings.showStops !== false) {
      stops.forEach(function (stop) {
        var layer = addPointLayer(stop, "stop");
        if (layer) stopLayers.push({ data: stop, layer: layer });
      });
    }
    if (settings.showPois !== false) {
      pois.forEach(function (poi) { addPointLayer(poi, "poi"); });
    }

    function restoreBusyState() {
      if (originalBusy === null) target.removeAttribute("aria-busy");
      else target.setAttribute("aria-busy", originalBusy);
    }

    function clearLoadTimeout() {
      if (loadTimeoutId === null) return;
      window.clearTimeout(loadTimeoutId);
      loadTimeoutId = null;
    }

    function showTileError(message) {
      clearLoadTimeout();
      tileCycleFailed = true;
      restoreBusyState();
      feedback.showError(message);
    }

    function beginTileLoad() {
      if (destroyed) return;
      clearLoadTimeout();
      tileCycleFailed = false;
      target.setAttribute("aria-busy", "true");
      feedback.showLoading("Carregando mapa…");
      loadTimeoutId = window.setTimeout(function () {
        showTileError("O mapa demorou mais que o esperado para carregar. Verifique sua conexão.");
      }, Number.isFinite(settings.loadTimeout) ? Math.max(1000, settings.loadTimeout) : 10000);
    }

    function finishTileLoad() {
      clearLoadTimeout();
      restoreBusyState();
      if (!tileCycleFailed) feedback.hide();
    }

    tileLayer.on("loading", beginTileLoad);
    tileLayer.on("load", finishTileLoad);
    tileLayer.on("tileerror", function () {
      showTileError("Não foi possível carregar todas as áreas do mapa. Verifique sua conexão.");
    });
    beginTileLoad();
    tileLayer.addTo(map);

    map.on("popupopen", function (event) {
      var popupElement = event.popup && event.popup.getElement();
      var content = event.popup && event.popup.getContent();
      if (!popupElement) return;
      popupElement.setAttribute("role", "dialog");
      popupElement.setAttribute("aria-modal", "false");
      if (content && content.dataset && content.dataset.popupLabel) {
        popupElement.setAttribute("aria-label", content.dataset.popupLabel);
      }
      var closeButton = popupElement.querySelector(".leaflet-popup-close-button");
      if (closeButton) closeButton.setAttribute("aria-label", "Fechar informações do mapa");
    });

    function positionFromProgress(progress) {
      var scaled = (clamp(progress, 0, 100) / 100) * (path.length - 1);
      var index = Math.min(path.length - 2, Math.floor(scaled));
      var fraction = scaled - index;
      var start = path[index];
      var end = path[index + 1];
      return [
        start[0] + ((end[0] - start[0]) * fraction),
        start[1] + ((end[1] - start[1]) * fraction)
      ];
    }

    function segmentFromSnapshot(snapshot) {
      if (Number.isFinite(snapshot.geoSegmentIndex)) {
        return clamp(Math.floor(snapshot.geoSegmentIndex), 0, path.length - 2);
      }
      return Math.min(path.length - 2, Math.floor((currentProgress / 100) * (path.length - 1)));
    }

    function updateNextStop(snapshot) {
      var nextStopId = snapshot.nextStop && snapshot.nextStop.id;
      if (!nextStopId) {
        var nextStop = stops.find(function (stop) { return Number(stop.progress) > currentProgress; });
        nextStopId = nextStop && nextStop.id;
      }
      stopLayers.forEach(function (entry) {
        var isNext = Boolean(nextStopId && entry.data.id === nextStopId && currentProgress < 100);
        var element = entry.layer.getElement && entry.layer.getElement();
        var tooltip = entry.layer.getTooltip && entry.layer.getTooltip();
        var tooltipElement = tooltip && tooltip.getElement();
        if (element) element.classList.toggle("is-next", isNext);
        entry.layer.__cyberBusIsNext = isNext;
        if (entry.layer.__cyberBusTooltipContent) entry.layer.__cyberBusTooltipContent.classList.toggle("is-next", isNext);
        if (tooltipElement) tooltipElement.classList.toggle("is-next", isNext);
        entry.layer.setStyle({
          fillColor: isNext ? "#8b5a06" : ((entry.data.type === "origin" || entry.data.type === "destination") ? "#071f33" : "#5e7182")
        });
        entry.layer.setRadius(isNext ? 9 : ((entry.data.type === "origin" || entry.data.type === "destination") ? 8 : 7));
      });
    }

    function update(snapshot) {
      if (destroyed || !snapshot) return false;
      var progress = Number(snapshot.progress);
      currentProgress = Number.isFinite(progress) ? clamp(progress, 0, 100) : currentProgress;
      var position = normalizeCoordinate(snapshot.geoPosition) || positionFromProgress(currentProgress);
      var segmentIndex = segmentFromSnapshot(snapshot);
      var traveledPath = currentProgress >= 100 ? path.slice() : path.slice(0, segmentIndex + 1);
      if (!sameCoordinate(traveledPath[traveledPath.length - 1], position)) traveledPath.push(position);
      if (traveledPath.length === 1) traveledPath.push(position);

      currentPosition = position;
      busMarker.setLatLng(position);
      traveledLayer.setLatLngs(traveledPath);
      busPopup.detail.textContent = "Progresso da viagem: " + Math.round(currentProgress) + "%";
      var busElement = busMarker.getElement && busMarker.getElement();
      if (busElement) busElement.setAttribute("aria-label", busLabel + ", localização atual simulada, " + Math.round(currentProgress) + "% da rota concluída");
      updateNextStop(snapshot);
      return true;
    }

    function fitRoute() {
      if (destroyed) return false;
      var fitOptions = {
        animate: settings.animate !== false,
        padding: Array.isArray(settings.fitPadding) ? settings.fitPadding : [24, 24]
      };
      if (Number.isFinite(settings.maxFitZoom)) fitOptions.maxZoom = settings.maxFitZoom;
      map.fitBounds(routeLayer.getBounds(), fitOptions);
      return true;
    }

    function recenter() {
      if (destroyed || !currentPosition) return false;
      var recenterZoom = Number.isFinite(settings.recenterZoom) ? settings.recenterZoom : map.getZoom();
      map.setView(currentPosition, Math.max(map.getZoom(), recenterZoom), { animate: settings.animate !== false });
      return true;
    }

    function invalidateSize() {
      if (destroyed || resizeFrame !== null) return;
      var requestFrame = window.requestAnimationFrame || function (callback) { return window.setTimeout(callback, 16); };
      resizeFrame = requestFrame(function () {
        resizeFrame = null;
        if (!destroyed) map.invalidateSize({ debounceMoveend: true, pan: false });
      });
    }

    function onWindowResize() {
      invalidateSize();
    }

    if (typeof window.ResizeObserver === "function") {
      resizeObserver = new window.ResizeObserver(invalidateSize);
      resizeObserver.observe(target);
    } else {
      window.addEventListener("resize", onWindowResize);
    }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      clearLoadTimeout();
      tileLayer.off();
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener("resize", onWindowResize);
      if (resizeFrame !== null) {
        var cancelFrame = window.cancelAnimationFrame || window.clearTimeout;
        cancelFrame(resizeFrame);
        resizeFrame = null;
      }
      map.off();
      map.remove();
      feedback.remove();
      restoreTarget();
    }

    api = {
      update: update,
      recenter: recenter,
      fitRoute: fitRoute,
      destroy: destroy
    };
    target.__cyberBusRealMap = api;

    if (settings.initialSnapshot) update(settings.initialSnapshot);
    if (settings.fitOnCreate !== false) {
      fitRoute();
    } else {
      map.setView(normalizeCoordinate(settings.center) || currentPosition, Number.isFinite(settings.zoom) ? settings.zoom : 9);
    }
    map.whenReady(invalidateSize);

    return api;
  }

  window.CyberBusRealMap = {
    create: create
  };
}());
