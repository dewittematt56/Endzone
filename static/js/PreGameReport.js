function KIPPS_Run()
{
  var categories = "";
  var checkboxes = document.getElementsByName("kipps_team");
  values = []
  for (var i = 0; i < checkboxes.length; i++) {
    if(checkboxes[i].checked == true)
    {
      values.push(checkboxes[i].value);
    }
  }
  document.getElementById("kipps_action").value = "run_kipps";
  document.getElementById("kipps_jobs").value = values;
  document.getElementById("form").submit();
}
async function Get_UniqueTeams(teamcode)
{
  $.ajax({
      async: true,
      url: "/endzone/rest/getgames" + "?teamcode=" + teamcode, 
      type: "GET",
      success: function (data) 
      {
          var fieldset = document.getElementById("fieldset")
          for(i = 0; i < Object.keys(data).length; i++)
          {
            let arr = data[i].split("_")
            let gamestring = arr[0] + " VS " + arr[1] + " | " + arr[2]
            var minidiv = document.createElement("div");

            var checkbox = document.createElement("INPUT");
            
            var label = document.createElement("label");
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("id", "gamestring");
            checkbox.setAttribute("name", "kipps_team")
            checkbox.value = gamestring
            label.setAttribute('for', gamestring)
            label.innerText = gamestring

            minidiv.appendChild(checkbox)
            minidiv.appendChild(label)
            fieldset.appendChild(minidiv)
          }
      }
  });
}

async function Get_Games()
{
  $.ajax({
    async: true,
    url: "/endzone/rest/getgames" + "?teamcode=" + teamcode, 
    type: "GET",
    success: function (data) 
    {
        var fieldset = document.getElementById("fieldset")
        for(i = 0; i < Object.keys(data).length; i++)
        {
          let arr = data[i].split("_")
          let gamestring = arr[0] + " VS " + arr[1] + " | " + arr[2]
          var minidiv = document.createElement("div");

          var checkbox = document.createElement("INPUT");
          
          var label = document.createElement("label");
          checkbox.setAttribute("type", "checkbox");
          checkbox.setAttribute("id", "gamestring");
          checkbox.setAttribute("name", "kipps_team")
          checkbox.value = gamestring
          label.setAttribute('for', gamestring)
          label.innerText = gamestring

          minidiv.appendChild(checkbox)
          minidiv.appendChild(label)
          fieldset.appendChild(minidiv)
        }
    }
});
}

async function Get_Teams(teamcode){
  $.ajax({
    async: true,
    url: "/endzone/rest/getunique" + "?teamcode=" + teamcode, 
    type: "GET",
    success: function (data) 
    {
      var teamCombo = document.getElementById("TeamOfInterest");
      for(i = 0; i < Object.keys(data).length; i++)
      {
              var option = document.createElement('option');   
              option.text = data[i];
              option.value = data[i];      
              teamCombo.options.add(option)    
      }
    }
  });
}