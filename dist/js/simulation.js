(function () {
  "use strict";

  var data = window.CYBERBUS_DATA;
  var config = data.simulation;
  var storageKey = "cyberbus-simulation-v2-" + data.code;
  var sessionTtl = Infinity;
  var memorySession = null;
  var completionHold = 60 * 1000;
  var tripDuration = Math.ceil((100 - config.initialProgress) / config.progressStep) * config.updateInterval;
  var cycleDuration = tripDuration + completionHold;
  var geographicPath = Array.isArray(data.route.mapPath) && data.route.mapPath.length > 1
    ? data.route.mapPath
    : data.stops.map(function (stop) { return stop.coordinates; });
  var geographicDistances = [0];
  var geographicTotalDistance = 0;

  function radians(value) {
    return value * Math.PI / 180;
  }

  function distanceBetween(start, end) {
    var earthRadius = 6371;
    var latitudeDelta = radians(end[0] - start[0]);
    var longitudeDelta = radians(end[1] - start[1]);
    var latitudeStart = radians(start[0]);
    var latitudeEnd = radians(end[0]);
    var haversine = Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
      Math.cos(latitudeStart) * Math.cos(latitudeEnd) *
      Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2);
    return earthRadius * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  }

  geographicPath.slice(1).forEach(function (point, index) {
    geographicTotalDistance += distanceBetween(geographicPath[index], point);
    geographicDistances.push(geographicTotalDistance);
  });

  function readSession() {
    try {
      var stored = JSON.parse(window.localStorage.getItem(storageKey));
      if (stored && Number.isFinite(stored.startedAt) && stored.startedAt <= Date.now() && stored.startProgress === config.initialProgress && (Date.now() - stored.startedAt) < sessionTtl) {
        memorySession = stored;
        return stored;
      }
    } catch (error) {
      // Storage is optional in this prototype.
    }
    if (memorySession && memorySession.startedAt <= Date.now() && (Date.now() - memorySession.startedAt) < sessionTtl) return memorySession;
    memorySession = { startedAt: Date.now(), startProgress: config.initialProgress };
    try { window.localStorage.setItem(storageKey, JSON.stringify(memorySession)); } catch (error) { /* noop */ }
    return memorySession;
  }

  function progressAt(elapsedInCycle, session) {
    var elapsedSteps = Math.floor(elapsedInCycle / config.updateInterval);
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

  function interpolateGeographicPosition(progress) {
    var boundedProgress = Math.max(0, Math.min(100, progress));
    var targetDistance = geographicTotalDistance * (boundedProgress / 100);
    var segmentIndex = 0;

    while (segmentIndex < geographicDistances.length - 2 && geographicDistances[segmentIndex + 1] < targetDistance) {
      segmentIndex += 1;
    }

    var segmentStart = geographicDistances[segmentIndex];
    var segmentEnd = geographicDistances[segmentIndex + 1];
    var segmentLength = Math.max(0.000001, segmentEnd - segmentStart);
    var fraction = Math.max(0, Math.min(1, (targetDistance - segmentStart) / segmentLength));
    var start = geographicPath[segmentIndex];
    var end = geographicPath[segmentIndex + 1];

    return {
      position: [
        start[0] + ((end[0] - start[0]) * fraction),
        start[1] + ((end[1] - start[1]) * fraction)
      ],
      segmentIndex: segmentIndex
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
    var elapsed = Math.max(0, now - session.startedAt);
    var cycleId = Math.floor(elapsed / cycleDuration);
    var elapsedInCycle = elapsed % cycleDuration;
    var elapsedSteps = Math.floor(elapsedInCycle / config.updateInterval);
    var progress = progressAt(elapsedInCycle, session);
    var isComplete = elapsedInCycle >= tripDuration;
    var nextStop = data.stops.find(function (stop) { return stop.progress > progress; }) || data.stops[data.stops.length - 1];
    var previousStop = data.stops.slice().reverse().find(function (stop) { return stop.progress <= progress; }) || data.stops[0];
    var distanceTravelled = Math.round(data.route.totalDistance * (progress / 100));
    var speedPulse = Math.round(Math.sin(progress * 0.8) * 3);
    var etaOffsets = [0, 1, 0, -1];
    var etaOffset = progress >= 100 ? 0 : etaOffsets[elapsedSteps % etaOffsets.length];
    var nextStopBaseEta = nextStop.estimated || nextStop.scheduled;
    var geographicPosition = interpolateGeographicPosition(progress);
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
      geoPosition: geographicPosition.position,
      geoSegmentIndex: geographicPosition.segmentIndex,
      simulatedClock: formatSimulatedClock(progress),
      isComplete: isComplete,
      cycleId: cycleId,
      cycleStartedAt: session.startedAt + cycleId * cycleDuration,
      secondsUntilReset: isComplete ? Math.ceil((cycleDuration - elapsedInCycle) / 1000) : null,
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
