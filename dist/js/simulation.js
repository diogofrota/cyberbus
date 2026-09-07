(function () {
  "use strict";

  var data = window.CYBERBUS_DATA;
  var config = data.simulation;
  var storageKey = "cyberbus-simulation-" + data.code;
  var sessionTtl = 12 * 60 * 1000;
  var memorySession = null;

  function readSession() {
    try {
      var stored = JSON.parse(window.localStorage.getItem(storageKey));
      if (stored && Number.isFinite(stored.startedAt) && Number.isFinite(stored.startProgress) && (Date.now() - stored.startedAt) < sessionTtl) {
        memorySession = stored;
        return stored;
      }
    } catch (error) {
      // Storage is optional in this prototype.
    }
    if (memorySession && (Date.now() - memorySession.startedAt) < sessionTtl) return memorySession;
    memorySession = { startedAt: Date.now(), startProgress: config.initialProgress };
    try { window.localStorage.setItem(storageKey, JSON.stringify(memorySession)); } catch (error) { /* noop */ }
    return memorySession;
  }

  function progressAt(timestamp, session) {
    var elapsedSteps = Math.floor(Math.max(0, timestamp - session.startedAt) / config.updateInterval);
    return Math.min(100, session.startProgress + (elapsedSteps * config.progressStep));
  }

  function timeWithOffset(value, offset) {
    var total = (minutesFromTime(value) + offset + 1440) % 1440;
    return String(Math.floor(total / 60)).padStart(2, "0") + ":" + String(total % 60).padStart(2, "0");
  }

  function minutesFromTime(value) {
    var parts = String(value).split(":").map(Number);
    return (parts[0] * 60) + parts[1];
  }

  function interpolatePosition(progress) {
    var points = config.polyline;
    var scaled = (progress / 100) * (points.length - 1);
    var index = Math.min(points.length - 2, Math.floor(scaled));
    var fraction = scaled - index;
    var start = points[index];
    var end = points[index + 1];
    return {
      x: start[0] + ((end[0] - start[0]) * fraction),
      y: start[1] + ((end[1] - start[1]) * fraction)
    };
  }

  function formatSimulatedClock(progress) {
    var departureMinutes = minutesFromTime(data.route.departure);
    var arrivalMinutes = minutesFromTime(data.route.estimatedArrival);
    if (arrivalMinutes < departureMinutes) arrivalMinutes += 1440;
    var totalMinutes = arrivalMinutes - departureMinutes;
    var current = departureMinutes + Math.round(totalMinutes * (progress / 100));
    var hours = Math.floor(current / 60) % 24;
    var minutes = current % 60;
    return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
  }

  function snapshot() {
    var now = Date.now();
    var session = readSession();
    var elapsedSteps = Math.floor(Math.max(0, now - session.startedAt) / config.updateInterval);
    var progress = progressAt(now, session);
    var nextStop = data.stops.find(function (stop) { return stop.progress > progress; }) || data.stops[data.stops.length - 1];
    var previousStop = data.stops.slice().reverse().find(function (stop) { return stop.progress <= progress; }) || data.stops[0];
    var distanceTravelled = Math.round(data.route.totalDistance * (progress / 100));
    var speedPulse = Math.round(Math.sin(progress * 0.8) * 3);
    var etaOffsets = [0, 1, 0, -1];
    var etaOffset = progress >= 100 ? 0 : etaOffsets[elapsedSteps % etaOffsets.length];
    var nextStopBaseEta = nextStop.estimated || nextStop.scheduled;
    return {
      progress: Math.round(progress * 10) / 10,
      progressLabel: Math.round(progress) + "%",
      distanceTravelled: distanceTravelled,
      distanceRemaining: Math.max(0, data.route.totalDistance - distanceTravelled),
      distanceToNextStop: Math.max(0, nextStop.distanceFromOrigin - distanceTravelled),
      speed: progress >= 100 ? 0 : config.speed + speedPulse,
      nextStop: nextStop,
      nextStopEta: timeWithOffset(nextStopBaseEta, etaOffset),
      previousStop: previousStop,
      finalEta: timeWithOffset(data.route.estimatedArrival, etaOffset),
      position: interpolatePosition(progress),
      simulatedClock: formatSimulatedClock(progress),
      isComplete: progress >= 100,
      updatedAt: now
    };
  }

  function subscribe(callback) {
    callback(snapshot());
    var interval = window.setInterval(function () { callback(snapshot()); }, config.updateInterval);
    return function () { window.clearInterval(interval); };
  }

  window.CyberBusSimulation = {
    getSnapshot: snapshot,
    subscribe: subscribe
  };
}());
