function initializeMap(retries = 0) {
  const sdk = window.maptilersdk;

  if (!sdk) {
    if (retries < 50) {
      setTimeout(() => initializeMap(retries + 1), 100);
    } else {
      console.error("MapTiler SDK failed to load after 5 seconds");
    }
    return;
  }

  // Ensure map container exists
  const container = document.getElementById("map");
  if (!container) return;

  const apiKey = window.mapToken || "";
  sdk.config.apiKey = apiKey;

  const defaultCoordinates = [77.2090, 28.6139]; // New Delhi

  let coordinates = window.listingCoordinates;

  // 🔒 HARD SAFETY: parse string → array
  if (typeof coordinates === "string") {
    try {
      coordinates = JSON.parse(coordinates);
    } catch (e) {
      console.warn("Failed to parse coordinates string:", coordinates);
      coordinates = null;
    }
  }

  // 🔒 HARD VALIDATION
  if (
    !Array.isArray(coordinates) ||
    coordinates.length !== 2 ||
    typeof coordinates[0] !== "number" ||
    typeof coordinates[1] !== "number"
  ) {
    console.warn("Invalid listing coordinates, using default:", coordinates);
    coordinates = defaultCoordinates;
  }

  const map = new sdk.Map({
    container: "map",
    style: sdk.MapStyle.AQUARELLE,
    center: coordinates,
    zoom: 10
  });

  new sdk.Marker()
    .setLngLat(coordinates)
    .addTo(map);

  console.log("✓ Map initialized at:", coordinates);
}

// Initialize map on page load
document.addEventListener("DOMContentLoaded", initializeMap);
