(function () {
  "use strict";

  var app = window.CyberBus;
  var data = app.data;
  var mount = document.getElementById("emergency-content");
  var dialog = document.getElementById("emergency-dialog");
  var confirmButton = document.getElementById("confirm-help");
  var closeButton = dialog.querySelector(".confirm-dialog__close");
  var cancelButtons = dialog.querySelectorAll('[value="cancel"]');
  var confirmationInProgress = false;
  closeButton.innerHTML = app.icon("close");
  dialog.querySelector(".dialog-icon").innerHTML = app.icon("alert");

  function render(snapshot) {
    var positionLabel = snapshot.isComplete ? "Destino alcançado" : "Próximo ponto";
    app.renderHtml(mount, '<div class="emergency-layout"><section class="emergency-primary"><div class="emergency-hero"><span>' + app.icon("shield") + '</span><div><h2>Você está em uma viagem monitorada</h2><p>Em uma aplicação real, estes dados ajudariam uma equipe de suporte a entender rapidamente a situação.</p></div></div><div class="emergency-data"><div><small>Empresa e ônibus</small><strong>' + app.escapeHtml(data.bus.company) + ' · ' + data.bus.number + '</strong></div><div><small>Placa</small><strong>' + data.bus.plate + '</strong></div><div><small>Motorista</small><strong>' + app.escapeHtml(data.driver.name) + '</strong></div><div><small>Linha</small><strong>' + app.escapeHtml(data.route.origin) + ' → ' + app.escapeHtml(data.route.destination) + '</strong></div><div><small>Posição atual simulada</small><strong>' + snapshot.distanceTravelled + ' km após ' + app.escapeHtml(data.route.origin) + '</strong></div><div class="' + (!snapshot.isComplete ? "is-next" : "") + '"><small>' + positionLabel + '</small><strong>' + app.escapeHtml(snapshot.nextStop.name) + ' · ' + snapshot.distanceToNextStop + ' km</strong></div></div><div class="emergency-action"><div class="inline-alert inline-alert--danger">' + app.icon("alert") + '<span>' + app.escapeHtml(data.safety.notice) + '</span></div><button class="button button--danger button--large button--full" id="request-help" type="button"><span class="button__label">SOLICITAR AJUDA</span></button><p>Em uma situação real, procure também os canais oficiais de emergência da sua região.</p></div></section><aside class="emergency-aside"><article class="aside-card"><p class="eyebrow">Dados que poderiam ser enviados</p><h2>Contexto completo, com um toque</h2><ul class="check-list">' + data.safety.sharedFields.map(function (field) { return '<li>' + app.icon("check") + '<span>' + app.escapeHtml(field) + '</span></li>'; }).join("") + '</ul></article><article class="aside-card protocol-card"><span class="feature-icon feature-icon--red">' + app.icon("ticket") + '</span><div><small>Protocolo demonstrativo</small><strong>' + data.safety.supportProtocol + '</strong></div></article></aside></div>');
    document.getElementById("request-help").addEventListener("click", openDialog);
  }

  function openDialog() {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function setConfirmationLocked(isLocked) {
    confirmationInProgress = isLocked;
    cancelButtons.forEach(function (button) { button.disabled = isLocked; });
    if (isLocked) dialog.setAttribute("aria-busy", "true");
    else dialog.removeAttribute("aria-busy");
  }

  dialog.addEventListener("cancel", function (event) {
    if (confirmationInProgress) event.preventDefault();
  });

  confirmButton.addEventListener("click", function () {
    if (confirmationInProgress) return;
    setConfirmationLocked(true);
    app.setButtonLoading(confirmButton, true, "Simulando envio");
    window.setTimeout(function () {
      app.setButtonLoading(confirmButton, false);
      setConfirmationLocked(false);
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
      app.showToast("Simulação concluída", "Nenhum serviço real foi acionado.", "success");
    }, 1200);
  });

  window.CyberBusSimulation.subscribe(render);
}());
