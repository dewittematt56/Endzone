function Load()
{
    getTeams()
}

function insertRow(rowObj)
{
    const table = document.getElementById("table");
    var row = table.insertRow(2);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    var cell9 = row.insertCell(8);
    var cell10 = row.insertCell(9);
    var cell11 = row.insertCell(10);
    var cell12 = row.insertCell(11);
    var cell13 = row.insertCell(12);
    var cell14 = row.insertCell(13);
    var cell15 = row.insertCell(14);
    var cell16 = row.insertCell(15);
    var cell17 = row.insertCell(16);
    var cell18 = row.insertCell(17);
    var cell19 = row.insertCell(18);
    var cell20  = row.insertCell(19);
    var cell21  = row.insertCell(20);
    var cell22  = row.insertCell(21);
    var cell23  = row.insertCell(22);
    cell1.innerHTML = rowObj.PlayNum;
    cell1.style.textAlign = "center"
    cell1.contentEditable = "true";
    cell2.innerHTML = rowObj.Team_Name;
    cell2.style.textAlign = "center"
    cell2.contentEditable = "true";
    cell3.innerHTML = rowObj.Opponent_Name;
    cell3.style.textAlign = "center"
    cell3.contentEditable = "true";     
    cell4.innerHTML = rowObj.Year;
    cell4.style.textAlign = "center"
    cell4.contentEditable = "true";
    cell5.innerHTML = rowObj.Possession;
    cell5.style.textAlign = "center"
    cell5.contentEditable = "true";
    cell6.innerHTML = rowObj.Drive;
    cell6.style.textAlign = "center"
    cell6.contentEditable = "true";
    cell7.innerHTML = rowObj.Quarter;
    cell7.style.textAlign = "center"
    cell7.contentEditable = "true";
    cell8.innerHTML = rowObj.Yard;
    cell8.style.textAlign = "center"
    cell8.contentEditable = "true";
    cell9.innerHTML = rowObj.Hash;
    cell9.style.textAlign = "center"
    cell9.contentEditable = "true";
    cell10.innerHTML = rowObj.Down;
    cell10.style.textAlign = "center"
    cell10.contentEditable = "true";
    cell11.innerHTML = rowObj.Distance;
    cell11.style.textAlign = "center"
    cell11.contentEditable = "true";
    cell12.innerHTML = rowObj.Formation;
    cell12.style.textAlign = "center"
    cell12.contentEditable = "true";
    cell13.innerHTML = rowObj.Formation_Strength;
    cell13.style.textAlign = "center"
    cell13.contentEditable = "true";
    cell14.innerHTML = rowObj.Play_Type;
    cell14.style.textAlign = "center"
    cell14.contentEditable = "true";
    cell15.innerHTML = rowObj.Play_Type_Dir;
    cell15.style.textAlign = "center"
    cell15.contentEditable = "true";
    cell16.innerHTML = rowObj.Result_BallCarrier;
    cell16.style.textAlign = "center"
    cell16.contentEditable = "true";
    cell17.innerHTML = rowObj.Pass_Zone;
    cell17.style.textAlign = "center"
    cell17.contentEditable = "true";
    cell18.innerHTML = rowObj.D_Formation;
    cell18.style.textAlign = "center"
    cell18.contentEditable = "true";
    cell19.innerHTML = rowObj.Coverage;
    cell19.style.textAlign = "center"
    cell19.contentEditable = "true";
    cell20.innerHTML = rowObj.Pressure_Left;
    cell20.style.textAlign = "center"
    cell20.contentEditable = "true";
    cell21.innerHTML = rowObj.Pressure_Middle;
    cell21.style.textAlign = "center"
    cell21.contentEditable = "true";
    cell22.innerHTML = rowObj.Pressure_Right;
    cell22.style.textAlign = "center"
    cell22.contentEditable = "true";
    cell23.innerHTML = rowObj.Result;
    cell23.style.textAlign = "center"
    cell23.contentEditable = "true";
}

