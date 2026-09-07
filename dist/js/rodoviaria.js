(function () {
  "use strict";

  var app = window.CyberBus;
  var data = app.data;
  var sidebar = document.getElementById("terminal-sidebar");
  var map = document.getElementById("terminal-map");
  var toggles = document.querySelectorAll("[data-map-view]");

  sidebar.innerHTML = '<article class="boarding-card"><div class="boarding-card__header"><span class="feature-icon feature-icon--blue">' + app.icon("ticket") + '</span><div><p class="eyebrow">Seu embarque</p><h2>Plataforma ' + data.route.platform + '</h2><span>' + data.route.sector + '</span></div></div><dl><div><dt>Ônibus</dt><dd>' + app.escapeHtml(data.bus.company) + ' · ' + data.bus.number + '</dd></div><div><dt>Linha</dt><dd>' + app.escapeHtml(data.route.origin) + ' → ' + app.escapeHtml(data.route.destination) + '</dd></div><div><dt>Embarque</dt><dd>' + data.route.boarding + '</dd></div><div><dt>Saída</dt><dd>' + data.route.departure + '</dd></div></dl></article>' +
    '<article class="direction-card"><div class="direction-card__summary"><div><small>Tempo a pé</small><strong>' + data.terminal.walkingTime + '</strong></div><div><small>Distância</small><strong>' + data.terminal.distance + '</strong></div></div><h2>Siga estes passos</h2><ol>' + data.terminal.directions.map(function (step, index) { return '<li><span>' + (index + 1) + '</span><div><strong>' + app.escapeHtml(step.title) + '</strong><small>' + app.escapeHtml(step.detail) + '</small></div></li>'; }).join("") + '</ol><button class="button button--primary button--full" type="button" id="start-guidance"><span class="button__label">Iniciar orientação</span><span class="growing-dots" aria-hidden="true"><i></i><i></i><i></i></span>' + app.icon("location", "button__arrow") + '</button><p class="prototype-note">A orientação é uma simulação visual para este protótipo.</p></article>';

  toggles.forEach(function (button) {
    button.addEventListener("click", function () {
      toggles.forEach(function (item) {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      map.classList.toggle("show-places", button.dataset.mapView === "places");
    });
  });

  var guidanceButton = document.getElementById("start-guidance");
  guidanceButton.addEventListener("click", function () {
    app.setButtonLoading(guidanceButton, true, "Preparando rota");
    window.setTimeout(function () {
      app.setButtonLoading(guidanceButton, false);
      map.classList.add("is-guiding");
      app.showToast("Orientação iniciada", "Siga a linha azul até a plataforma 12.", "success");
    }, 900);
  });
}());
