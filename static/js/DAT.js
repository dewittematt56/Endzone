function removeAll(selectBox) {
  while (selectBox.options.length > 0) {
      selectBox.remove(0);
  }
}

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) 
  {
      slides[i].style.display = "none";  
  }
  slides[slideIndex-1].style.display = "block";  
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

  for(i = 0; i < data.length; i++){
    marker_go = L.marker(L.latLng(data[i].Play_Lat, data[i].Play_Lon), {icon: greenIcon}).bindPopup(
      '<h2>' + 'Play Number: ' + data[i].PlayNum + '</h2>' +
      '<h3>' + 'Possession: ' + data[i].Possession + '</h3>' + 
      '<h3>' + 'Down: ' + data[i].Down + '</h3>' + 
      '<h3>' + 'Distance: ' + data[i].Distance + '</h3>' + 
      '<h3>' + 'Quarter:' + data[i].Quarter + '</h3>' + 
      '<h3>' + 'O Formation: ' + data[i].Formation + " " + data[i]["Formation_Strength"] + '</h3>' + 
      '<h3>' + 'D Formation: ' + data[i].D_Formation + '</h3>' + 
      '<h3>' + 'Play: ' + data[i].Play_Type + " " + data[i]["Play_Type_Dir"] + '</h3>' + 
      '<h3>' + 'Coverage: ' + data[i].Coverage + '</h3>' + 
      '<h3>' + 'Pass_Zone: ' + data[i].Pass_Zone + '</h3>' +
      '<h3>' + 'Coverage: ' + data[i].Coverage + '</h3>' +
      '<h3>' + 'Pressure Left: ' + data[i].Pressure_Left + '</h3>' +
      '<h3>' + 'Pressure Middle: ' + data[i].Pressure_Middle + '</h3>' +
      '<h3>' + 'Pressure Right: ' + data[i].Pressure_Right + '</h3>' +
      '<h3>' + 'Result: ' + data[i].Result + '</h3>'
    ).addTo(map)
}
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

function Get_Run_Plays_Pressure(data, column){
  run_plays = []
  for(i = 0; i < Object.keys(data).length; i++)
  {
    if(data[i][column] == 1 && (data[i]["Play_Type"] == "Inside Run" || data[i]["Play_Type"] == "Outside Run"))
    {
      //alert(data[i]["Result"])
      run_plays.push(data[i]["Result"])
    }
  }
  return run_plays  
}

function Get_Run_Plays(data){
run_plays = []
for(i = 0; i < Object.keys(data).length; i++)
{
  if(data[i]["Play_Type"] == "Inside Run" || data[i]["Play_Type"] == "Outside Run")
  {
    run_plays.push(data[i])
  }
}
return run_plays 
}

function Get_Pass_Plays(data){
pass_plays = []
for(i = 0; i < Object.keys(data).length; i++)
{
  if(data[i]["Play_Type"] == "Pocket Pass" || data[i]["Play_Type"] == "Boot Pass")
  {
    pass_plays.push(data[i])
  }
}
return pass_plays 
}

function Get_Pass_Plays_Pressure(data, column){
run_plays = []
for(i = 0; i < Object.keys(data).length; i++)
{
  if(data[i][column] == 1 && (data[i]["Play_Type"] == "Pocket Pass" || data[i]["Play_Type"] == "Boot Pass"))
  {
    //alert(data[i]["Result"])
    run_plays.push(data[i]["Result"])
  }
}
return run_plays  
}

function Form_PlayType(data)
{
  output = "Play Type by Formation:\n\n";
  forms = Sum_By(Get_Column(data, "Formation"));
  for(i = 0; i < Object.keys(forms).length; i++)
  {
      inside_run = 0;
      outside_run = 0;
      pocket_pass = 0;
      boot_pass = 0;
      output += forms.unique_values[i] + " Entries " + forms.values[i] + ":\n\n";

      for(j = 0; j < Object.keys(data).length; j++)
      {
        if(data[j]["Play_Type"] == "Inside Run" && data[j]["Formation"] == forms.unique_values[i]){inside_run += 1;}
        else if(data[j]["Play_Type"] == "Outside Run" && data[j]["Formation"] == forms.unique_values[i]){outside_run += 1;}
        else if(data[j]["Play_Type"] == "Pocket Pass" && data[j]["Formation"] == forms.unique_values[i]){pocket_pass += 1;}
        else if(data[j]["Play_Type"] == "Boot Pass" && data[j]["Formation"] == forms.unique_values[i]){boot_pass += 1;}
      }
      output += '\tInside Run:' + inside_run + '\n';
      output += '\tOutside Run:' + outside_run + '\n';
      output += '\tPocket Pass:' + pocket_pass + '\n';
      output += '\tBoot Pass:' + boot_pass + '\n\n';
      //alert(returns)
  }

  DAT_write(output, "FormPlayType");
}

