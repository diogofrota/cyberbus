(function () {
  "use strict";

  var app = window.CyberBus;
  var data = app.data;
  var requestedId = app.getQueryParam("id");
  var validStop = data.stops.find(function (item) { return item.id === requestedId; });
  var stop = validStop || app.getStop("resende");
  var mount = document.getElementById("stop-detail");
  var serviceIcons = {
    "Restaurante": "utensils", "Alimentação": "utensils", "Lanchonete": "store", "Café": "coffee",
    "Banheiro": "restroom", "Wi-Fi": "wifi", "Estacionamento": "parking", "Loja": "store",
    "Conveniência": "cart", "Caixa eletrônico": "bank", "Bilheteria": "ticket", "Táxi": "route",
    "Metrô": "route", "Aplicativos de mobilidade": "route"
  };

  function render(snapshot) {
    var distanceToStop = Math.max(0, stop.distanceFromOrigin - snapshot.distanceTravelled);
    var statusLabel = stop.type === "origin" ? (snapshot.isPreparing ? "Saída prevista" : "Saída concluída") : (snapshot.isComplete || stop.progress < snapshot.progress) ? (stop.type === "destination" ? "Destino alcançado" : "Parada concluída") : stop.id === snapshot.nextStop.id && !snapshot.isPreparing ? "Próxima parada" : "Parada prevista";
    var displayEta = stop.id === snapshot.nextStop.id ? snapshot.nextStopEta : (stop.estimated || stop.actual || stop.scheduled);
    var hasBusinesses = data.establishments.some(function (item) { return item.stopId === stop.id; });
    var catalogUrl = hasBusinesses ? "estabelecimentos.html?stop=" + stop.id : "estabelecimentos.html?stop=resende";

    app.renderHtml(mount, (!validStop && requestedId ? '<div class="inline-alert inline-alert--warning">' + app.icon("info") + '<span>Parada não encontrada. Exibindo a Parada Vale Real.</span></div>' : "") +
      '<header class="page-heading"><div><p class="eyebrow">' + app.escapeHtml(stop.city) + '</p><h1>' + app.escapeHtml(stop.name) + '</h1><p>' + app.escapeHtml(stop.description) + '</p></div><span class="badge ' + (statusLabel === "Próxima parada" ? "badge--warning is-next" : "badge--neutral") + '">' + statusLabel + '</span></header>' +
      '<section class="stop-detail-hero"><div class="stop-detail-hero__visual"><div class="stop-pin-illustration">' + app.icon("pin") + '<span>' + app.escapeHtml(stop.city) + '</span></div><div class="road-lines" aria-hidden="true"><i></i><i></i><i></i></div><div class="stop-detail-hero__location">' + app.icon("location") + '<span><small>Localização</small><strong>' + app.escapeHtml(stop.location) + '</strong></span></div></div><div class="stop-detail-hero__stats"><div><span class="feature-icon feature-icon--blue">' + app.icon("clock") + '</span><small>Previsão de chegada</small><strong>' + app.escapeHtml(displayEta) + '</strong></div><div><span class="feature-icon feature-icon--amber">' + app.icon("route") + '</span><small>Distância até a parada</small><strong>' + distanceToStop + ' km</strong></div><div><span class="feature-icon feature-icon--green">' + app.icon("clock") + '</span><small>Tempo de parada</small><strong>' + (stop.duration ? stop.duration + " minutos" : "—") + '</strong></div><div><span class="feature-icon feature-icon--cyan">' + app.icon("store") + '</span><small>Funcionamento</small><strong>' + app.escapeHtml(stop.openingHours) + "</strong></div></div></section>" +
      '<section class="content-section"><div class="section-heading"><div><p class="eyebrow">Estrutura do local</p><h2>Serviços disponíveis</h2></div><p>Planeje sua pausa antes de chegar.</p></div><div class="services-grid">' + stop.services.map(function (service) { return '<div class="service-card"><span>' + app.icon(serviceIcons[service] || "check") + '</span><strong>' + app.escapeHtml(service) + "</strong></div>"; }).join("") + '</div></section>' +
      '<section class="stop-catalog-cta"><div><span class="feature-icon feature-icon--amber">' + app.icon("utensils") + '</span><div><p class="eyebrow">Coma bem na estrada</p><h2>' + (hasBusinesses ? "Veja restaurantes e lojas" : "Explore o catálogo demonstrativo") + '</h2><p>' + (hasBusinesses ? "Compare opções, horários e preços disponíveis nesta parada." : "Nesta versão, o catálogo completo está disponível para a Parada Vale Real, em Resende.") + '</p></div></div><a class="button button--primary" href="' + app.withTrip(catalogUrl) + '"><span class="button__label">Ver estabelecimentos</span>' + app.icon("chevron", "button__arrow") + "</a></section>");
  }

  window.CyberBusSimulation.subscribe(render);
}());
