
/// Leaflet Markers for Symbology
function Symbolize(data, map, symbologyfield, legendID)
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
    playTypeSymbology = {"Inside Run": [orangeIcon, "/static/spatial/markers/small/marker-icon-orange.png"], "Outside Run": [redIcon, "/static/spatial/markers/small/marker-icon-red.png"], "Boot Pass": [greenIcon, "/static/spatial/markers/small/marker-icon-green.png"], "Pocket Pass": [purpleIcon, "/static/spatial/markers/small/marker-icon-violet.png"], "Unknown": [blueIcon, "/static/spatial/markers/small/marker-icon-blue.png"]}
    playDirSymbology = {"Left": [greenIcon, "/static/spatial/markers/small/marker-icon-green.png"], "Right": [redIcon, "/static/spatial/markers/small/marker-icon-red.png"], "Unknown": [blueIcon, "/static/spatial/markers/small/marker-icon-blue.png"]}
    strengthSymbology = {"Left": [greenIcon,  "/static/spatial/markers/small/marker-icon-green.png"], "Right": [redIcon, "/static/spatial/markers/small/marker-icon-red.png"], "Balanced": [purpleIcon, "/static/spatial/markers/small/marker-icon-violet.png"], "Unknown": [blueIcon, "/static/spatial/markers/small/marker-icon-blue.png"]}

    Icons.push(blueIcon)
    Icons.push(goldIcon)
    Icons.push(greenIcon)
    Icons.push(redIcon)
    Icons.push(orangeIcon)
    Icons.push(purpleIcon)
    Icons.push(blackIcon)
    var symbol = blackIcon
    for(i = 0; i < data.length; i++){
        if(symbologyfield == "Play Type"){symbol = playTypeSymbology[data[i]["Play_Type"]][0]}
        else if (symbologyfield == "Play Dir"){symbol = playDirSymbology[data[i]["Play_Type_Dir"]][0]}
        else if (symbologyfield == "Strength"){symbol = strengthSymbology[data[i]["Formation_Strength"]][0]}

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
      div = document.getElementById(legendID);
      div.replaceChildren();
      if(symbologyfield == "Play Type")
      {
        for(const [key, value] of Object.entries(playTypeSymbology))
        {
            img = document.createElement("img")
            lbl = document.createElement("label")
            lbl.innerText = key + ":"
            console.log(playTypeSymbology[key][1])
            img.src = playTypeSymbology[key][1]
            img.style = "margin-right: 2vh;"
            div.appendChild(lbl)
            div.appendChild(img)
        }
      }
      else if (symbologyfield == "Play Dir")
      {
        for(const [key, value] of Object.entries(playDirSymbology))
        {
            img = document.createElement("img")
            lbl = document.createElement("label")
            lbl.innerText = key + ":"
            console.log(playDirSymbology[key][1])
            img.src = playDirSymbology[key][1]
            img.style = "margin-right: 2vh;"
            div.appendChild(lbl)
            div.appendChild(img)
        }
      }
      else if (symbologyfield == "Strength")
      {
        for(const [key, value] of Object.entries(strengthSymbology))
        {
            img = document.createElement("img")
            lbl = document.createElement("label")
            lbl.innerText = key + ":"
            console.log(strengthSymbology[key][1])
            img.src = strengthSymbology[key][1]
            img.style = "margin-right: 2vh;"
            div.appendChild(lbl)
            div.appendChild(img)
        }
      }
}



