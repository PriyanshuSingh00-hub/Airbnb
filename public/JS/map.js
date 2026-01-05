function initializeMap(retries = 0) {
  const sdk = window.maptilersdk;
  if (!sdk) {
    if (retries < 50) { // Max 5 seconds (50 × 100ms)
      setTimeout(() => initializeMap(retries + 1), 100);
    } else {
      console.error("MapTiler SDK failed to load after 5 seconds");
    }
    return;
  }

  // Get data from window object (passed from show.ejs)
  const apiKey = window.mapToken || "";
  const coordinates = window.listingCoordinates || [77.2090, 28.6139];
  
  // Default coordinates: New Delhi
  const defaultCoordinates = [77.2090, 28.6139]; // [longitude, latitude]
  // Use listing coordinates if available, otherwise use New Delhi
  const mapCenter = (coordinates[0] !== 0 || coordinates[1] !== 0) ? coordinates : defaultCoordinates;

  sdk.config.apiKey = apiKey;

  const map = new sdk.Map({
    container: "map",
    style: sdk.MapStyle.AQUARELLE,
    center: mapCenter,
    zoom: 10
  });

  new sdk.Marker().setLngLat(mapCenter).addTo(map);
}

initializeMap();