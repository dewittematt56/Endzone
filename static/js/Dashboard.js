function Load_Combobox(array, id)
{
  var option = document.createElement('option');
  option.text = "No Filter";
  option.value = "No Filter";
  document.getElementById(id).options.add(option)
  for(const arr of array)
  {
    var option = document.createElement('option');
    option.text = arr;
    option.value = arr;
    document.getElementById(id).options.add(option)
  }
}
function Page_Load(data)
{
  Load_Combobox(Get_Unique(Get_Column(data, "Possession")), "possession")
  Load_Combobox(Get_Unique(Get_Column(data, "Down")), "down")
  Load_Combobox(Get_Unique(Get_Column(data, "Formation")), "formation")
  Load_Combobox(Get_Unique(Get_Column(data, "Drive")), "drive")
  Load_Combobox(Get_Unique(Get_Column(data, "Play_Type")), "play_type")
  Load_Combobox(Get_Unique(Get_Column(data, "Quarter")), "quarter")
}

function Load_Payload(data){
  data = JSON.stringify(data)
  return data
}

function Get_Team(data, team){
  filter_obj = []
  for(i = 0; i < Object.keys(data).length; i++)
  {
    if(data[i]["Possession"] == team)
    {
      filter_obj.push(data[i])
    }
  }
  return filter_obj
}

function Get_Column(data, column){
  values = [];
  for(i = 0; i < Object.keys(data).length; i++){values.push(data[i][column])}
  return values;
}
function Get_Unique(column){
  set = new Set(column)
  return Array.from(set)
}

function Sum_By(column){
  unique_values = Get_Unique(column)
  colnames = []
  values = []
  for(i = 0; i < unique_values.length; i++)
  {
    occurances = 0
    colnames.push(unique_values[i])
    for(j = 0; j <column.length; j++)
    {
      if(column[j] == unique_values[i]){occurances++}
    }
    values.push(occurances)
  }
  // [0] = Name [1] = Value
  return { unique_values, values }
}

function Get_Avg(array) {
  const total = array.reduce((acc, c) => acc + c, 0);
  return total / array.length;
}

function Build_Graphs(data, obj){
  //Clear old graphs



  // Play Type
  PT_sums = Sum_By(Get_Column(data, "Play_Type"));
  var xValues = PT_sums.unique_values;
  var yValues = PT_sums.values;
  obj.playType = new Chart(document.getElementById("playTypeGraph"), {
    type: "doughnut",
    data: {

        labels: xValues,
        datasets: [{
            label: 'Occurences',
            backgroundColor: [
            'rgba(25, 181, 254, 0.5)',
            'rgba(18, 151, 224, 0.5)',
            'rgba(0, 119, 192, 0.5)',
            'rgba(0, 87, 160, 0.5)',
            'rgba(0, 55, 128, 0.5)',
            ],
            borderColor: [
            'rgb(172, 186, 201)',
            'rgb(172, 186, 201)',
            'rgb(172, 186, 201)',
            'rgb(172, 186, 201)',
            'rgb(172, 186, 201)',
            ],
        data: yValues
        }]
    },
    options: {
        title: {
          display: true,
          text: 'Offensive Play Type'
        },
        responsive: true,
        maintainAspectRatio: true
      }

  });

  // Formatiom
  Form_sums = Sum_By(Get_Column(data, "Formation"));
  var top_1 = 0;
  var top_1_name = ""
  var top_2 = 0;
  var top_2_name = ""
  var top_3 = 0;
  var top_3_name = ""
  aggregate = 0
  for(i = 0; i < Form_sums.unique_values.length; i++)
  {
    if(Form_sums.values[i] > top_1)
    {
      top_1 = Form_sums.values[i];
      top_1_name = Form_sums.unique_values[i]
    }
    else if(Form_sums.values[i] > top_2)
    {
      top_2 = Form_sums.values[i];
      top_2_name = Form_sums.unique_values[i]
    }
    else if(Form_sums.values[i] > top_3)
    {
      top_3 = Form_sums.values[i];
      top_3_name = Form_sums.unique_values[i]
    }
    else{aggregate = aggregate + Form_sums.values[i]}
  }
  var xValues = [top_1_name, top_2_name, top_3_name, "Other"]
  var yValues = [top_1, top_2, top_3, aggregate]

  obj.Formation = new Chart(document.getElementById("formationGraph"), {
    type: "doughnut",
    data: {

        labels: xValues,
        datasets: [{
            label: 'Occurences',
            backgroundColor: [
              'rgba(25, 181, 254, 0.5)',
              'rgba(18, 151, 224, 0.5)',
              'rgba(0, 119, 192, 0.5)',
              'rgba(0, 87, 160, 0.5)',
              'rgba(0, 55, 128, 0.5)',
              ],
              borderColor: [
              'rgb(172, 186, 201)',
              'rgb(172, 186, 201)',
              'rgb(172, 186, 201)',
              'rgb(172, 186, 201)',
              'rgb(172, 186, 201)',
              ],
        data: yValues
        }]
    },
    options: {
        title: {
          display: true,
          text: 'Offensive Formations'
        },
        responsive: true,
        maintainAspectRatio: true
      }

  });

  // Play Direction
  Dir_sums = Sum_By(Get_Column(data, "Play_Type_Dir"));
  var xValues = Dir_sums.unique_values;
  var yValues = Dir_sums.values;
  obj.playDir = new Chart(document.getElementById("playDirectionGraph"), {
    type: "doughnut",
    data: {

        labels: xValues,
        datasets: [{
            label: 'Occurences',
            backgroundColor: [
              'rgba(25, 181, 254, 0.5)',
              'rgba(18, 151, 224, 0.5)',
              'rgba(0, 119, 192, 0.5)',
              'rgba(0, 87, 160, 0.5)',
              'rgba(0, 55, 128, 0.5)',
              ],
              borderColor: [
              'rgb(172, 186, 201)',
              'rgb(172, 186, 201)',
              'rgb(172, 186, 201)',
              'rgb(172, 186, 201)',
              'rgb(172, 186, 201)',
              ],
        data: yValues
        }]
    },
    options: {
        title: {
          display: true,
          text: 'Play Direction'
        },
        responsive: true,
        maintainAspectRatio: true
      }

  });
}

