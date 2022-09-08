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
