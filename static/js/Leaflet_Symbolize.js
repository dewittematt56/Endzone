
/// Leaflet Markers for Symbology
function Symbolize(data, map, symbologyfield)
{
    Icons = []
    blueIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    goldIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    orangeIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    purpleIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    //Other
    blackIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    playTypeSymbology = {"Inside Run": orangeIcon, "Outside Run": redIcon, "Boot Pass": greenIcon, "Pocket Pass": purpleIcon, "Unknown": blueIcon}
    playDirSymbology = {"Left": greenIcon, "Right": redIcon, "Unknown": blueIcon}
    strengthSymbology = {"Left": greenIcon, "Right": redIcon, "Balanced": purpleIcon, "Unknown": blueIcon}

    Icons.push(blueIcon)
    Icons.push(goldIcon)
    Icons.push(greenIcon)
    Icons.push(redIcon)
    Icons.push(orangeIcon)
    Icons.push(purpleIcon)
    Icons.push(blackIcon)
    var symbol = blackIcon
    for(i = 0; i < data.length; i++){
        if(symbologyfield == "Play Type"){symbol = playTypeSymbology[data[i]["Play_Type"]]}
        else if (symbologyfield == "Play Dir"){symbol = playDirSymbology[data[i]["Play_Type_Dir"]]}
        else if (symbologyfield == "Strength"){symbol = playDirSymbology[data[i]["Formation_Strength"]]}

        new L.marker(L.latLng(data[i]["Play_Lat"], data[i]["Play_Lon"]), {icon: symbol}).bindPopup(
          '<h2>' + 'Play Number: ' + data[i]["PlayNum"] + '</h2>' +
          '<h3>' + 'Possession: ' + data[i]["Possession"] + '</h3>' + 
          '<h3>' + 'Down: ' + data[i]["Down"] + '</h3>' + 
          '<h3>' + 'Distance: ' + data[i]["Distance"] + '</h3>' + 
          '<h3>' + 'Quarter:' + data[i]["Quarter"] + '</h3>' + 
          '<h3>' + 'O Formation: ' + data[i]["Formation"] + " " + data[i]["Formation_Strength"] + '</h3>' + 
          '<h3>' + 'D Formation: ' + data[i]["D_Formation"] + '</h3>' + 
          '<h3>' + 'Play: ' + data[i]["Play_Type"] + " " + data[i]["Play_Type_Dir"] + '</h3>' + 
          '<h3>' + 'Coverage: ' + data[i]["Coverage"] + '</h3>' + 
          '<h3>' + 'Pass_Zone: ' + data[i]["Pass_Zone"] + '</h3>' +
          '<h3>' + 'Coverage: ' + data[i]["Coverage"] + '</h3>' +
          '<h3>' + 'Pressure Left: ' + data[i]["Pressure_Left"] + '</h3>' +
          '<h3>' + 'Pressure Middle: ' + data[i]["Pressure_Middle"] + '</h3>' +
          '<h3>' + 'Pressure Right: ' + data[i]["Pressure_Right"] + '</h3>' +
          '<h3>' + 'Result: ' + data[i]["Result"] + '</h3>'
        ).addTo(map);
      }
}



