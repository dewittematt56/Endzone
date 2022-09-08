function TARS_write_welcome()
{
    
    var message = "Welcome, I am TARS. Please select a model for me to use and input conditions on the right."
    TARS_write(message);
    
}

function sleep(ms) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
}



async function TARS_write(message)
{
    if((message.length) == 0 )
    {
        message = "TARS-Response: Nothing to report"
    }
    TARS_output = document.getElementById("TARS");
    TARS_output.value = " "
    write_out = ""

    for(i = 0; i < message.length; i++)
    {
        write_out += message.charAt(i);
        await sleep(20)
        TARS_output.value = write_out;
    }
}