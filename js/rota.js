(function () {
  "use strict";

  var app = window.CyberBus;
  var data = app.data;
  var map = document.getElementById("travel-map");
  var marker = document.getElementById("bus-marker");
  var routeDone = document.querySelector(".travel-map__route-done");
  var sidebar = document.getElementById("route-sidebar");
  var stopsLayer = document.getElementById("map-stops");
  var recenter = document.getElementById("recenter-bus");
  var heading = document.querySelector(".page-heading--route h1");
  var movementBadge = document.querySelector(".page-heading--route .badge--success");
  marker.innerHTML = app.icon("bus") + '<span>Ônibus ' + data.bus.number + "</span>";
  stopsLayer.innerHTML = data.stops.map(function (stop) {
    var position = stop.mapPosition || [50, 50];
    return '<span class="map-stop map-stop--' + stop.type + '" data-stop-id="' + app.escapeHtml(stop.id) + '" style="left:' + position[0] + '%;top:' + position[1] + '%"><i></i><small>' + app.escapeHtml(stop.shortName) + "</small></span>";
  }).join("");

  function render(snapshot) {
    heading.textContent = snapshot.isComplete ? "Seu ônibus chegou ao destino." : "Seu ônibus está a caminho.";
    movementBadge.innerHTML = '<i></i>' + (snapshot.isComplete ? "Viagem concluída" : "Ônibus em movimento");
    marker.style.left = snapshot.position.x + "%";
    marker.style.top = snapshot.position.y + "%";
    routeDone.style.strokeDasharray = snapshot.progress + " " + (100 - snapshot.progress);
    stopsLayer.querySelectorAll("[data-stop-id]").forEach(function (label) {
      label.classList.toggle("is-next", !snapshot.isComplete && label.dataset.stopId === snapshot.nextStop.id);
    });

    app.renderHtml(sidebar, '<article class="live-status-card"><div class="live-status-card__top"><div><span class="live-map-dot"></span><small>Atualizado agora</small></div><strong>' + snapshot.simulatedClock + '</strong></div><div class="progress-ring" role="progressbar" aria-label="Progresso da viagem" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(snapshot.progress) + '" style="--progress:' + snapshot.progress + '"><div><strong>' + snapshot.progressLabel + '</strong><small>percorrido</small></div></div><div class="live-stats"><div><small>Velocidade</small><strong>' + snapshot.speed + ' <span>km/h</span></strong></div><div><small>Restante</small><strong>' + snapshot.distanceRemaining + ' <span>km</span></strong></div></div></article>' +
      '<article class="next-route-card' + (!snapshot.isComplete ? " is-next" : "") + '"><p class="eyebrow">' + (snapshot.isComplete ? "Destino final" : "Próxima parada") + '</p><div class="next-route-card__title"><span class="feature-icon feature-icon--amber">' + app.icon(snapshot.isComplete ? "check" : "pin") + '</span><div><h2>' + app.escapeHtml(snapshot.nextStop.city) + '</h2><p>' + app.escapeHtml(snapshot.nextStop.name) + '</p></div></div><dl><div><dt>Previsão</dt><dd>' + app.escapeHtml(snapshot.nextStopEta) + '</dd></div><div><dt>Até lá</dt><dd>' + snapshot.distanceToNextStop + ' km</dd></div><div><dt>Duração</dt><dd>' + (snapshot.nextStop.duration ? snapshot.nextStop.duration + " min" : "—") + '</dd></div></dl><a class="button button--secondary button--full" href="' + app.withTrip("parada-detalhes.html?id=" + snapshot.nextStop.id) + '"><span class="button__label">Ver detalhes da parada</span>' + app.icon("chevron", "button__arrow") + "</a></article>" +
      '<article class="arrival-card"><span class="feature-icon feature-icon--green">' + app.icon("check") + '</span><div><small>' + (snapshot.isComplete ? "Chegada confirmada em São Paulo" : "Chegada prevista em São Paulo") + '</small><strong>' + snapshot.finalEta + '</strong><p>' + app.escapeHtml(snapshot.isComplete ? "Destino alcançado com segurança" : data.status.message) + "</p></div></article>");
  }

  recenter.addEventListener("click", function () {
    map.classList.remove("is-centered");
    requestAnimationFrame(function () { map.classList.add("is-centered"); });
    app.showToast("Ônibus centralizado", "Esta é a posição simulada mais recente.", "info");
  });

  window.CyberBusSimulation.subscribe(render);
}());
