(function () {
  "use strict";

  var app = window.CyberBus;
  var data = app.data;
  var requestedId = app.getQueryParam("id");
  var validItem = data.establishments.find(function (entry) { return entry.id === requestedId; });
  var item = validItem || app.getEstablishment("cozinha-vale-real");
  var stop = app.getStop(item.stopId);
  var categories = (item.tags && item.tags.length ? item.tags : [item.category]).filter(function (category, index, entries) {
    return entries.indexOf(category) === index;
  });
  var breadcrumb = document.getElementById("establishment-breadcrumb");
  var mount = document.getElementById("establishment-detail");

  breadcrumb.innerHTML = '<a href="' + app.withTrip("viagem.html") + '">Minha viagem</a><span>/</span><a href="' + app.withTrip("estabelecimentos.html?stop=" + stop.id) + '">Estabelecimentos</a><span>/</span><span aria-current="page">' + app.escapeHtml(item.name) + "</span>";

  mount.innerHTML = (!validItem && requestedId ? '<div class="inline-alert inline-alert--warning">' + app.icon("info") + '<span>Estabelecimento não encontrado. Exibindo a Cozinha Vale Real.</span></div>' : "") +
    '<section class="establishment-hero"><div class="establishment-hero__image"><img src="' + item.image + '" alt="Ambiente e produtos de ' + app.escapeHtml(item.name) + '"><span class="open-pill">' + app.escapeHtml(item.hours) + '</span></div><div class="establishment-hero__content"><p class="eyebrow">' + app.escapeHtml(item.category) + '</p><h1>' + app.escapeHtml(item.name) + '</h1><p>' + app.escapeHtml(item.description) + '</p><div class="product-tags" aria-label="Categorias">' + categories.map(function (category) { return '<span>' + app.escapeHtml(category) + '</span>'; }).join("") + '</div><div class="establishment-meta"><span class="rating">' + app.icon("star") + item.rating.toFixed(1) + ' <small>(' + item.reviews + ' avaliações)</small></span><span>' + app.icon("location") + app.escapeHtml(item.location) + '</span><span>' + app.icon("ticket") + app.escapeHtml(item.priceRange) + '</span></div><div class="inline-alert inline-alert--info">' + app.icon("info") + '<span>Cardápio para consulta. Compras não estão disponíveis neste protótipo.</span></div><a class="button button--secondary" href="' + app.withTrip("estabelecimentos.html?stop=" + stop.id) + '"><span class="button__label">Voltar aos estabelecimentos</span></a></div></section>' +
    '<section class="menu-section"><div class="section-heading"><div><p class="eyebrow">Escolha com calma</p><h2>Cardápio</h2></div><p>Valores fictícios para demonstração.</p></div><div class="menu-layout">' + item.menu.map(function (group) {
      return '<article class="menu-group"><h3>' + app.escapeHtml(group.section) + '</h3><div>' + group.items.map(function (menuItem) { return '<div class="menu-item"><div><strong>' + app.escapeHtml(menuItem.name) + '</strong><p>' + app.escapeHtml(menuItem.description) + '</p></div><span>' + app.escapeHtml(menuItem.price) + "</span></div>"; }).join("") + "</div></article>";
    }).join("") + "</div></section>";
}());
