// Geocoding using MapTiler API
async function geocodeLocation(locationName, mapToken) {
  if (!locationName || !mapToken) {
    console.error("Location name and API token required");
    return null;
  }

  try {
    const response = await fetch(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(locationName)}.json?key=${mapToken}`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const [lng, lat] = feature.geometry.coordinates;
      
      console.log(`✓ Geocoded "${locationName}" to [${lng}, ${lat}]`);
      return { lng, lat, coordinates: [lng, lat] };
    } else {
      console.warn("❌ Location not found:", locationName);
      alert("Location not found. Please try another name.");
      return null;
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    alert("Error geocoding location. Check your internet.");
    return null;
  }
}

// Update map when location changes
async function updateMapLocation(locationInput, mapToken, mapId = "map") {
  const location = locationInput.value.trim();
  if (!location) return;

  console.log("Searching for location:", location);
  
  const result = await geocodeLocation(location, mapToken);
  if (result) {
    // Update latitude and longitude fields
    const latField = document.querySelector('input[name="listing[geometry][coordinates][1]"]');
    const lngField = document.querySelector('input[name="listing[geometry][coordinates][0]"]');
    
    if (latField) {
      latField.value = result.lat;
      console.log("Updated latitude to:", result.lat);
    }
    if (lngField) {
      lngField.value = result.lng;
      console.log("Updated longitude to:", result.lng);
    }

    // Update map if it exists
    if (typeof maptilersdk !== 'undefined' && document.getElementById(mapId)) {
      initializePreviewMap(result.coordinates, mapToken, mapId);
    }

    console.log("✓ Location coordinates updated successfully");
    return true;
  }
  return false;
}

// Initialize preview map
function initializePreviewMap(coordinates, mapToken, mapId = "map") {
  const sdk = window.maptilersdk;
  if (!sdk) {
    setTimeout(() => initializePreviewMap(coordinates, mapToken, mapId), 100);
    return;
  }

  sdk.config.apiKey = mapToken;

  const container = document.getElementById(mapId);
  if (!container) return;

  // Clear existing map if any
  container.innerHTML = '';

  const map = new sdk.Map({
    container: mapId,
    style: sdk.MapStyle.AQUARELLE,
    center: coordinates,
    zoom: 10
  });

  new sdk.Marker().setLngLat(coordinates).addTo(map);
  console.log("Map updated with coordinates:", coordinates);
}
