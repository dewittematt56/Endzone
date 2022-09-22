

document.addEventListener('DOMContentLoaded', function() {
    const myCanvas = new fabric.Canvas("drawing-board", {
        width: document.getElementById("FormationDraw").offsetWidth,
        height: document.getElementById("FormationDraw").offsetHeight,
        backgroundColor: "#1e272e",
        isDrawingMode: false,
      });
    document.getElementById("drawing-board").fabric = myCanvas
});

const createRectangle = () => {
    myCanvas = document.getElementById("drawing-board").fabric;
    const rectangle = new fabric.Rect({
        width: document.getElementById("FormationDraw").offsetHeight / 10,
        height: document.getElementById("FormationDraw").offsetHeight / 10,
    });
    myCanvas.add(rectangle)
}

const deleteObject = () => {
    myCanvas = document.getElementById("drawing-board").fabric;
    if(myCanvas.getActiveObject()){ myCanvas.remove(myCanvas.getActiveObject());
    }
  }

const createCircle = () => {

    myCanvas = document.getElementById("drawing-board").fabric;

    const circle = new fabric.Circle({
        radius: document.getElementById("FormationDraw").offsetHeight / 20,
    });

    myCanvas.add(circle)

}

function LoadFormation(id, teamcode)
{
    table = document.getElementById("table")
    row = table.rows[id]
    document.getElementById("Formation").value = row.cells[0].innerText
    document.getElementById("WR").value = row.cells[1].innerText
    document.getElementById("TE").value = row.cells[2].innerText
    document.getElementById("RB").value = row.cells[3].innerText
}

function DeleteFormation(id, teamcode)
{
    table = document.getElementById("table")
    row = table.rows[id]
    $.ajax({
        async: false,
        url: "/endzone/rest/deleteformation?formation=" + row.cells[0].innerText + "&teamcode=" + teamcode,
        type: "POST",
        success: function (data) 
        {
            alert("Formation: " + row.cells[0].innerText + " deleted. Refresh to see changes.");
        }
    });
}
