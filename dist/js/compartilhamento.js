(function () {
  "use strict";

  var app = window.CyberBus;
  var data = app.data;
  var field = document.getElementById("share-link");
  var preview = document.getElementById("share-preview");
  var sharePanel = document.querySelector(".share-panel");
  var copyButton = document.querySelector("[data-copy-link]");
  var shareButtons = Array.prototype.slice.call(document.querySelectorAll("[data-share]"));
  var shareControls = [copyButton].concat(shareButtons);
  var shareBusy = false;
  var origin = window.location.protocol === "file:" ? "https://cyberbus-viagem.nifty-fern-8892.chatgpt.site" : window.location.origin;
  var shareUrl = origin + "/acompanhamento.html?trip=" + encodeURIComponent(data.code) + "&share=demo7K2";
  var navigationUrl = app.withTrip("acompanhamento.html?share=demo7K2");

  field.value = shareUrl;

  var introIcon = document.querySelector(".share-panel__intro .feature-icon");
  var notice = document.querySelector(".share-panel .inline-alert");
  var optionIcons = {
    whatsapp: "whatsapp",
    email: "mail",
    copy: "copy"
  };
  introIcon.innerHTML = app.icon("share");
  notice.insertAdjacentHTML("afterbegin", app.icon("info"));
  shareButtons.forEach(function (button) {
    button.querySelector("span").innerHTML = app.icon(optionIcons[button.dataset.share]);
  });

  function renderPreview(snapshot) {
    var statusLabel = snapshot.isComplete ? "Viagem concluída" : "Em viagem";
    var nextLabel = snapshot.isComplete ? "Destino alcançado" : "Próxima parada";
    app.renderHtml(preview, '<div class="phone-preview"><div class="phone-preview__speaker"></div><div class="phone-preview__header">' + app.brandMarkup(false) + '<span>Acompanhamento público</span></div><div class="phone-preview__body"><span class="badge badge--success"><i></i>' + statusLabel + '</span><p>Acompanhando</p><h2>' + app.escapeHtml(data.route.origin) + ' <span>→</span><br>' + app.escapeHtml(data.route.destination) + '</h2><div class="phone-preview__route" style="--preview-progress:' + snapshot.progress + '%"><i></i><i></i><i></i><span style="left:' + snapshot.progress + '%">' + app.icon("bus") + '</span></div><div class="phone-preview__info"><small>Chegada prevista</small><strong>' + snapshot.finalEta + '</strong><small>' + nextLabel + '</small><strong class="' + (!snapshot.isComplete ? "is-next" : "") + '">' + app.escapeHtml(snapshot.nextStop.city) + '</strong></div></div></div><a class="button button--primary button--full" href="' + navigationUrl + '"><span class="button__label">Visualizar como familiar</span>' + app.icon("external", "button__arrow") + '</a><div class="share-privacy">' + app.icon("shield") + '<p><strong>O que fica privado</strong><span>O link não mostra nome, assento, documento ou dados pessoais do passageiro.</span></p></div>');
  }

  function setShareBusy(button, isBusy) {
    shareBusy = isBusy;
    shareControls.forEach(function (control) {
      control.disabled = isBusy;
      if (!isBusy || control !== button) control.removeAttribute("aria-busy");
    });
    if (isBusy) {
      button.setAttribute("aria-busy", "true");
      sharePanel.setAttribute("aria-busy", "true");
    } else {
      sharePanel.removeAttribute("aria-busy");
    }
  }

  function copyWithFeedback(button) {
    if (shareBusy) return;
    var original = button.textContent;
    var strong = button.querySelector("strong");
    var originalStrong = strong ? strong.textContent : "";
    var copyOperation;
    setShareBusy(button, true);
    if (button.matches("[data-copy-link]")) button.textContent = "Copiando…";
    if (strong) strong.textContent = "Copiando…";
    try {
      copyOperation = app.copyText(shareUrl);
    } catch (error) {
      copyOperation = Promise.reject(error);
    }
    var outcome = Promise.resolve(copyOperation).then(function () {
      return { succeeded: true };
    }, function (error) {
      return { succeeded: false, error: error };
    });
    var feedbackDelay = new Promise(function (resolve) { window.setTimeout(resolve, 450); });

    Promise.all([outcome, feedbackDelay]).then(function (results) {
      if (results[0].succeeded) {
        app.showToast("Link copiado", "Agora é só enviar para quem vai acompanhar.", "success");
      } else {
        field.focus();
        field.select();
        app.showToast("Selecione o link", "Copie o endereço selecionado manualmente.", "error");
      }
    }).finally(function () {
      setShareBusy(button, false);
      if (button.matches("[data-copy-link]")) button.textContent = original;
      if (strong) strong.textContent = originalStrong;
    });
  }

  copyButton.addEventListener("click", function (event) { copyWithFeedback(event.currentTarget); });
  shareButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (shareBusy) return;
      if (button.dataset.share === "copy") {
        copyWithFeedback(button);
        return;
      }
      var label = button.querySelector("strong");
      var defaultLabel = label.textContent;
      setShareBusy(button, true);
      label.textContent = button.dataset.share === "whatsapp" ? "Abrindo…" : "Preparando…";
      window.setTimeout(function () {
        setShareBusy(button, false);
        label.textContent = defaultLabel;
        app.showToast("Compartilhamento simulado", button.dataset.share === "whatsapp" ? "O WhatsApp seria aberto com o link pronto para enviar." : "Seu aplicativo de e-mail seria aberto com a mensagem pronta.", "success");
      }, 650);
    });
  });

  window.CyberBusSimulation.subscribe(renderPreview);
}());
