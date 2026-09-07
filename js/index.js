(function () {
  "use strict";

  var form = document.getElementById("consulta");
  var input = document.getElementById("trip-code");
  var error = document.getElementById("code-error");
  var fillButton = document.querySelector("[data-fill-code]");
  var data = window.CYBERBUS_DATA || {};

  function setPreviewText(selector, value) {
    var element = document.querySelector(selector);
    if (element && value != null) element.textContent = value;
  }

  function hydratePreview() {
    if (!data.route) return;
    var supportStops = (data.stops || []).filter(function (stop) { return stop.type === "stop"; }).length;
    var preview = document.querySelector("[data-preview-route]");
    setPreviewText("[data-preview-code]", data.code);
    setPreviewText("[data-preview-departure]", "Hoje · " + data.route.departure);
    setPreviewText("[data-preview-origin-code]", data.route.originCode);
    setPreviewText("[data-preview-origin]", data.route.origin);
    setPreviewText("[data-preview-origin-terminal]", data.route.originTerminal);
    setPreviewText("[data-preview-duration]", data.route.duration);
    setPreviewText("[data-preview-stops]", supportStops + (supportStops === 1 ? " parada" : " paradas"));
    setPreviewText("[data-preview-destination-code]", data.route.destinationCode);
    setPreviewText("[data-preview-destination]", data.route.destination);
    setPreviewText("[data-preview-destination-terminal]", data.route.destinationTerminal);
    setPreviewText("[data-preview-status]", data.status && data.status.label);
    setPreviewText("[data-preview-platform]", "Plataforma " + data.route.platform);
    if (preview) preview.setAttribute("aria-label", "Prévia da viagem " + data.route.origin + " para " + data.route.destination);
    if (fillButton && data.code) {
      fillButton.dataset.fillCode = data.code;
      fillButton.textContent = data.code;
    }
    if (input && data.code) input.placeholder = "Ex.: " + data.code;
  }

  hydratePreview();

  if (!form || !input) return;

  function clearError() {
    input.removeAttribute("aria-invalid");
    error.hidden = true;
    error.textContent = "";
  }

  input.addEventListener("input", function () {
    input.value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    clearError();
  });

  if (fillButton) {
    fillButton.addEventListener("click", function () {
      input.value = fillButton.dataset.fillCode;
      clearError();
      input.focus();
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearError();

    var code = input.value.trim().toUpperCase();
    if (!code) {
      input.setAttribute("aria-invalid", "true");
      error.textContent = "Digite o código da sua passagem para continuar.";
      error.hidden = false;
      input.focus();
      return;
    }

    if (code !== data.code) {
      input.setAttribute("aria-invalid", "true");
      error.textContent = "Não encontramos esse localizador. Para testar, use " + data.code + ".";
      error.hidden = false;
      input.focus();
      return;
    }

    var submitButton = form.querySelector('button[type="submit"]');
    window.CyberBus.setButtonLoading(submitButton, true, "Localizando viagem");
    window.CyberBus.showToast("Viagem encontrada", "Preparando seus dados de embarque…", "success");

    window.setTimeout(function () {
      window.location.href = "viagem.html?trip=" + encodeURIComponent(code);
    }, 900);
  });
}());