function Form_BallCarrier(data)
{
  output = "Ball Carrier by Formation:\n\n";
  run_plays = Get_Run_Plays(data)
  forms = Sum_By(Get_Column(run_plays, "Formation"));
  carriers = Get_Unique(Get_Column(run_plays, "Result_BallCarrier"));
  for(i = 0; i < Object.keys(forms).length; i++)
  {
      output += '\t' + forms.unique_values[i] + ":\n\n";
      output += "\t\tPlayers Percent of Carries;" + "\n\n";
      for(j = 0; j < Object.keys(carriers).length; j++)
      {
          form_count = 0;
          carrier_count = 0;
          for(q = 0; q < Object.keys(data).length; q++)
          {
              if(data[q]["Play_Type"] == "Inside Run" || data[q]["Play_Type"] == "Outside Run")
              {
                  form_count = form_count + 1;
                  if(data[q]["Result_BallCarrier"] == carriers[j])
                  {
                      carrier_count = carrier_count + 1;
                  }
              }
          }
          output += '\t\t' + carriers[j] + ' | Carries | ' + carrier_count + ' | '  + (carrier_count/form_count).toFixed(2) * 100 + '%\n';
      }
      output += '\n'
  }

  DAT_write(output, "FormRusher");
}

function Rush_Pressure(data){
output = "Offensive Effiency against a given Pressure \n\n";
run_plays_middle = Get_Run_Plays_Pressure(data, "Pressure_Middle")
run_plays_middle_eff_count = 0;
for(i = 0; i < run_plays_middle.length; i++)
{
  if(run_plays_middle[i] > 3){run_plays_middle_eff_count =+ 1;}
}

run_plays_right = Get_Run_Plays_Pressure(data, "Pressure_Right")
run_plays_right_eff_count = 0;
for(i = 0; i < run_plays_right.length; i++)
{
  if(run_plays_right[i] > 3){run_plays_right_eff_count =+ 1;}
}

run_plays_left = Get_Run_Plays_Pressure(data, "Pressure_Left")
run_plays_left_eff_count = 0;
for(i = 0; i < run_plays_left.length; i++)
{
  if(run_plays_left[i] > 3){run_plays_left_eff_count =+ 1;}
}

output += "\t Pressure Right: | Count: " + run_plays_right_eff_count +  " | " + parseFloat((run_plays_right_eff_count / run_plays_right.length) * 100).toFixed(2) + "%\n\n";
output += "\t Pressure Middle: | Count: " + run_plays_middle_eff_count +  " | " + parseFloat((run_plays_middle_eff_count / run_plays_middle.length) * 100).toFixed(2) + "%\n\n";
output += "\t Pressure Left: | Count: " + run_plays_left_eff_count +  " | " + parseFloat((run_plays_left_eff_count / run_plays_left.length) * 100).toFixed(2) + "%\n\n";
DAT_write(output, "RushEffiency")
}

