(function () {
  "use strict";

  var app = window.CyberBus;
  var data = app.data;
  var forecastMount = document.getElementById("weather-forecast");
  var detailsMount = document.getElementById("weather-details");
  var note = document.getElementById("weather-note");
  var forecast = {
    temperature: "20 °C",
    feelsLike: "19 °C",
    rainChance: "15%",
    rain: "Sem chuva prevista"
  };

  function render(snapshot) {
    var hour = Number(snapshot.finalEta.split(":")[0]);
    var isNight = hour >= 18 || hour < 6;
    var sky = isNight ? "Céu parcialmente nublado à noite" : "Sol entre nuvens";
    var daylight = isNight ? "Nuvens à noite" : "Sol e nuvens";

    app.renderHtml(forecastMount, '<article class="aside-card weather-hero">' +
      '<div class="weather-hero__heading"><span class="feature-icon feature-icon--cyan">' + app.icon(isNight ? "moon" : "weather") + '</span><div><p class="eyebrow">Cenário ilustrativo</p><h3>' + app.escapeHtml(data.route.destination) + '</h3><p>' + app.escapeHtml(data.route.destinationTerminal) + '</p></div></div>' +
      '<div class="weather-hero__reading"><strong>' + forecast.temperature + '</strong><div><span class="badge badge--neutral">' + sky + '</span><p>' + forecast.rain + '</p></div></div>' +
      '<div class="next-stop-card__metrics weather-hero__metrics"><div><small>Temperatura</small><strong>' + forecast.temperature + '</strong></div><div><small>Chuva</small><strong>Sem chuva</strong></div><div><small>Céu</small><strong>' + daylight + '</strong></div></div>' +
      '</article>');

    app.renderHtml(detailsMount, '<article class="aside-card trip-mini-card"><div><span class="feature-icon feature-icon--blue">' + app.icon("clock") + '</span><span><small>Chegada prevista</small><strong>' + app.escapeHtml(data.date) + '</strong></span></div><dl><div><dt>Horário estimado</dt><dd>' + app.escapeHtml(snapshot.finalEta) + '</dd></div><div><dt>Cidade</dt><dd>' + app.escapeHtml(data.route.destination) + '</dd></div><div><dt>Local</dt><dd>' + app.escapeHtml(data.route.destinationTerminal) + '</dd></div></dl></article>' +
      '<article class="aside-card weather-details__extra"><div class="aside-card__head"><span class="feature-icon feature-icon--amber">' + app.icon("info") + '</span><div><p class="eyebrow">Outras condições</p><h2>No momento da chegada</h2></div></div><dl class="weather-details__list"><div><dt>Sensação térmica</dt><dd>' + forecast.feelsLike + '</dd></div><div><dt>Chance de chuva</dt><dd>' + forecast.rainChance + '</dd></div></dl></article>');

    note.innerHTML = app.icon("info") + '<span>Esta previsão é uma simulação ilustrativa para ' + app.escapeHtml(data.date) + ', às ' + app.escapeHtml(snapshot.finalEta) + '. Não consulta dados meteorológicos em tempo real.</span>';
  }

  try {
    if (!data.route || !data.date || !window.CyberBusSimulation) throw new Error("Dados da viagem indisponíveis");
    window.CyberBusSimulation.subscribe(render);
  } catch (error) {
    forecastMount.innerHTML = '<div class="inline-alert inline-alert--danger" role="alert">' + app.icon("alert") + '<span>Não foi possível preparar o clima simulado para esta chegada.</span></div>';
    detailsMount.innerHTML = "";
    note.hidden = true;
    app.showToast("Clima indisponível", "Tente abrir esta página novamente.", "error");
  }
}());
