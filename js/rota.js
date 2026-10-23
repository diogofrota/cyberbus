(function () {
  "use strict";

  var app = window.CyberBus;
  var data = app.data;
  var mapShell = document.getElementById("travel-map");
  var mapCanvas = document.getElementById("route-leaflet-map");
  var sidebar = document.getElementById("route-sidebar");
  var recenter = document.getElementById("recenter-bus");
  var heading = document.querySelector(".page-heading--route h1");
  var movementBadge = document.querySelector(".page-heading--route .badge--success");
  var liveUpdate = document.getElementById("route-live-update");
  var announcedState = "";
  var mapController = window.CyberBusRealMap
    ? window.CyberBusRealMap.create(mapCanvas, {
      shell: mapShell,
      stops: data.stops,
      busLabel: "Ônibus " + data.bus.number,
      fitPadding: [38, 38],
      recenterZoom: 10
    })
    : null;

  if (!mapController) {
    mapCanvas.innerHTML = '<div class="real-map-fallback inline-alert inline-alert--danger" role="alert">' + app.icon("alert") + '<span>Não foi possível abrir o mapa real.</span></div>';
  }

  function render(snapshot) {
    heading.textContent = snapshot.isComplete ? "Seu ônibus chegou ao destino." : snapshot.isPreparing ? "Seu ônibus está no terminal." : "Seu ônibus está a caminho.";
    movementBadge.innerHTML = '<i></i>' + (snapshot.isComplete ? "Viagem concluída" : snapshot.isPreparing ? "Aguardando saída" : "Ônibus em movimento");
    if (mapController) mapController.update(snapshot);
    var currentState = snapshot.isComplete ? "complete" : snapshot.isPreparing ? "preparing" : snapshot.nextStop.id;
    if (currentState !== announcedState) {
      liveUpdate.textContent = snapshot.isComplete
        ? "Viagem concluída. O ônibus chegou a São Paulo."
        : snapshot.isPreparing
          ? "O ônibus está no terminal de origem, aguardando a saída."
          : "Próxima parada: " + snapshot.nextStop.city + ", previsão " + snapshot.nextStopEta + ".";
      announcedState = currentState;
    }

    app.renderHtml(sidebar, '<article class="live-status-card"><div class="live-status-card__top"><div><span class="live-map-dot"></span><small>Atualizado agora</small></div><strong>' + snapshot.simulatedClock + '</strong></div><div class="progress-ring" role="progressbar" aria-label="Progresso da viagem" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(snapshot.progress) + '" style="--progress:' + snapshot.progress + '"><div><strong>' + snapshot.progressLabel + '</strong><small>percorrido</small></div></div><div class="live-stats"><div><small>Velocidade</small><strong>' + snapshot.speed + ' <span>km/h</span></strong></div><div><small>Restante</small><strong>' + snapshot.distanceRemaining + ' <span>km</span></strong></div></div></article>' +
      '<article class="next-route-card' + (!snapshot.isComplete ? " is-next" : "") + '"><p class="eyebrow">' + (snapshot.isComplete ? "Destino final" : snapshot.isPreparing ? "Primeira parada" : "Próxima parada") + '</p><div class="next-route-card__title"><span class="feature-icon feature-icon--amber">' + app.icon(snapshot.isComplete ? "check" : "pin") + '</span><div><h2>' + app.escapeHtml(snapshot.nextStop.city) + '</h2><p>' + app.escapeHtml(snapshot.nextStop.name) + '</p></div></div><dl><div><dt>Previsão</dt><dd>' + app.escapeHtml(snapshot.nextStopEta) + '</dd></div><div><dt>Até lá</dt><dd>' + snapshot.distanceToNextStop + ' km</dd></div><div><dt>Duração</dt><dd>' + (snapshot.nextStop.duration ? snapshot.nextStop.duration + " min" : "—") + '</dd></div></dl><a class="button button--secondary button--full" href="' + app.withTrip("parada-detalhes.html?id=" + snapshot.nextStop.id) + '"><span class="button__label">Ver detalhes da parada</span>' + app.icon("chevron", "button__arrow") + "</a></article>" +
      '<article class="arrival-card"><span class="feature-icon feature-icon--green">' + app.icon("check") + '</span><div><small>' + (snapshot.isComplete ? "Chegada confirmada em São Paulo" : "Chegada prevista em São Paulo") + '</small><strong>' + snapshot.finalEta + '</strong><p>' + app.escapeHtml(snapshot.isComplete ? "Destino alcançado com segurança" : data.status.message) + "</p></div></article>");
  }

  recenter.addEventListener("click", function () {
    if (!mapController || mapController.recenter() === false) {
      app.showToast("Mapa indisponível", "Não foi possível centralizar o ônibus agora.", "error");
      return;
    }
    app.showToast("Ônibus centralizado", "Esta é a posição simulada mais recente no trajeto real.", "info");
  });

  window.CyberBusSimulation.subscribe(render);
}());