function Rush_Personnel(data){
  output = "Ball Carrier by Personel: \n\n";
  run_plays = Get_Run_Plays(data);
  personnel = Sum_By(Get_Column(run_plays, "Personnel"));
  carriers = Get_Unique(Get_Column(run_plays, "Result_BallCarrier"));
  for(i = 0; i < Object.keys(personnel).length; i++)
  {
      output += '\t' + personnel.unique_values[i] + ":\n\n";
      output += "\t\tPlayers Percent of Carries;" + "\n\n";
      for(j = 0; j < Object.keys(carriers).length; j++)
      {
          personnel_count = 0;
          carrier_count = 0;
          for(q = 0; q < Object.keys(run_plays).length; q++)
          {
              if(run_plays[q]["Play_Type"] == "Inside Run" || run_plays[q]["Play_Type"] == "Outside Run")
              {
                  personnel_count = personnel_count + 1;
                  if(run_plays[q]["Result_BallCarrier"] == carriers[j])
                  {
                      carrier_count = carrier_count + 1;
                  }
              }
          }
          output += '\t\t' + carriers[j] + ' | Carries | ' + carrier_count + ' | '  + parseFloat((carrier_count/personnel_count) * 100).toFixed(2) + '%\n';
      }
      output += '\n'
  }

  DAT_write(output, "PersonalRusher");
}

function Pass_Pressure(data){
output = "Offensive Effiency against a given Pressure \n\n";
pass_plays_middle = Get_Pass_Plays_Pressure(data, "Pressure_Middle")
pass_plays_middle_eff_count = 0;
for(i = 0; i < pass_plays_middle.length; i++)
{
  if(pass_plays_middle[i] > 3){pass_plays_middle_eff_count =+ 1;}
}

pass_plays_right = Get_Pass_Plays_Pressure(data, "Pressure_Right")
pass_plays_right_eff_count = 0;
for(i = 0; i < pass_plays_right.length; i++)
{
  if(pass_plays_right[i] > 3){pass_plays_right_eff_count =+ 1;}
}

pass_plays_left = Get_Pass_Plays_Pressure(data, "Pressure_Left")
pass_plays_left_eff_count = 0;
for(i = 0; i < pass_plays_left.length; i++)
{
  if(run_plays_left[i] > 3){pass_plays_left_eff_count =+ 1;}
}

output += "\t Pressure Right: | Count: " + pass_plays_right_eff_count +  " | " + parseFloat((pass_plays_right_eff_count / pass_plays_right.length) * 100).toFixed(2) + "%\n\n";
output += "\t Pressure Middle: | Count: " + pass_plays_middle_eff_count +  " | " + parseFloat((pass_plays_middle_eff_count / pass_plays_middle.length) * 100).toFixed(2) + "%\n\n";
output += "\t Pressure Left: | Count: " + pass_plays_left_eff_count +  " | " + parseFloat((pass_plays_left_eff_count / pass_plays_left.length) * 100).toFixed(2) + "%\n\n";
DAT_write(output, "PassEffiency")
}

function Form_PassZone(data){
output = "Pass Zone by Formation:\n\n";
forms = Sum_By(Get_Column(data, "Formation"));
pass_zones = Get_Unique(Get_Column(data, "Pass_Zone"));
// For each Formation
for(i = 0; i < Object.keys(forms).length; i++)
{
    output += '\t' + forms.unique_values[i] + ":\n\n";
    output += "\t\tPass Zones:" + "\n\n";

    // For each pass zone
    for(j = 0; j < Object.keys(pass_zones).length; j++)
    {
        passes = 0;
        form_count = 0;
        if(pass_zones[j] == "Non Passing Play"){}
        else{

          for(q = 0; q < Object.keys(data).length; q++)
          {
              if(data[q]["Formation"] == forms.unique_values[i] && (data[q]["Play_Type"] == "Pocket Pass" || data[q]["Play_Type"] == "Boot Pass"))
              {
                  form_count = form_count + 1;
                  if(data[q]["Pass_Zone"] == pass_zones[j])
                  {
                    passes = passes + 1;
                  }
              }
          }
          output += '\t\t' + pass_zones[j] + ' ' + passes + ' | '  + (passes/form_count).toFixed(2) * 100 + '%\n\n';
        }

    }

    output += '\n'
}

DAT_write(output, "PassZone");
}

function Pass_Coverage(data){
  output = "Offensive Effiency by Coverage: \n\n";
  coverages = Get_Unique(Get_Column(data, "Coverage"));
  for(i = 0; i < Object.keys(coverages).length; i++)
  {
    coverage_count = 0;
    eff_count = 0;
    for(j = 0; j < Object.keys(data).length; j++)
    {
      if(data[j]["Coverage"] == coverages[i])
      {
        coverage_count += 1;
        if(data[j]["Result"] > 3){eff_count += 1;}
      }
    }
    output += '\t' + coverages[i] + '| Count: ' + coverage_count + ' | Efficency: ' +  parseFloat((eff_count/coverage_count) * 100).toFixed(2) + '%\n\n';
  }
  DAT_write(output, "CoverageEffiency")
}

