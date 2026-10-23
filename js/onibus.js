(function () {
  "use strict";

  var app = window.CyberBus;
  var data = app.data;
  var mount = document.getElementById("bus-identification");
  var details = document.getElementById("bus-details");
  var guide = document.getElementById("recognition-guide");

  mount.innerHTML = '<article class="bus-hero"><div class="bus-hero__image"><img src="' + data.bus.image + '" alt="Ônibus rodoviário azul-marinho com faixas azul-ciano, visto de frente e de lado na plataforma"><div class="bus-hero__overlay"><span>Frota</span><strong>' + data.bus.number + '</strong></div></div><div class="bus-hero__panel"><div><span class="badge badge--success"><i></i>Em operação</span><p class="eyebrow">' + app.escapeHtml(data.bus.company) + '</p><h2>' + app.escapeHtml(data.bus.model) + '</h2><p>' + app.escapeHtml(data.route.origin) + ' <span>→</span> ' + app.escapeHtml(data.route.destination) + '</p></div><div class="identity-pair"><div><small>Número do ônibus</small><strong>' + data.bus.number + '</strong></div><div><small>Placa</small><strong>' + data.bus.plate + '</strong></div></div><div class="boarding-callout"><span class="feature-icon feature-icon--blue">' + app.icon("terminal") + '</span><div><small>Seu embarque</small><strong>Plataforma ' + data.route.platform + ' · ' + data.route.sector + '</strong><span>A partir das ' + data.route.boarding + '</span></div></div><a class="button button--primary button--full" href="' + app.withTrip("rodoviaria.html") + '" data-preparing-only hidden><span class="button__label">Ver caminho até a plataforma</span>' + app.icon("chevron", "button__arrow") + "</a></div></article>";

  var items = [
    ["Empresa", data.bus.company], ["Linha", data.route.origin + " → " + data.route.destination],
    ["Modelo", data.bus.model], ["Ano", data.bus.year],
    ["Motorista", data.driver.name], ["Experiência", data.driver.experience],
    ["Embarque", data.route.boarding], ["Saída", data.route.departure]
  ];
  details.innerHTML = items.map(function (item) {
    return '<div class="detail-item"><span>' + app.escapeHtml(item[0]) + '</span><strong>' + app.escapeHtml(item[1]) + "</strong></div>";
  }).join("");

  guide.innerHTML = '<article class="recognition-card"><div class="recognition-card__title"><span class="feature-icon feature-icon--cyan">' + app.icon("shield") + '</span><div><p class="eyebrow">Como reconhecer</p><h2>Três sinais para conferir</h2></div></div><ol><li><span>1</span><div><strong>Cor e faixa</strong><p>' + app.escapeHtml(data.bus.color) + '</p></div></li><li><span>2</span><div><strong>Número de frota</strong><p>O número <b>' + data.bus.number + '</b> aparece na dianteira e nas laterais.</p></div></li><li><span>3</span><div><strong>Placa</strong><p>Confirme <b>' + data.bus.plate + '</b> próximo à porta de embarque.</p></div></li></ol><div class="amenity-row">' + data.bus.amenities.map(function (item) { return '<span>' + app.icon(item === "Wi-Fi" ? "wifi" : item === "Banheiro" ? "restroom" : "check") + app.escapeHtml(item) + "</span>"; }).join("") + "</div></article>";
}());
