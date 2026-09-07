(function () {
  "use strict";

  var app = window.CyberBus;
  var data = app.data;
  var requestedStopId = app.getQueryParam("stop") || "resende";
  var stop = app.getStop(requestedStopId);
  var items = data.establishments.filter(function (item) { return item.stopId === requestedStopId; });
  var selectedFilter = "Todos";
  var heading = document.getElementById("marketplace-heading");
  var grid = document.getElementById("establishment-grid");
  var count = document.getElementById("results-count");
  var filterButtons = document.querySelectorAll("[data-filter]");

  heading.innerHTML = '<div><p class="eyebrow">' + app.escapeHtml(stop.city) + ' · ' + app.escapeHtml(stop.name) + '</p><h1>Escolha antes de chegar.</h1><p>Veja opções, preços e horários para aproveitar melhor seus ' + stop.duration + ' minutos de parada.</p></div><a class="button button--secondary" href="' + app.withTrip("parada-detalhes.html?id=" + stop.id) + '"><span class="button__label">Detalhes da parada</span></a>';

  function render() {
    var filtered = selectedFilter === "Todos" ? items : items.filter(function (item) { return item.tags.indexOf(selectedFilter) >= 0 || item.category === selectedFilter; });
    count.textContent = filtered.length + (filtered.length === 1 ? " opção encontrada" : " opções encontradas");

    if (!items.length) {
      grid.innerHTML = '<div class="empty-state"><span class="feature-icon feature-icon--amber">' + app.icon("store") + '</span><h2>Catálogo ainda não disponível</h2><p>Neste protótipo, os estabelecimentos completos estão disponíveis para a Parada Vale Real, em Resende.</p><a class="button button--primary" href="' + app.withTrip("estabelecimentos.html?stop=resende") + '"><span class="button__label">Explorar Vale Real</span>' + app.icon("chevron", "button__arrow") + "</a></div>";
      count.textContent = "0 opções encontradas";
      return 0;
    }

    if (!filtered.length) {
      grid.innerHTML = '<div class="empty-state"><span class="feature-icon feature-icon--cyan">' + app.icon("info") + '</span><h2>Nenhuma opção neste filtro</h2><p>Tente outra categoria ou volte a ver todos os estabelecimentos.</p><button class="button button--secondary" type="button" data-show-all><span class="button__label">Ver todos</span></button></div>';
      grid.querySelector("[data-show-all]").addEventListener("click", function () {
        applyFilter("Todos");
      });
      return 0;
    }

    grid.innerHTML = filtered.map(function (item) {
      return '<article class="establishment-card"><a class="establishment-card__image" href="' + app.withTrip("estabelecimento-detalhes.html?stop=" + item.stopId + "&id=" + item.id) + '"><img src="' + item.image + '" alt="Ambiente de ' + app.escapeHtml(item.name) + '" loading="lazy"><span class="open-pill">' + app.escapeHtml(item.hours) + '</span></a><div class="establishment-card__body"><div class="establishment-card__category"><span>' + app.escapeHtml(item.category) + '</span><span class="rating">' + app.icon("star") + item.rating.toFixed(1) + '</span></div><h2>' + app.escapeHtml(item.name) + '</h2><p>' + app.escapeHtml(item.description) + '</p><div class="product-tags">' + item.products.map(function (product) { return '<span>' + app.escapeHtml(product) + '</span>'; }).join("") + '</div><div class="establishment-card__footer"><div><small>Faixa de preço</small><strong>' + app.escapeHtml(item.priceRange) + '</strong></div><a class="button button--secondary button--small" href="' + app.withTrip("estabelecimento-detalhes.html?stop=" + item.stopId + "&id=" + item.id) + '"><span class="button__label">Ver cardápio</span>' + app.icon("chevron", "button__arrow") + "</a></div></div></article>";
    }).join("");
    return filtered.length;
  }

  function updateButtons() {
    filterButtons.forEach(function (button) {
      var active = button.dataset.filter === selectedFilter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function applyFilter(value) {
    var available = Array.prototype.map.call(filterButtons, function (button) { return button.dataset.filter; });
    if (available.indexOf(value) < 0) throw new Error("Filtro inválido: " + value);
    selectedFilter = value;
    updateButtons();
    return render();
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      applyFilter(button.dataset.filter);
    });
  });

  render();

  if (document.modelContext && typeof document.modelContext.registerTool === "function") {
    try {
      Promise.resolve(document.modelContext.registerTool({
        name: "filter_establishments",
        title: "Filtrar estabelecimentos",
        description: "Filtra a lista visível de restaurantes e serviços da parada pela categoria informada.",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: ["Todos", "Restaurantes", "Lanches", "Cafés", "Conveniência", "Lojas"]
            }
          },
          required: ["category"],
          additionalProperties: false
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: function (input) {
          if (!input || typeof input.category !== "string") throw new Error("Informe uma categoria válida.");
          var resultCount = applyFilter(input.category);
          return { category: input.category, visibleResults: resultCount };
        }
      })).catch(function () { /* A interface continua funcional sem WebMCP. */ });
    } catch (error) {
      // WebMCP é progressivo e não bloqueia navegadores sem suporte.
    }
  }
}());
