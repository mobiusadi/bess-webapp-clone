const mapStyles = [
  // --- Global Styles ---
  // Style all geometric features with a light base color and grey stroke
  {
    "elementType": "geometry",
    "stylers": [ { "color": "#f5f5f5" } ]
  },
  // Turn off all the colorful business/POI icons
  {
    "elementType": "labels.icon",
    "stylers": [ { "visibility": "off" } ]
  },
  // Style all text with a dark grey
  {
    "elementType": "labels.text.fill",
    "stylers": [ { "color": "#616161" } ]
  },
  // Give all text a light "outline" to make it pop
  {
    "elementType": "labels.text.stroke",
    "stylers": [ { "color": "#f5f5f5" } ]
  },
  
  // --- Specific Feature Styles ---
  // Style water features with a darker grey
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [ { "color": "#c9c9c9" } ]
  },
  // Style parks and green areas with a muted grey-green
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [ { "color": "#e5e5e5" } ]
  },
  // Style roads with white/light grey fills
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [ { "color": "#ffffff" } ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [ { "color": "#dadada" } ]
  },

  // --- OUR CUSTOM BORDER OVERRIDES ---
  // Because we built the theme, we know these will now take precedence.
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      { "visibility": "on" },
      { "color": "#a0a0a0" }, // A visible dark grey
      { "weight": 1.5 }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      { "visibility": "on" },
      { "color": "#b0b0b0" }, // A slightly lighter grey for states
      { "weight": 2.0 }
    ]
  }
];

export default mapStyles;