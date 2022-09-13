// Turn lat lon into pressure
function pressure_validate(e)
{
  if(e.latlng.lng > 0.76){PlayData.pright++;}
  else if (e.latlng.lng < .245){PlayData.pleft++;}
  else if (e.latlng.lng < 0.76 & e.latlng.lng > .245)
  {
    if(e.latlng.lat < .28){PlayData.pstunt++;}
    else{PlayData.pmiddle++;}
  }
}

// Update drive number
function newdrive()
{
  PlayData.drive = parseInt(PlayData.drive) + 1;
  document.getElementById('drivenum').value = PlayData.drive;

  var possession_cmb = document.getElementById('Possession');
  if(possession_cmb.value == PlayData.team){changePossession(PlayData.opponent); }
  else{changePossession(PlayData.team);}
  

  document.getElementById("down").value = 1;
  document.getElementById("distance").value = 10;

  PlayData.lat = 10 - PlayData.lat;
  PlayData.lon = 10 - PlayData.lon;

  mapObject.map.fireEvent('click', {latlng:[PlayData.lat, PlayData.lon]});
}

// Clean up points on pressure map
function clearmap()
{
  mapObject.map_p.eachLayer(function(layer) {
    // Trick to determine layer type and remove.
    if(layer.getLatLng != null)
    {
      mapObject.map_p.removeLayer(layer)
    }
  })
  PlayData.pright = 0;
  PlayData.pmiddle = 0;
  PlayData.pleft = 0;
}

// Turn field location into hash position
function ConvertHash(x)
{
    var Hash;
    if(x < 4.21){Hash = 'Left';}
    else if(x >= 4.21 & x <= 5.88){Hash = 'Middle';}
    else if(x > 5.88){Hash = "Right";}
    else {Hash = 'Middle';}
    return Hash
}

// Map Driver for field 
function MainMapDriver(e) {
    // Update Yard Marker
    yrd_value =  Math.round(e.latlng.lat * 10)

    if(yrd_value > 100){yrd_value = 100;}
    if(yrd_value < 0){yrd_value = 0;}
    if(isNaN(yrd_value))
    {
      if(isNaN(e.latlng[0]))
      {
        yrd_value = 20;
      }
      else
      {
        yrd_value = Math.round(e.latlng[0] * 10);
      }
    }


    //Update Hash
    if(isNaN(e.latlng[1]))
    {
      hash_value = ConvertHash(e.latlng.lng);
    }
    else
    {
      hash_value = ConvertHash(e.latlng[1]);
    }
    PlayData.hash = hash_value;
    document.getElementById("hash").value = hash_value;

    if (!mapObject.go_added)
    {
        mapObject.marker_go = L.marker(e.latlng, {icon: mapObject.greenIcon}).addTo(mapObject.map)
        PlayData.lat = mapObject.marker_go.getLatLng().lat;
        PlayData.lon = mapObject.marker_go.getLatLng().lng;
        mapObject.go_added = Boolean(true)     
        PlayData.yard = yrd_value;
        document.getElementById("yard").value = yrd_value;
    }
    else if (mapObject.go_added) {
        if(mapObject.stop_added)
        {
            mapObject.map.removeLayer(mapObject.marker_go);
            mapObject.map.removeLayer(mapObject.marker_stop);
            mapObject.go_added = Boolean(false);
            mapObject.stop_added = Boolean(false);
            line_layer.removeFrom(mapObject.map);
            document.getElementById("submit").style.display = "none";
            return;
        }
        mapObject.marker_stop = L.marker(e.latlng, {icon: mapObject.redIcon}).addTo(mapObject.map);
        PlayData.r_lat = mapObject.marker_stop.getLatLng().lat;
        PlayData.r_lon = mapObject.marker_stop.getLatLng().lng;
        line_layer = drawline(mapObject.marker_go, mapObject.marker_stop);
        mapObject.stop_added = Boolean(true);
        document.getElementById("submit").style.display = "block";
    }
}

function drawline(marker1, marker2)
{
    Line = L.layerGroup()
    if(getResult(marker1, marker2) < 0)
    {Line.addLayer(L.polyline([marker1.getLatLng(), marker2.getLatLng()], {color: 'red'}))}
    else{Line.addLayer(L.polyline([marker1.getLatLng(), marker2.getLatLng()], {color: 'lightgreen'}))}
    Line.addTo(mapObject.map);
    return Line;
}

function getResult(marker1, marker2){PlayData.result = Math.round(marker2.getLatLng().lat * 10) - Math.round(marker1.getLatLng().lat * 10)}

// When select possession changes
function changePossession(team)
{
  if(team == document.getElementById("Possession").value)
  {
    document.getElementById("sub_bar").style.backgroundColor = "#353b48";
  }
  else
  {
    document.getElementById("sub_bar").style.backgroundColor = "#ecf0f1";
  }
}

function PlayTypeUpdate()
{
  playType = document.getElementById("playtype").value;
  if(playType == 'Pocket Pass' || playType == 'Boot Pass')
  {
    document.getElementById("passzone").style.display = "inline";
    document.getElementById("passzoneLbl").style.display = "inline";
  }
  else
  {
    document.getElementById("passzone").style.display = "none";
    document.getElementById("passzoneLbl").style.display = "none";
    document.getElementById("passzone").value = "Non Passing Play";
  }
}

function Get_Formation()
{
  var formationCombo = document.getElementById("formation");
  url = '/endzone/rest/getformation';
  $.get(url, function(data, status){
      if(status != 404)
      {
        var option = document.createElement('option');
        for(i = 0; i < Object.keys(data).length; i++)
        {
          var option = document.createElement('option');
          option.text = data[i];
          option.value = data[i];
          formationCombo.options.add(option)
        }
        option.text = "Create Formation";
        option.value = "Create Formation";
        formationCombo.options.add(option)
      }
      else {
        alert(data)
      }
  })
}

function Formation_Change(){
  if(document.getElementById("formation").value == "Create Formation")
  {
    location.href = '/Endzone/Formations'
  }
}


