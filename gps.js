// gps.js — Módulo de tracking GPS para RunningTrainer
const GPS = (() => {
  let watchId = null;
  let positions = [];
  let totalDistance = 0; // metros
  let startTime = null;
  let isTracking = false;
  let onUpdate = null; // callback(data)
  let lastPosition = null;

  // Haversine: distancia entre dos coordenadas en metros
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Filtro: ignora puntos con precisión > 30m o saltos absurdos
  function isValidPoint(pos) {
    if (pos.coords.accuracy > 30) return false;
    if (!lastPosition) return true;
    const dt = (pos.timestamp - lastPosition.timestamp) / 1000;
    if (dt <= 0) return false;
    const d = haversine(
      lastPosition.coords.latitude, lastPosition.coords.longitude,
      pos.coords.latitude, pos.coords.longitude
    );
    const speed = d / dt; // m/s
    // Máx ~40 km/h = 11.1 m/s (filtrar teletransportaciones GPS)
    if (speed > 11.2) return false;
    return true;
  }

  function handlePosition(pos) {
    if (!isTracking) return;
    if (!isValidPoint(pos)) return;

    if (lastPosition) {
      const d = haversine(
        lastPosition.coords.latitude, lastPosition.coords.longitude,
        pos.coords.latitude, pos.coords.longitude
      );
      // Mínimo 2m para evitar ruido GPS estando parado
      if (d >= 2) {
        totalDistance += d;
        lastPosition = pos;
        positions.push({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          time: pos.timestamp,
          accuracy: pos.coords.accuracy
        });
      }
    } else {
      lastPosition = pos;
      positions.push({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        time: pos.timestamp,
        accuracy: pos.coords.accuracy
      });
    }

    if (onUpdate) {
      onUpdate(getData());
    }
  }

  function handleError(err) {
    console.warn('GPS error:', err.message);
    if (err.code === 1) {
      // Permiso denegado
      if (window.showToast) showToast('GPS: permiso denegado. Activa la ubicación.', 'error');
    }
  }

  function getData() {
    const elapsed = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
    const distKm = totalDistance / 1000;
    const paceSecsPerKm = distKm > 0.01 ? Math.round(elapsed / distKm) : 0;
    return {
      distanceMeters: Math.round(totalDistance),
      distanceKm: distKm,
      elapsedSeconds: elapsed,
      paceSecsPerKm,
      positions,
      isTracking
    };
  }

  return {
    start(updateCallback) {
      if (isTracking) return true;
      if (!('geolocation' in navigator)) {
        if (window.showToast) showToast('GPS no disponible en este dispositivo', 'error');
        return false;
      }

      positions = [];
      totalDistance = 0;
      startTime = Date.now();
      lastPosition = null;
      isTracking = true;
      onUpdate = updateCallback || null;

      watchId = navigator.geolocation.watchPosition(handlePosition, handleError, {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000
      });

      return true;
    },

    stop() {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      isTracking = false;
      const data = getData();
      // Resetear callback
      onUpdate = null;
      return data;
    },

    getData,

    isTracking() {
      return isTracking;
    },

    // Formato mm:ss desde segundos
    formatPace(secsPerKm) {
      if (!secsPerKm || secsPerKm <= 0) return '--:--';
      const m = Math.floor(secsPerKm / 60);
      const s = secsPerKm % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    },

    formatTime(totalSecs) {
      if (!totalSecs || totalSecs <= 0) return '0:00';
      const h = Math.floor(totalSecs / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const s = totalSecs % 60;
      if (h > 0) return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    },

    formatDistance(meters) {
      if (meters < 1000) return `${Math.round(meters)} m`;
      return `${(meters / 1000).toFixed(2)} km`;
    }
  };
})();

window.GPS = GPS;