function Personal_PlayType(data){
output = "Play Type by Personal:\n\n";
personnel = Sum_By(Get_Column(data, "Personnel"));
for(i = 0; i < Object.keys(personnel).length; i++)
{
    inside_run = 0;
    outside_run = 0;
    pocket_pass = 0;
    boot_pass = 0;
    output += personnel.unique_values[i] + " Entries " + personnel.values[i] + ":\n\n";

    for(j = 0; j < Object.keys(data).length; j++)
    {
      if(data[j]["Play_Type"] == "Inside Run" && data[j]["Personnel"] == personnel.unique_values[i]){inside_run += 1;}
      else if(data[j]["Play_Type"] == "Outside Run" && data[j]["Personnel"] == personnel.unique_values[i]){outside_run += 1;}
      else if(data[j]["Play_Type"] == "Pocket Pass" && data[j]["Personnel"] == personnel.unique_values[i]){pocket_pass += 1;}
      else if(data[j]["Play_Type"] == "Boot Pass" && data[j]["Personnel"] == personnel.unique_values[i]){boot_pass += 1;}
    }
    output += '\tInside Run:' + inside_run + '\n';
    output += '\tOutside Run:' + outside_run + '\n';
    output += '\tPocket Pass:' + pocket_pass + '\n';
    output += '\tBoot Pass:' + boot_pass + '\n\n';
}
DAT_write(output, "PersonalPlayType");
}

function Get_Sum(data, val_column)
{
value = 0;
for(i = 0; i < Object.keys(data).length; i++)
{
  console.log(data.val_column);
  value = value + data[i][val_column] 
}
return value
}

function Generate_Stats(data){
  document.getElementById("drive_len").innerText = Object.keys(data).length;
  document.getElementById("avg_gain").innerText = Math.round(Get_Sum(data, "Result") / Object.keys(data).length);
  document.getElementById("avg_dist").innerText = Math.round(Get_Sum(data, "Distance") / Object.keys(data).length);
  document.getElementById("total_yards").innerText = Get_Sum(data, "Result");
  document.getElementById("rush_yards").innerText = Math.round(Get_Sum(Get_Run_Plays(data), "Result"));
  document.getElementById("pass_yards").innerText = Math.round(Get_Sum(Get_Pass_Plays(data), "Result"));
  
  var explosive_plays = 0;
  var strength_plays = 0;
  for(i = 0; i < Object.keys(data).length; i++)
  {
    //Explosive Palys
    if(data[i]["Result"] > 10 && (data[i]["Play_Type"] == "Inside Run" || data[i]["Play_Type"] == "Outside Run")){explosive_plays++;}
    else if(data[i]["Result"] > 20 && (data[i]["Play_Type"] == "Pocket Pass" || data[i]["Play_Type"] == "Boot Pass")){explosive_plays++;}

    //Plays to Strength
    console.log(data[i]["Play_Type_Dir"])
    console.log(data[i]["Formation_Strength"])
    if(data[i]["Play_Type_Dir"] == data[i]["Formation_Strength"])
    {
      strength_plays++;
    }
  }

  document.getElementById("str_play").innerText = strength_plays;
  document.getElementById("exp_play").innerText = explosive_plays;
}

function Load_DAT()
{

  DAT_write("Ball Carrier by Personel:", "PersonalRusher");
  DAT_write("Play Type by Personel:", "PersonalPlayType");
  DAT_write("Play Type by Formation:", "FormPlayType");
  DAT_write("Ball Carrier by Formation:", "FormRusher")
  DAT_write("Effiency against a given Pressure", "RushEffiency");
}

function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

async function DAT_write(message, id)
{
  if((message.length) == 0 )
  {
      message = ""
  }
  DAT_output = document.getElementById(id);
  write_out = ""

  for(i = 0; i < message.length; i++)
  {
      write_out += message.charAt(i);
      DAT_output.value = write_out;
  }
}

function Build_Graphs(data, obj){
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