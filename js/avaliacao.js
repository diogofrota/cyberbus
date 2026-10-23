(function () {
  "use strict";

  var app = window.CyberBus;
  var simulation = window.CyberBusSimulation;
  var data = app.data;
  var form = document.getElementById("evaluation-form");
  var criteriaMount = document.getElementById("evaluation-criteria");
  var recommendation = document.getElementById("evaluation-recommendation");
  var characterCount = document.getElementById("evaluation-character-count");
  var error = document.getElementById("evaluation-error");
  var submitButton = document.getElementById("evaluation-submit");
  var success = document.getElementById("evaluation-success");
  var countdown = document.getElementById("evaluation-countdown");
  var criteria = [
    { id: "bus", label: "Ônibus", detail: "Conforto e condições do veículo" },
    { id: "stops", label: "Pontos de parada", detail: "Estrutura e tempo nas paradas" },
    { id: "punctuality", label: "Pontualidade", detail: "Horários ao longo do trajeto" },
    { id: "service", label: "Atendimento", detail: "Equipe e informações recebidas" }
  ];
  var activeCycleKey = "";
  var storageKey = "";
  var isSubmitting = false;
  var isRedirecting = false;

  function cycleKey(snapshot) {
    return String(snapshot.cycleStartedAt) + ":" + String(snapshot.cycleId);
  }

  function returnToTrip() {
    if (isRedirecting) return;
    isRedirecting = true;
    window.location.replace(app.withTrip("viagem.html"));
  }

  function isCurrentCycle(snapshot) {
    return snapshot.isComplete && cycleKey(snapshot) === activeCycleKey;
  }

  function formatCountdown(seconds) {
    var remaining = Math.max(0, Math.ceil(Number(seconds) || 0));
    return String(Math.floor(remaining / 60)).padStart(2, "0") + ":" + String(remaining % 60).padStart(2, "0");
  }

  function updateCountdown(snapshot) {
    var current = snapshot || simulation.getSnapshot();
    if (!isCurrentCycle(current)) {
      returnToTrip();
      return;
    }
    countdown.textContent = formatCountdown(current.secondsUntilReset);
  }

  function renderCriteria() {
    criteriaMount.innerHTML = criteria.map(function (criterion) {
      return '<fieldset class="evaluation-criterion"><legend>' + app.escapeHtml(criterion.label) + '</legend><p>' + app.escapeHtml(criterion.detail) + '</p><div class="evaluation-rating" aria-label="Nota de 1 a 5 para ' + app.escapeHtml(criterion.label) + '">' +
        [1, 2, 3, 4, 5].map(function (score) {
          return '<label class="evaluation-rating__option"><input class="sr-only" type="radio" name="rating-' + criterion.id + '" value="' + score + '" aria-label="' + score + ' de 5 estrelas para ' + app.escapeHtml(criterion.label) + '"><span class="evaluation-rating__icon">' + app.icon("star") + '</span><span>' + score + '</span></label>';
        }).join("") + '</div></fieldset>';
    }).join("");
  }

  function clearError() {
    error.hidden = true;
    error.textContent = "";
  }

  function showError(message) {
    error.textContent = message;
    error.hidden = false;
  }

  function showSuccess(notify) {
    form.hidden = true;
    success.hidden = false;
    if (notify) app.showToast("Avaliação registrada", "Obrigado! Sua opinião foi salva apenas neste navegador.", "success");
  }

  function updateSelectedStars(group) {
    var selected = group.querySelector('input[type="radio"]:checked');
    var score = selected ? Number(selected.value) : 0;
    group.querySelectorAll(".evaluation-rating__option").forEach(function (option) {
      option.classList.toggle("is-selected", Number(option.querySelector("input").value) <= score);
    });
  }

  function readExistingEvaluation() {
    try {
      if (window.localStorage.getItem(storageKey)) showSuccess(false);
    } catch (storageError) {
      // Storage availability is reported if the visitor tries to submit.
    }
  }

  var initialSnapshot = simulation.getSnapshot();
  if (!initialSnapshot.isComplete || initialSnapshot.cycleStartedAt == null || initialSnapshot.cycleId == null) {
    returnToTrip();
    return;
  }

  activeCycleKey = cycleKey(initialSnapshot);
  storageKey = "cyberbus-evaluation-" + data.code + "-" + activeCycleKey;
  renderCriteria();
  updateCountdown(initialSnapshot);
  readExistingEvaluation();
  window.setInterval(updateCountdown, 1000);

  criteriaMount.addEventListener("change", function (event) {
    if (!event.target.matches('input[type="radio"]')) return;
    updateSelectedStars(event.target.closest(".evaluation-rating"));
    clearError();
  });

  recommendation.addEventListener("input", function () {
    characterCount.textContent = recommendation.value.length;
    clearError();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (isSubmitting || isRedirecting) return;
    clearError();

    var current = simulation.getSnapshot();
    if (!isCurrentCycle(current)) {
      returnToTrip();
      return;
    }

    var ratings = {};
    var missing = criteria.find(function (criterion) {
      var selected = form.querySelector('input[name="rating-' + criterion.id + '"]:checked');
      if (!selected) return true;
      ratings[criterion.id] = Number(selected.value);
      return false;
    });
    if (missing) {
      showError("Dê uma nota de 1 a 5 para " + missing.label.toLowerCase() + ".");
      form.querySelector('input[name="rating-' + missing.id + '"]').focus();
      return;
    }

    var note = recommendation.value.trim();
    if (note.length > 500) {
      showError("Sua recomendação deve ter até 500 caracteres.");
      recommendation.focus();
      return;
    }

    isSubmitting = true;
    app.setButtonLoading(submitButton, true, "Registrando avaliação");
    window.setTimeout(function () {
      if (!isCurrentCycle(simulation.getSnapshot())) {
        returnToTrip();
        return;
      }
      try {
        if (!window.localStorage.getItem(storageKey)) {
          window.localStorage.setItem(storageKey, JSON.stringify({
            tripCode: data.code,
            cycleId: current.cycleId,
            cycleStartedAt: current.cycleStartedAt,
            ratings: ratings,
            recommendation: note,
            submittedAt: new Date().toISOString()
          }));
        }
        showSuccess(true);
      } catch (storageError) {
        showError("Não foi possível salvar sua avaliação neste navegador. Tente novamente.");
        app.showToast("Avaliação não registrada", "Verifique se o armazenamento do navegador está disponível.", "error");
      }
      isSubmitting = false;
      app.setButtonLoading(submitButton, false);
    }, 700);
  });
}());