function Build_Stats(data){
  document.getElementById("avg_gain").innerText = Math.round(Get_Avg(Get_Column(data, "Result")));
  document.getElementById("avg_dist").innerText = Math.round(Get_Avg(Get_Column(data, "Distance")));

  // Get % of Plays to strength
  count = 0;
  for(i = 0; i < data.length; i++){
    if(data[i]["Play_Type_Dir"] == data[i]["Formation_Strength"])
    {
      count++;
    }
  }
  document.getElementById("str_play").innerText = Math.round(((count / data.length) * 100)) + "%";

  // Get Explosive Plays
  count = 0;
  for(i = 0; i < data.length; i++){
    if(data[i]["Result"] > 10)
    {
      count++;
    }
  }
  document.getElementById("exp_play").innerText = count;

  // Find Negative Play Rate (Result < 0)
  count = 0;
  for(i = 0; i < data.length; i++){
    if(data[i]["Result"] < 0)
    {
      count++;
    }
  }
  document.getElementById("neg_play").innerText = Math.round(((count / data.length) * 100)) + "%";

  // Offensive Effiency % (Result < 3)
  count = 0;
  for(i = 0; i < data.length; i++){
    if(data[i]["Result"] > 3)
    {
      count++;
    }
  }
  document.getElementById("off_efc").innerText = Math.round(((count / data.length) * 100)) + "%";

  // Run Effiency % (Result < 3) Run Plays
  count = 0;
  total_count = 0;
  for(i = 0; i < data.length; i++){
    if(data[i]["Play_Type"] == "Inside Run" | data[i]["Play_Type"] == "Outside Run")
    {
      if(data[i]["Result"] > 3)
      {
        count++;
      }
      total_count++;
    }
  }
  document.getElementById("run_efc").innerText = Math.round(((count / total_count) * 100)) + "%";

  // Pass Effiency % (Result < 3) Pass Plays
  count = 0;
  total_count = 0;
  for(i = 0; i < data.length; i++){
    if(data[i]["Play_Type"] == "Pocket Pass" | data[i]["Play_Type"] == "Boot Pass")
    {
      if(data[i]["Result"] > 3){
        count++;
      }
      total_count++;
    }
  }
  document.getElementById("pass_efc").innerText = Math.round(((count / total_count) * 100)) + "%";

  // Zone Effiency % (Result < 3) Zone D
  count = 0;
  total_count = 0;
  for(i = 0; i < data.length; i++){
    if(data[i]["Coverage"] == "Zone 2" | data[i]["Coverage"] == "Zone 3" | data[i]["Coverage"] == "Zone 4")
    {
      if(data[i]["Result"] > 3){
        count++;
      }
      total_count++;
    }
  }
  document.getElementById("zone_efc").innerText = Math.round(((count / total_count) * 100)) + "%";
  // Man Effiency % (Result < 3) Man D
  count = 0;
  total_count = 0;
  for(i = 0; i < data.length; i++){
    if(data[i]["Coverage"] == "Man 1" | data[i]["Coverage"] == "Man 2" | data[i]["Coverage"] == "Man 3" | data[i]["Coverage"] == "Man 4")
    {
      if(data[i]["Result"] > 3){
        count++;
      }
      total_count++;
    }
  }
  document.getElementById("man_efc").innerText = Math.round(((count / total_count) * 100)) + "%";
} 

