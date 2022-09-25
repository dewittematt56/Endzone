function LoadYear(teamcode)
{
    $.ajax({
        async: true,
        url: "/endzone/rest/getgames" + "?teamcode=" + teamcode,
        type: "GET",
        success: function (data) 
        {
            var yearCombo = document.getElementById("cmbYear");
            for(i = 0; i < Object.keys(data).length; i++)
            {
                    var option = document.createElement('option');   
                    option.text = data[i];
                    option.value = data[i];      
                    yearCombo.options.add(option)    
                    console.log(data[i])  
                    LoadGame(teamcode)
            }
        }
    });
}

function LoadGame(teamcode)
{
    var year = document.getElementById('cmbYear').value;
    $.ajax({
        async: true,
        url: "/endzone/rest/getgames" + "?teamcode=" + teamcode + "&year=" + year, 
        type: "GET",
        success: function (data) 
        {
            var yearCombo = document.getElementById("cmbGame");
            while (yearCombo.options.length > 0) {
                yearCombo.remove(0);
            }
            for(i = 0; i < Object.keys(data).length; i++)
            {
                    var option = document.createElement('option');   
                    option.text = data[i];
                    option.value = data[i];      
                    yearCombo.options.add(option)    
            }
        }
    });
}

function RunReport(teamcode)
{
    document.getElementById("teamcode").value = teamcode
    document.getElementById("form").submit()
}