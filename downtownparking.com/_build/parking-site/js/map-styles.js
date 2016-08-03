/* 
 * Style Google map
 */
parking.styles = [
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [
      { color: "#b2b2b2" }
    ]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      { color: "#969696" },
      { weight: 0.8 }
    ]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.stroke",
    stylers: [
      { color: "#b2b2b2" }
    ]
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      { color: "#2f2f2f" }
    ]
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      { color: "#c7c7c7" }
    ]
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.stroke",
    stylers: [
      { color: "#c7c7c7" }
    ]
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [
      { color: "#afc9d1" }
    ]
  },
  {
    featureType: "transit.line",
    elementType: "geometry.fill",
    stylers: [
      { color: "#b2b2b2" }
    ]
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.stroke",
    stylers: [
      { color: "#b2b2b2" }
    ]
  },
  {
    featureType: "transit",
    elementType: "labels.icon",
    stylers: [
      { saturation: -100 },
      { gamma: 0.84 }
    ]
  },
  {
    featureType: "poi",
    elementType: "geometry.fill",
    stylers: [
      { color: "#b2b2b2" }
    ]
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  },
  {
    featureType: "transit.station.airport",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [
      { saturation: -100 },
      { gamma: 0.78 }
    ]
  }
]
