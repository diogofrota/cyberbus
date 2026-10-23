(function () {
  "use strict";

  var app = window.CyberBus;
  var data = app.data;
  var hero = document.getElementById("trip-hero");
  var actions = document.getElementById("dashboard-actions");
  var aside = document.getElementById("dashboard-aside");
  var pageTitle = document.querySelector(".page-heading--dashboard h1");
  var pageDescription = document.querySelector(".page-heading--dashboard > div > p:last-child");
  var statusChip = document.querySelector(".page-heading--dashboard .updated-chip");
  var resourcesEyebrow = document.querySelector(".dashboard-main .section-heading .eyebrow");
  var resourcesTitle = document.getElementById("resources-title");
  var resourcesDescription = document.querySelector(".dashboard-main .section-heading > p");
  var resetNote = document.getElementById("trip-reset-note");
  var resetCountdown = document.getElementById("trip-reset-countdown");
  var lastComplete = null;
  var lastProgress = null;

  var resources = [
    { icon: "bus", tone: "blue", title: "Meu ônibus", text: "Foto, placa e identificação completa", href: "onibus.html" },
    { icon: "terminal", tone: "cyan", title: "Encontrar plataforma", text: "Caminho até a plataforma 12", href: "rodoviaria.html" },
    { icon: "route", tone: "blue", title: "Acompanhar viagem", text: "Mapa e localização simulada ao vivo", href: "rota.html", featured: true },
    { icon: "stops", tone: "violet", title: "Pontos de parada", text: "Horários e tempo em cada local", href: "paradas.html" },
    { icon: "weather", tone: "cyan", title: "Clima na chegada", text: "Temperatura e chuva no destino", href: "clima.html" },
    { icon: "landmark", tone: "violet", title: "Roteiros turísticos", text: "Passeios com fotos e história em São Paulo", href: "roteiros.html" },
    { icon: "store", tone: "amber", title: "Restaurantes e serviços", text: "Planeje o que fazer na próxima parada", href: "estabelecimentos.html?stop=aparecida", key: "establishments" },
    { icon: "share", tone: "green", title: "Compartilhar viagem", text: "Envie o acompanhamento para a família", href: "compartilhar.html" }
  ];

  var completedResources = [
    { icon: "weather", tone: "cyan", title: "Clima na chegada", text: "Temperatura e chuva no destino", href: "clima.html" },
    { icon: "landmark", tone: "violet", title: "Roteiros turísticos", text: "Fotos, história e visitas em São Paulo", href: "roteiros.html" },
    { icon: "star", tone: "green", title: "Avaliar viagem", text: "Conte como foi sua experiência", href: "avaliacao.html", featured: true }
  ];

  function renderActions(items) {
    actions.innerHTML = items.map(function (item) {
      return '<a class="feature-card' + (item.featured ? " feature-card--featured" : "") + '" href="' + app.withTrip(item.href) + '"' + (item.key ? ' data-resource="' + item.key + '"' : "") + '>' +
        '<span class="feature-icon feature-icon--' + item.tone + '">' + app.icon(item.icon) + "</span>" +
        '<span class="feature-card__content"><strong>' + app.escapeHtml(item.title) + '</strong><small>' + app.escapeHtml(item.text) + "</small></span>" +
        '<span class="feature-card__arrow">' + app.icon("chevron") + "</span></a>";
    }).join("");
  }

  function formatCountdown(seconds) {
    var minutes = Math.floor(seconds / 60);
    return String(minutes).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0");
  }

  function render(snapshot) {
    var phaseChanged = lastComplete !== snapshot.isComplete;
    resetNote.hidden = !snapshot.isComplete;
    if (snapshot.isComplete) resetCountdown.textContent = formatCountdown(snapshot.secondsUntilReset);

    if (phaseChanged) {
      renderActions(snapshot.isComplete ? completedResources : resources);
      resourcesEyebrow.textContent = snapshot.isComplete ? "Depois da chegada" : "Tenha tudo à mão";
      resourcesTitle.textContent = snapshot.isComplete ? "Sua viagem terminou. E agora?" : "Sua viagem, sem dúvidas";
      resourcesDescription.textContent = snapshot.isComplete ? "Veja o clima, explore São Paulo ou avalie sua experiência." : "Informações organizadas para cada momento do trajeto.";
      statusChip.lastChild.textContent = snapshot.isComplete ? " Chegada confirmada" : " Dados simulados ao vivo";
      aside.setAttribute("aria-label", snapshot.isComplete ? "Resumo da viagem concluída" : "Próxima parada e dados da viagem");
      if (lastComplete === false && snapshot.isComplete) app.showToast("Chegada confirmada", "A viagem simulada terminou. Você já pode avaliá-la.", "success");
      if (lastComplete === true && !snapshot.isComplete) {
        app.showToast("Nova simulação iniciada", "A viagem recomeçou do início.", "info");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    lastComplete = snapshot.isComplete;
    if (!phaseChanged && lastProgress === snapshot.progress) return;
    lastProgress = snapshot.progress;

    var tripStatus = snapshot.isComplete ? "Viagem concluída" : data.status.label;
    var punctuality = snapshot.isComplete ? "Chegada confirmada" : data.status.punctuality;
    var nextLabel = snapshot.isComplete ? "Destino alcançado" : "Próxima parada";
    var supportStops = data.stops.filter(function (stop) { return stop.type === "stop"; }).length;
    var heroBottom = snapshot.isComplete
      ? '<div class="trip-hero__bottom"><div><small>Chegada</small><strong>' + snapshot.simulatedClock + '</strong></div><div><small>Distância percorrida</small><strong>' + snapshot.distanceTravelled + ' km</strong></div><div><small>Paradas de apoio</small><strong>' + supportStops + '</strong></div><a class="button button--light" href="' + app.withTrip("avaliacao.html") + '"><span class="button__label">Avaliar viagem</span>' + app.icon("chevron", "button__arrow") + "</a></div>"
      : '<div class="trip-hero__bottom"><div><small>Agora</small><strong>' + snapshot.simulatedClock + '</strong></div><div><small>Distância restante</small><strong>' + snapshot.distanceRemaining + ' km</strong></div><div><small>' + nextLabel + '</small><strong>' + app.escapeHtml(snapshot.nextStop.city) + '</strong></div><a class="button button--light" href="' + app.withTrip("rota.html") + '"><span class="button__label">Ver no mapa</span>' + app.icon("chevron", "button__arrow") + "</a></div>";
    var asideMarkup = snapshot.isComplete
      ? '<article class="aside-card next-stop-card"><div class="aside-card__head"><span class="feature-icon feature-icon--green">' + app.icon("check") + '</span><div><p class="eyebrow">Destino alcançado</p><h2>' + app.escapeHtml(data.route.destinationTerminal) + '</h2></div></div><div class="next-stop-card__metrics"><div><small>Chegada</small><strong>' + snapshot.finalEta + '</strong></div><div><small>Percurso</small><strong>' + data.route.totalDistance + ' km</strong></div><div><small>Paradas</small><strong>' + supportStops + '</strong></div></div></article>' +
        '<article class="aside-card trip-mini-card"><div><span class="feature-icon feature-icon--cyan">' + app.icon("ticket") + '</span><span><small>Resumo da viagem</small><strong>' + app.escapeHtml(data.code) + '</strong></span></div><dl><div><dt>Origem</dt><dd>' + app.escapeHtml(data.route.origin) + '</dd></div><div><dt>Destino</dt><dd>' + app.escapeHtml(data.route.destination) + '</dd></div><div><dt>Empresa</dt><dd>' + app.escapeHtml(data.bus.company) + '</dd></div></dl></article>'
      : '<article class="aside-card next-stop-card"><div class="aside-card__head"><span class="feature-icon feature-icon--amber">' + app.icon("pin") + '</span><div><p class="eyebrow">' + nextLabel + '</p><h2>' + app.escapeHtml(snapshot.nextStop.name) + "</h2></div></div>" +
        '<div class="next-stop-card__metrics"><div><small>Previsão</small><strong>' + app.escapeHtml(snapshot.nextStopEta) + '</strong></div><div><small>Distância</small><strong>' + snapshot.distanceToNextStop + ' km</strong></div><div><small>Parada</small><strong>' + (snapshot.nextStop.duration || "—") + (snapshot.nextStop.duration ? " min" : "") + '</strong></div></div>' +
        '<a class="text-link" href="' + app.withTrip("parada-detalhes.html?id=" + snapshot.nextStop.id) + '">Ver detalhes e serviços' + app.icon("chevron") + "</a></article>" +
        '<article class="aside-card trip-mini-card"><div><span class="feature-icon feature-icon--cyan">' + app.icon("ticket") + '</span><span><small>Localizador</small><strong>' + app.escapeHtml(data.code) + '</strong></span></div><dl><div><dt>Plataforma</dt><dd>' + data.route.platform + " · " + data.route.sector + '</dd></div><div><dt>Embarque</dt><dd>' + data.route.boarding + '</dd></div><div><dt>Motorista</dt><dd>' + app.escapeHtml(data.driver.name) + '</dd></div></dl></article>' +
        '<a class="emergency-link" href="' + app.withTrip("emergencia.html") + '">' + app.icon("shield") + '<span><strong>Precisa de ajuda?</strong><small>Acesse os dados de segurança</small></span>' + app.icon("chevron") + "</a>";
    pageTitle.textContent = snapshot.isComplete ? "Sua viagem foi concluída." : "Sua viagem está em andamento.";
    pageDescription.textContent = snapshot.isComplete ? "Confira o resumo da chegada, descubra São Paulo e avalie sua experiência." : "Veja o que importa agora e acesse todos os detalhes quando precisar.";
    app.renderHtml(hero, '<article class="trip-hero">' +
      '<div class="trip-hero__top"><div class="status-cluster"><span class="badge badge--success"><i></i>' + app.escapeHtml(tripStatus) + '</span><span class="badge badge--neutral">' + app.escapeHtml(punctuality) + '</span></div><span class="trip-hero__company">' + app.icon("bus") + app.escapeHtml(data.bus.company) + " · " + app.escapeHtml(data.bus.number) + "</span></div>" +
      '<div class="trip-hero__route"><div><span>' + app.escapeHtml(data.route.originCode) + '</span><strong>' + app.escapeHtml(data.route.origin) + '</strong><small>' + app.escapeHtml(data.route.originTerminal) + '</small></div><div class="trip-hero__path"><span>' + app.icon("bus") + '</span><i></i><small>' + snapshot.progressLabel + '</small></div><div><span>' + app.escapeHtml(data.route.destinationCode) + '</span><strong>' + app.escapeHtml(data.route.destination) + '</strong><small>' + app.escapeHtml(data.route.destinationTerminal) + "</small></div></div>" +
      '<div class="trip-hero__progress"><div role="progressbar" aria-label="Progresso da viagem" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(snapshot.progress) + '"><span style="width:' + snapshot.progress + '%"></span></div><p><span>Saída <strong>' + data.route.departure + '</strong></span><span>' + (snapshot.isComplete ? "Chegada" : "Chegada prevista") + ' <strong>' + snapshot.finalEta + "</strong></span></p></div>" +
      heroBottom +
      "</article>");

    app.renderHtml(aside, asideMarkup);

    var catalogStop = data.establishments.some(function (item) { return item.stopId === snapshot.nextStop.id; }) ? snapshot.nextStop.id : "resende";
    var catalogLink = actions.querySelector('[data-resource="establishments"]');
    if (catalogLink) catalogLink.href = app.withTrip("estabelecimentos.html?stop=" + catalogStop);
  }

  window.CyberBusSimulation.subscribe(render);
}());