function getTeams()
{
    var url = "/endzone/rest/getunique";
    $.get(url, function(data, status){

        var cmbtoi = document.getElementById("toi");
        while (cmbtoi.options.length > 0) {
            cmbtoi.remove(0);
        }
        for(i = 0; i < Object.keys(data).length; i++)
        {
                var option = document.createElement('option');   
                option.text = data[i];
                option.value = data[i];      
                cmbtoi.options.add(option)    
        }
    }) 
}

function refreshTable(table)
{
  var table = document.getElementById("table");
  for(var i = table.rows.length - 1; i > 1; i--)
  {
      table.deleteRow(i);
  }
}

function getDataClick()
{
    team = document.getElementById("toi").value;
    getData(team);
}

function getData(teamOfinterest)
{
    refreshTable()
    var url = "/endzone/rest/getdata?full=false&teamcode=" + params.teamcode + "&possession=" + teamOfinterest;
    $.get(url, function(data, status){
        for(i = 0; i < Object.keys(data).length; i++)
        {
            insertRow(data[i])
        }
        params.data = data;
        console.log(params.data)
        loadCombobox(getUnique(getColumn(data, "Team_Name")), "teamname");
        loadCombobox(getUnique(getColumn(data, "Opponent_Name")), "opponent");
        loadCombobox(getUnique(getColumn(data, "Year")), "year");
        loadCombobox(getUnique(getColumn(data, "Possession")), "possession");
        loadCombobox(getUnique(getColumn(data, "Drive")), "drive");
        loadCombobox(getUnique(getColumn(data, "Quarter")), "quarter");
        loadCombobox(getUnique(getColumn(data, "Hash")), "hash");
        loadCombobox(getUnique(getColumn(data, "Down")), "down");
        loadCombobox(getUnique(getColumn(data, "Formation")), "formation");
        loadCombobox(getUnique(getColumn(data, "Formation_Strength")), "strength");
        loadCombobox(getUnique(getColumn(data, "Play_Type")), "playtype");
        loadCombobox(getUnique(getColumn(data, "Play_Type_Dir")), "playdir");
        loadCombobox(getUnique(getColumn(data, "Result_BallCarrier")), "ballcarrier");
        loadCombobox(getUnique(getColumn(data, "Pass_Zone")), "passzone");
        loadCombobox(getUnique(getColumn(data, "D_Formation")), "dform");
        loadCombobox(getUnique(getColumn(data, "Coverage")), "coverage");
    })

}

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
       selectElement.remove(i);
    }
 }
 

function loadCombobox(array, id)
{
  var select = document.getElementById(id)
  var option = document.createElement('option');
  option.text = "No Filter";
  option.value = "No Filter";
  removeOptions(select)
  select.options.add(option)
  for(const arr of array)
  {
    var option = document.createElement('option');
    option.text = arr;
    option.value = arr;
    select.options.add(option)
  }
}

function getUnique(column){
    set = new Set(column)
    return Array.from(set)
}

function getColumn(data, column){
    values = [];
    for(i = 0; i < Object.keys(data).length; i++){values.push(data[i][column])}
    return values;
}

function filterByColumn(data, column, value)
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

