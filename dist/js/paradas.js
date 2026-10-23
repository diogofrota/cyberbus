(function () {
  "use strict";

  var app = window.CyberBus;
  var data = app.data;
  var timeline = document.getElementById("stops-timeline");
  var summary = document.getElementById("stops-summary");

  function stopState(stop, snapshot) {
    if (snapshot.isComplete) return { key: "done", label: stop.type === "destination" ? "Destino alcançado" : stop.type === "origin" ? "Saída concluída" : "Parada concluída" };
    if (stop.type === "origin") return snapshot.isPreparing ? { key: "next", label: "Saída prevista" } : { key: "done", label: "Saída concluída" };
    if (stop.progress < snapshot.progress) return { key: "done", label: stop.type === "origin" ? "Saída concluída" : "Parada concluída" };
    if (!snapshot.isPreparing && stop.id === snapshot.nextStop.id) return { key: "next", label: "Próxima parada" };
    if (stop.type === "destination") return { key: "future", label: "Destino final" };
    return { key: "future", label: "Prevista" };
  }

  function render(snapshot) {
    app.renderHtml(timeline, data.stops.map(function (stop) {
      var state = stopState(stop, snapshot);
      var timeLabel = stop.type === "origin" ? "Saída" : stop.type === "destination" ? "Chegada" : "Previsão";
      var displayTime = stop.id === snapshot.nextStop.id ? snapshot.nextStopEta : (stop.estimated || stop.actual || stop.scheduled);
      var extra = stop.duration ? '<span>' + app.icon("clock") + stop.duration + ' min de parada</span>' : "";
      return '<article class="stop-item stop-item--' + state.key + '"><div class="stop-item__node">' + (state.key === "done" ? app.icon("check") : state.key === "next" ? '<span></span>' : "") + '</div><a class="stop-card" href="' + app.withTrip("parada-detalhes.html?id=" + stop.id) + '"><div class="stop-card__head"><div><span class="stop-state stop-state--' + state.key + '">' + state.label + '</span><h2>' + app.escapeHtml(stop.city) + '</h2><p>' + app.escapeHtml(stop.name) + '</p></div><div class="stop-card__time"><small>' + timeLabel + '</small><strong>' + app.escapeHtml(displayTime) + '</strong></div></div><div class="stop-card__footer">' + extra + '<span>Ver detalhes ' + app.icon("chevron") + "</span></div></a></article>";
    }).join(""));

    var hasNextCatalog = data.establishments.some(function (item) { return item.stopId === snapshot.nextStop.id; });
    var catalogStop = hasNextCatalog ? snapshot.nextStop : app.getStop("resende");
    app.renderHtml(summary, '<article class="aside-card journey-overview"><p class="eyebrow">Resumo do percurso</p><h2>' + data.route.origin + ' <span>→</span> ' + data.route.destination + '</h2><dl><div><dt>Distância total</dt><dd>' + data.route.totalDistance + ' km</dd></div><div><dt>Duração prevista</dt><dd>' + data.route.duration + '</dd></div><div><dt>Paradas de apoio</dt><dd>3</dd></div><div><dt>Chegada prevista</dt><dd>' + snapshot.finalEta + '</dd></div></dl><div class="mini-progress" role="progressbar" aria-label="Progresso da viagem" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(snapshot.progress) + '"><span style="width:' + snapshot.progress + '%"></span></div><p class="journey-overview__status"><i></i>' + snapshot.progressLabel + ' do percurso concluído</p></article>' +
      '<article class="aside-card service-tip"><span class="feature-icon feature-icon--amber">' + app.icon("store") + '</span><div><h2>' + (snapshot.isComplete ? "Reveja as opções da rota" : "Planeje sua próxima pausa") + '</h2><p>' + (hasNextCatalog ? "Veja refeições, café e serviços antes de o ônibus chegar." : "Explore o catálogo demonstrativo da Parada Vale Real.") + '</p><a class="text-link" href="' + app.withTrip("estabelecimentos.html?stop=" + catalogStop.id) + '">Explorar ' + app.escapeHtml(catalogStop.name) + app.icon("chevron") + "</a></div></article>");
  }

  window.CyberBusSimulation.subscribe(render);
}());
