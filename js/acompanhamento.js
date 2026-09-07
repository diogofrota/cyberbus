(function () {
  "use strict";

  var app = window.CyberBus;
  var data = app.data;
  var mount = document.getElementById("public-trip");
  var lastSnapshotAt = Date.now();

  function timelineState(stop, snapshot) {
    if (snapshot.isComplete) return "done";
    if (stop.progress < snapshot.progress) return "done";
    if (stop.id === snapshot.nextStop.id) return "next";
    return "future";
  }

  function render(snapshot) {
    var tripStatus = snapshot.isComplete ? "Viagem concluída" : data.status.label;
    var punctuality = snapshot.isComplete ? "Chegada confirmada" : data.status.punctuality;
    var nextLabel = snapshot.isComplete ? "Destino alcançado" : "Próxima parada";
    lastSnapshotAt = snapshot.updatedAt || Date.now();
    app.renderHtml(mount, '<header class="public-intro"><div><span class="badge badge--success"><i></i>' + app.escapeHtml(tripStatus) + '</span><p class="eyebrow eyebrow--light">Acompanhando uma viagem</p><h1>' + app.escapeHtml(data.route.origin) + ' <span>→</span> ' + app.escapeHtml(data.route.destination) + '</h1><p>' + app.escapeHtml(data.bus.company) + ' · Ônibus ' + data.bus.number + '</p></div><div class="public-arrival"><small>' + (snapshot.isComplete ? "Chegada confirmada" : "Chegada prevista") + '</small><strong>' + snapshot.finalEta + '</strong><span>' + app.escapeHtml(punctuality) + '</span></div></header>' +
      '<section class="public-status-grid"><div><small>Saída</small><strong>' + data.route.departure + '</strong><span>' + app.escapeHtml(data.route.originTerminal) + '</span></div><div><small>' + nextLabel + '</small><strong>' + app.escapeHtml(snapshot.nextStop.city) + '</strong><span>' + app.escapeHtml(snapshot.nextStopEta) + ' · ' + snapshot.distanceToNextStop + ' km</span></div><div><small>Trajeto concluído</small><strong>' + snapshot.progressLabel + '</strong><span>' + snapshot.distanceRemaining + ' km restantes</span></div></section>' +
      '<div class="public-content-grid"><section class="public-map-card" aria-label="Mapa ilustrativo da viagem"><div class="map-card__top"><div><span class="live-map-dot"></span><strong>Localização do ônibus</strong></div><span class="auto-update">Atualizado <span data-last-update>agora</span></span></div><div class="travel-map travel-map--public"><div class="travel-map__terrain" aria-hidden="true"></div><svg class="travel-map__routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path class="travel-map__route-base" pathLength="100" d="M6 78 C15 69 21 73 31 62 S49 51 57 48 S68 37 75 34 S87 20 94 16"></path><path class="travel-map__route-done" pathLength="100" stroke-dasharray="' + snapshot.progress + ' ' + (100 - snapshot.progress) + '" d="M6 78 C15 69 21 73 31 62 S49 51 57 48 S68 37 75 34 S87 20 94 16"></path></svg><div class="travel-map__labels">' + data.stops.map(function (stop) { var pos = stop.mapPosition || [50, 50]; var isNext = !snapshot.isComplete && stop.id === snapshot.nextStop.id; return '<span class="map-stop map-stop--' + stop.type + (isNext ? " is-next" : "") + '" style="left:' + pos[0] + '%;top:' + pos[1] + '%"><i></i><small>' + app.escapeHtml(stop.shortName) + '</small></span>'; }).join("") + '</div><div class="bus-marker" style="left:' + snapshot.position.x + '%;top:' + snapshot.position.y + '%">' + app.icon("bus") + '<span>Ônibus</span></div><div class="map-attribution">Mapa ilustrativo · localização simulada</div></div></section>' +
      '<section class="public-timeline" aria-labelledby="public-timeline-title"><div class="section-heading section-heading--compact"><div><p class="eyebrow">Etapas da viagem</p><h2 id="public-timeline-title">Linha do tempo</h2></div></div><ol>' + data.stops.map(function (stop) { var state = timelineState(stop, snapshot); var label = state === "done" ? (stop.type === "origin" ? "Saída concluída" : stop.type === "destination" ? "Destino alcançado" : "Parada concluída") : state === "next" ? "Próxima parada" : stop.type === "destination" ? "Destino" : "Prevista"; var displayTime = stop.id === snapshot.nextStop.id ? snapshot.nextStopEta : (stop.estimated || stop.actual || stop.scheduled); return '<li class="public-timeline__item public-timeline__item--' + state + (state === "next" ? " is-next" : "") + '"><span>' + (state === "done" ? app.icon("check") : state === "next" ? "" : "") + '</span><div><strong>' + app.escapeHtml(stop.city) + '</strong><small>' + label + ' · ' + app.escapeHtml(displayTime) + "</small></div></li>"; }).join("") + '</ol><div class="public-update-note">' + app.icon("info") + '<span>Última atualização: <strong data-last-update>agora</strong>. Esta página atualiza automaticamente.</span></div></section></div>');
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