function filterDataClick()
{
    data = params.data
    // Get filter inputs
    team = document.getElementById("teamname").value;
    opponent = document.getElementById("opponent").value;
    year = document.getElementById("year").value;
    possession = document.getElementById("possession").value;
    drive = document.getElementById("drive").value;
    quarter = document.getElementById("quarter").value;
    hash =  document.getElementById("hash").value;
    down =  document.getElementById("down").value;
    formation =  document.getElementById("formation").value;
    strength =  document.getElementById("strength").value;
    playtype =  document.getElementById("playtype").value;
    playdir =  document.getElementById("playdir").value;
    ballcarrier =  document.getElementById("ballcarrier").value;
    passzone =  document.getElementById("passzone").value;
    dform =  document.getElementById("dform").value;
    coverage =  document.getElementById("coverage").value;
    data = filterDataDistance(data, document.getElementById("distance").value)
    data = filterDataYard(data, document.getElementById("yard").value)
    if(team != "No Filter"){data = filterByColumn(data, "Team_Name", team)}
    if(opponent != "No Filter"){data = filterByColumn(data, "Opponent_Name", opponent)}
    if(year != "No Filter"){data = filterByColumn(data, "Year", year)}
    if(possession != "No Filter"){data = filterByColumn(data, "Possession", possession)}
    if(drive != "No Filter"){data = filterByColumn(data, "Drive", drive)}
    if(quarter != "No Filter"){data = filterByColumn(data, "Quarter", quarter)}
    if(hash != "No Filter"){data = filterByColumn(data, "Hash", hash)}
    if(down != "No Filter"){data = filterByColumn(data, "Down", down)}
    if(formation != "No Filter"){data = filterByColumn(data, "Formation", formation)}
    if(strength != "No Filter"){data = filterByColumn(data, "Formation_Strength", strength)}
    if(playtype != "No Filter"){data = filterByColumn(data, "Play_Type", playtype)}
    if(playdir != "No Filter"){data = filterByColumn(data, "Play_Type_Dir", playdir)}
    if(ballcarrier != "No Filter"){data = filterByColumn(data, "Result_BallCarrier", ballcarrier)}
    if(passzone != "No Filter"){data = filterByColumn(data, "Pass_Zone", passzone)}
    if(dform != "No Filter"){data = filterByColumn(data, "D_Formation", dform)}
    if(coverage != "No Filter"){data = filterByColumn(data, "Coverage", coverage)}
    refreshTable();
    for(i = 0; i < Object.keys(data).length; i++)
    {
        insertRow(data[i])
    }
}

function filterDataYard(data, yard)
{
    new_data = []
    if(yard == "No Filter")
    {
        return data
    }
    else if(yard == "Backed Up")
    {
      for(i = 0; i < Object.keys(data).length; i++)
      {
        if(data[i]["Yard"] <= 33)
        {
          new_data.push(data[i])
        }
      }
    }
    else if(yard == "Scoring Position")
    {
      for(i = 0; i < Object.keys(data).length; i++)
      {
        if(data[i]["Yard"] >= 66)
        {
          new_data.push(data[i])
        }
      }
    }
    else
    {
      for(i = 0; i < Object.keys(data).length; i++)
      {
            if(data[i]["Yard"] < 66 && data[i]["Yard"] > 33)
            {
            new_data.push(data[i])
            }
      }
    }
    return new_data
}

function filterDataDistance(data, distance)
{
    new_data = []
    if(distance == "No Filter")
    {
        return data
    }
    else if(distance == "Short")
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
    return new_data
}

function createMap(mapObj)
{
  mapObj.mapBounds = L.latLngBounds([
    [-2, 0],
    [12, 10]
  ]);

  mapObj.map = L.map('map', {  
  zoomControl: false,
  maxBounds: mapObj.mapBounds,
  maxBoundsViscosity: 1.0,
  minZoom: 6,
  maxZoom: 11});

  mapObj.map.fitBounds(mapObj.mapBounds);
  mapObj.map.setZoom(6);

  mapObj.FieldBase = L.imageOverlay("/static/spatial/FootballFieldBase.jpg", L.latLngBounds([[0, 0], [10, 10]])).addTo(mapObj.map)
  mapObj.EndzoneNorth = L.imageOverlay("/static/spatial/EndzoneNorth.jpg",  L.latLngBounds([[10, 0], [12, 10]])).addTo(mapObj.map)
  mapObj.EndzoneSouth = L.imageOverlay("/static/spatial/EndzoneSouth.jpg", L.latLngBounds([[0, 0], [-2, 10]])).addTo(mapObj.map)
}

