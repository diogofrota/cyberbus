(function () {
  "use strict";

  var app = window.CyberBus;
  var content = document.getElementById("tour-route-content");
  var count = document.getElementById("tour-route-count");
  var buttons = document.querySelectorAll("[data-tour-route]");
  var routes = {
    centro: {
      title: "Centro histórico",
      description: "Um passeio pelas origens da cidade e por um dos seus grandes palcos culturais.",
      area: "Centro Histórico · República",
      stops: [
        {
          name: "Pateo do Collegio",
          category: "Origens da cidade",
          history: "Neste local, uma missa em 25 de janeiro de 1554 marcou a fundação de São Paulo. O conjunto atual mantém viva a memória do antigo colégio jesuíta.",
          address: "Praça Pátio do Colégio, 2 · Centro Histórico",
          visit: "Conheça o Pateo e consulte a programação do Museu Anchieta no site do espaço.",
          officialUrl: "https://www.pateodocollegio.com.br/",
          image: "assets/images/patio-do-colegio-sp.jpg",
          imageAlt: "Fachada do Pateo do Collegio, no Centro Histórico de São Paulo",
          photoAuthor: "SANDRO LUIS",
          photoUrl: "https://commons.wikimedia.org/wiki/File:Patio_do_col%C3%A9gio.jpg",
          photoLicense: "CC BY-SA 4.0",
          photoLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
        },
        {
          name: "Theatro Municipal",
          category: "Arquitetura e cultura",
          history: "Inaugurado em 1911, o Theatro Municipal recebeu a Semana de Arte Moderna de 1922 e segue como um marco da vida artística paulistana.",
          address: "Praça Ramos de Azevedo, s/nº · República",
          visit: "Observe a fachada, reserve uma visita educativa ou confira a programação de espetáculos.",
          officialUrl: "https://theatromunicipal.org.br/visitas-educativas/",
          image: "assets/images/teatro-municipal-sp.jpg",
          imageAlt: "Fachada do Theatro Municipal de São Paulo",
          photoAuthor: "Dornicke",
          photoUrl: "https://commons.wikimedia.org/wiki/File:Theatro_Municipal_de_S%C3%A3o_Paulo,_fachada_01.jpg",
          photoLicense: "Domínio público",
          photoLicenseUrl: ""
        }
      ]
    },
    "arte-verde": {
      title: "Arte e verde",
      description: "Do edifício emblemático da Paulista a uma grande área de lazer e cultura.",
      area: "Avenida Paulista · Ibirapuera",
      stops: [
        {
          name: "MASP",
          category: "Arte e arquitetura",
          history: "Fundado em 1947, o museu ocupa desde 1968 o edifício projetado por Lina Bo Bardi na Avenida Paulista.",
          address: "Avenida Paulista, 1578 · Bela Vista",
          visit: "Explore o acervo e as exposições; confira ingressos e programação no site do museu.",
          officialUrl: "https://masp.org.br/visite",
          image: "assets/images/masp-sp.jpg",
          imageAlt: "Edifício do MASP visto da Avenida Paulista",
          photoAuthor: "gnumarcelo",
          photoUrl: "https://commons.wikimedia.org/wiki/File:View_of_the_S%C3%A3o_Paulo_Museum_of_Art.jpg",
          photoLicense: "CC BY 2.0",
          photoLicenseUrl: "https://creativecommons.org/licenses/by/2.0/"
        },
        {
          name: "Parque Ibirapuera",
          category: "Natureza e cultura",
          history: "Inaugurado em 1954 durante as comemorações do quarto centenário de São Paulo, o parque reúne áreas verdes e espaços culturais.",
          address: "Avenida Pedro Álvares Cabral, s/nº · Vila Mariana",
          visit: "Caminhe pelo parque e consulte a programação dos museus e equipamentos culturais em seu interior.",
          officialUrl: "https://prefeitura.sp.gov.br/web/meio_ambiente/w/parques/regiao_sul/14062",
          image: "assets/images/parque-ibirapuera-sp.jpg",
          imageAlt: "Lago, vegetação e passarela no Parque Ibirapuera",
          photoAuthor: "Rodrigo Soldon",
          photoUrl: "https://commons.wikimedia.org/wiki/File:Parque_Ibirapuera.jpg",
          photoLicense: "CC BY 2.0",
          photoLicenseUrl: "https://creativecommons.org/licenses/by/2.0/"
        }
      ]
    },
    "imigracao-sabores": {
      title: "Imigração e sabores",
      description: "Histórias de quem chegou à cidade e um encontro com a gastronomia paulistana.",
      area: "Mooca · Centro Histórico",
      stops: [
        {
          name: "Museu da Imigração",
          category: "Memória e migração",
          history: "O museu ocupa parte da antiga Hospedaria de Imigrantes do Brás, inaugurada em 1887 para acolher e encaminhar pessoas que chegavam a São Paulo.",
          address: "Rua Visconde de Parnaíba, 1316 · Mooca",
          visit: "Conheça o prédio histórico e as exposições; consulte ingressos no site do museu.",
          officialUrl: "https://museudaimigracao.org.br/visite-o-museu",
          image: "assets/images/museu-imigracao-sp.jpg",
          imageAlt: "Fachada histórica do Museu da Imigração de São Paulo",
          photoAuthor: "José Pedro Viviani; edição de Rodrigo Tetsuo Argenton",
          photoUrl: "https://commons.wikimedia.org/wiki/File:Fachada_do_Museu_da_Imigra%C3%A7%C3%A3o_de_S%C3%A3o_Paulo.JPG",
          photoLicense: "CC BY-SA 4.0",
          photoLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
        },
        {
          name: "Mercado Municipal Paulistano",
          category: "Gastronomia e patrimônio",
          history: "Inaugurado em 1933, o Mercadão se tornou um símbolo do centro e reúne comércio de alimentos em um edifício histórico.",
          address: "Rua da Cantareira, 306 · Centro Histórico",
          visit: "Passeie pelos boxes, observe a arquitetura e conheça as opções gastronômicas.",
          officialUrl: "https://prefeitura.sp.gov.br/w/servico/mercado-municipal-paulistano",
          image: "assets/images/mercado-municipal-sp.jpg",
          imageAlt: "Banca de frutas no Mercado Municipal Paulistano",
          photoAuthor: "Wilfredor",
          photoUrl: "https://commons.wikimedia.org/wiki/File:Municipal_Market_of_S%C3%A3o_Paulo_city.jpg",
          photoLicense: "CC BY-SA 4.0",
          photoLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
        }
      ]
    }
  };

  function photoCredit(stop) {
    var license = stop.photoLicenseUrl
      ? '<a href="' + app.escapeHtml(stop.photoLicenseUrl) + '" target="_blank" rel="noopener noreferrer">' + app.escapeHtml(stop.photoLicense) + "</a>"
      : app.escapeHtml(stop.photoLicense);
    return '<small class="tour-photo-credit">Foto: <a href="' + app.escapeHtml(stop.photoUrl) + '" target="_blank" rel="noopener noreferrer">' + app.escapeHtml(stop.photoAuthor) + " / Wikimedia Commons</a> · " + license + " · miniatura redimensionada</small>";
  }

  function stopCard(stop, index) {
    return '<article class="establishment-card tour-stop-card">' +
      '<div class="establishment-card__image"><img src="' + app.escapeHtml(stop.image) + '" alt="' + app.escapeHtml(stop.imageAlt) + '" loading="lazy" decoding="async"><span class="open-pill">' + (index + 1) + 'ª parada</span></div>' +
      '<div class="establishment-card__body"><div class="establishment-card__category"><span>' + app.escapeHtml(stop.category) + '</span></div>' +
      '<h2>' + app.escapeHtml(stop.name) + '</h2>' +
      '<p class="tour-stop-card__history"><strong>História</strong> ' + app.escapeHtml(stop.history) + '</p>' +
      '<dl class="tour-stop-card__details"><div><dt>Onde visitar</dt><dd>' + app.icon("pin") + app.escapeHtml(stop.address) + '</dd></div><div><dt>Na visita</dt><dd>' + app.escapeHtml(stop.visit) + '</dd></div></dl>' +
      '<div class="establishment-card__footer"><a class="button button--secondary button--small" href="' + app.escapeHtml(stop.officialUrl) + '" target="_blank" rel="noopener noreferrer"><span class="button__label">Planejar visita</span>' + app.icon("external", "button__arrow") + '</a></div>' +
      photoCredit(stop) + '</div></article>';
  }

  function render(routeId) {
    var route = routes[routeId];
    count.textContent = route.stops.length + " paradas sugeridas";
    app.renderHtml(content, '<section class="aside-card tour-route-overview"><div class="aside-card__head"><span class="feature-icon feature-icon--blue">' + app.icon("landmark") + '</span><div><p class="eyebrow">Roteiro selecionado</p><h2 id="tour-route-title">' + app.escapeHtml(route.title) + '</h2></div></div><p>' + app.escapeHtml(route.description) + '</p><div class="product-tags"><span>' + app.escapeHtml(route.area) + '</span><span>' + route.stops.length + ' paradas</span></div></section>' +
      '<div class="establishment-grid tour-stop-grid" aria-label="Paradas do roteiro ' + app.escapeHtml(route.title) + '">' + route.stops.map(stopCard).join("") + "</div>");
  }

  function selectRoute(routeId, notify) {
    if (!Object.prototype.hasOwnProperty.call(routes, routeId)) return;
    buttons.forEach(function (button) {
      var selected = button.dataset.tourRoute === routeId;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    render(routeId);
    if (notify) app.showToast("Roteiro selecionado", routes[routeId].title + " · 2 paradas para explorar", "success");
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (button.getAttribute("aria-pressed") === "true") return;
      selectRoute(button.dataset.tourRoute, true);
    });
  });

  var requestedRoute = app.getQueryParam("route");
  selectRoute(Object.prototype.hasOwnProperty.call(routes, requestedRoute) ? requestedRoute : "centro", false);
}());