function Clear_Graphs(obj)
{
  try {
    obj.playType.destroy()
    obj.Formation.destroy()
    obj.playDir.destroy()
  } catch(e){
    console.log(e);
  }
}

function Filter_ByColumn(data, column, value)
{
  filter_obj = []
  for(i = 0; i < Object.keys(data).length; i++)
  {
    if(data[i][column] == value)
    {
      filter_obj.push(data[i])
    }
  }
  return filter_obj  
}

function Filter_Spatial(data, filter_poly){
  var filter_poly = JSON.parse(filter_poly);
  cords = filter_poly["features"][0]["geometry"]["coordinates"]
  for(i = 0; i < cords.length; i ++)
  {
    alert(cords[i])
  }
}
function Get_Result(marker1, marker2)
{
    result = Math.round(marker2.getLatLng().lat * 10) - Math.round(marker1.getLatLng().lat * 10)
    document.getElementById("result").value = result;
    return result
}

function Draw_Line(marker1, marker2, map)
{
    Line = L.layerGroup()
    Line.addLayer(L.polyline([marker1.getLatLng(), marker2.getLatLng()]))
    Line.addTo(map);
    return Line;
}

function Build_Points(data, map)
{
  var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
var redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

  map.eachLayer(function(layer) {
    // Trick to determine layer type and remove.
    if(layer.getLatLng != null)
    {
        map.removeLayer(layer)
    }
    if(layer.isEmpty != null)
    {
        map.removeLayer(layer)
    }
  })

  if(document.getElementById("show_result").checked)
  {
    for(i = 0; i < data.length; i++){
      marker_go = L.marker(L.latLng(data[i]["Play_Lat"], data[i]["Play_Lon"]), {icon: greenIcon}).addTo(map)
      marker_stop = L.marker(L.latLng(data[i]["Result_Lat"], data[i]["Result_Lon"]), {icon: redIcon}).addTo(map);
      line_layer = Draw_Line(marker_go, marker_stop, map);
    }
  }
  else
  {
    for(i = 0; i < data.length; i++){
      new L.marker(L.latLng(data[i]["Play_Lat"], data[i]["Play_Lon"])).bindPopup(
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
}

function Filter_Data()
{
  // Get filter inputs
  possession = document.getElementById("possession").value
  down = document.getElementById("down").value
  distance = document.getElementById("distance").value
  o_form = document.getElementById("formation").value
  drive_num = document.getElementById("drive").value
  play_type = document.getElementById("play_type").value
  quarter =  document.getElementById("quarter").value
  
  if(possession != "No Filter"){data = Filter_ByColumn(data, "Possession", possession)}
  if(down != "No Filter"){data = Filter_ByColumn(data, "Down", down)}
  if(distance != "No Filter")
  {
    new_data = []
    if(distance == "Short")
    {
      for(i = 0; i < Object.keys(data).length; i++)
      {
        if(data[i]["Distance"] <= 3)
        {
          new_data.push(data[i])
        }
      }
    }
    else if(distance == "Medium")
    {
      for(i = 0; i < Object.keys(data).length; i++)
      {
        if(data[i]["Distance"] > 3 & data[i]["Distance"] <= 7)
        {
          new_data.push(data[i])
        }
      }
    }
    else
    {
      for(i = 0; i < Object.keys(data).length; i++)
      {
        if(data[i]["Distance"] > 7)
        {
          new_data.push(data[i])
        }
      }
    }
    data = new_data
  }
  if(o_form != "No Filter"){data = Filter_ByColumn(data, "Formation", o_form)}
  if(drive_num != "No Filter"){data = Filter_ByColumn(data, "Drive", drive_num)}
  if(play_type != "No Filter"){data = Filter_ByColumn(data, "Play_Type", play_type)}
  if(quarter != "No Filter"){data = Filter_ByColumn(data, "Quarter", quarter)}
  if(document.getElementById("spatial").value != "")
  // Spatial Filter
  canvas = document.getElementById("playTypeGraph");
  var c = document.getElementById("playTypeGraph");
  var ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  Clear_Graphs(graphObj)
  Build_Graphs(data, graphObj)
  Build_Stats(data)
  Build_Points(data, map)
}