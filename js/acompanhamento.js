(function () {
  "use strict";

  var app = window.CyberBus;
  var data = app.data;
  var mount = document.getElementById("public-trip");
  var lastSnapshotAt = Date.now();
  var mapController = null;
  var announcedState = "";

  function timelineState(stop, snapshot) {
    if (snapshot.isComplete) return "done";
    if (stop.progress < snapshot.progress) return "done";
    if (stop.id === snapshot.nextStop.id) return "next";
    return "future";
  }

  function buildInterface() {
    app.renderHtml(mount, '<header class="public-intro"><div><span class="badge badge--success"><i></i><span data-public="trip-status"></span></span><p class="eyebrow eyebrow--light">Acompanhando uma viagem</p><h1>' + app.escapeHtml(data.route.origin) + ' <span>→</span> ' + app.escapeHtml(data.route.destination) + '</h1><p>' + app.escapeHtml(data.bus.company) + ' · Ônibus ' + app.escapeHtml(data.bus.number) + '</p></div><div class="public-arrival"><small data-public="arrival-label"></small><strong data-public="final-eta"></strong><span data-public="punctuality"></span></div></header>' +
      '<section class="public-status-grid"><div><small>Saída</small><strong>' + app.escapeHtml(data.route.departure) + '</strong><span>' + app.escapeHtml(data.route.originTerminal) + '</span></div><div><small data-public="next-label"></small><strong data-public="next-city"></strong><span data-public="next-detail"></span></div><div><small>Trajeto concluído</small><strong data-public="progress"></strong><span data-public="remaining"></span></div></section>' +
      '<div class="public-content-grid"><section class="public-map-card" aria-label="Mapa real do trajeto da viagem"><div class="map-card__top"><div><span class="live-map-dot"></span><strong>Localização do ônibus</strong></div><span class="auto-update">Atualizado <span data-last-update>agora</span></span></div><div class="travel-map travel-map--public travel-map--real" id="public-travel-map"><div class="real-map-canvas" id="public-leaflet-map" aria-label="Mapa interativo da rota rodoviária entre Rio de Janeiro e São Paulo"></div><span class="real-map-chip real-map-chip--source">Trajeto rodoviário real</span><span class="real-map-chip real-map-chip--simulation">GPS simulado</span></div></section>' +
      '<section class="public-timeline" aria-labelledby="public-timeline-title"><div class="section-heading section-heading--compact"><div><p class="eyebrow">Etapas da viagem</p><h2 id="public-timeline-title">Linha do tempo</h2></div></div><ol data-public="timeline"></ol><div class="public-update-note">' + app.icon("info") + '<span>Última atualização: <strong data-last-update>agora</strong>. Esta página atualiza automaticamente.</span></div></section></div><span class="sr-only" data-public="live-update" aria-live="polite" aria-atomic="true"></span>');

    var mapCanvas = document.getElementById("public-leaflet-map");
    var mapShell = document.getElementById("public-travel-map");
    if (window.CyberBusRealMap) {
      mapController = window.CyberBusRealMap.create(mapCanvas, {
        shell: mapShell,
        stops: data.stops,
        busLabel: "Ônibus " + data.bus.number,
        fitPadding: [38, 38],
        recenterZoom: 10
      });
      return;
    }

    mapCanvas.innerHTML = '<div class="real-map-fallback inline-alert inline-alert--danger" role="alert">' + app.icon("alert") + '<span>Não foi possível abrir o mapa real.</span></div>';
  }

  function setText(name, value) {
    var target = mount.querySelector('[data-public="' + name + '"]');
    if (target) target.textContent = value;
  }

  function renderTimeline(snapshot) {
    var list = mount.querySelector('[data-public="timeline"]');
    var markup = data.stops.map(function (stop) {
      var state = timelineState(stop, snapshot);
      var label = state === "done" ? (stop.type === "origin" ? "Saída concluída" : stop.type === "destination" ? "Destino alcançado" : "Parada concluída") : state === "next" ? "Próxima parada" : stop.type === "destination" ? "Destino" : "Prevista";
      var displayTime = stop.id === snapshot.nextStop.id ? snapshot.nextStopEta : (stop.estimated || stop.actual || stop.scheduled);
      return '<li class="public-timeline__item public-timeline__item--' + state + (state === "next" ? " is-next" : "") + '"><span>' + (state === "done" ? app.icon("check") : "") + '</span><div><strong>' + app.escapeHtml(stop.city) + '</strong><small>' + label + ' · ' + app.escapeHtml(displayTime) + "</small></div></li>";
    }).join("");
    app.renderHtml(list, markup);
  }

  function render(snapshot) {
    if (!mount.firstElementChild) buildInterface();
    var tripStatus = snapshot.isComplete ? "Viagem concluída" : data.status.label;
    var punctuality = snapshot.isComplete ? "Chegada confirmada" : data.status.punctuality;
    var nextLabel = snapshot.isComplete ? "Destino alcançado" : "Próxima parada";
    lastSnapshotAt = snapshot.updatedAt || Date.now();
    setText("trip-status", tripStatus);
    setText("arrival-label", snapshot.isComplete ? "Chegada confirmada" : "Chegada prevista");
    setText("final-eta", snapshot.finalEta);
    setText("punctuality", punctuality);
    setText("next-label", nextLabel);
    setText("next-city", snapshot.nextStop.city);
    setText("next-detail", snapshot.nextStopEta + " · " + snapshot.distanceToNextStop + " km");
    setText("progress", snapshot.progressLabel);
    setText("remaining", snapshot.distanceRemaining + " km restantes");
    renderTimeline(snapshot);
    if (mapController) mapController.update(snapshot);
    var currentState = snapshot.isComplete ? "complete" : snapshot.nextStop.id;
    if (currentState !== announcedState) {
      setText("live-update", snapshot.isComplete
        ? "Viagem concluída. O ônibus chegou a São Paulo."
        : "Próxima parada: " + snapshot.nextStop.city + ", previsão " + snapshot.nextStopEta + ".");
      announcedState = currentState;
    }
    updateLastUpdateLabel();
  }

  function updateLastUpdateLabel() {
    var labels = mount.querySelectorAll("[data-last-update]");
    if (!labels.length) return;
    var elapsed = Math.max(0, Math.floor((Date.now() - lastSnapshotAt) / 1000));
    var relativeTime = elapsed < 1 ? "agora" : "há " + elapsed + (elapsed === 1 ? " segundo" : " segundos");
    labels.forEach(function (label) { label.textContent = relativeTime; });
  }

  window.CyberBusSimulation.subscribe(render);
  window.setInterval(updateLastUpdateLabel, 1000);
}());
