$(document).ready(function () {

  
  $("#zones").on("click", function () {
    // console.log("cklici zones ");
    var sidebarItems = $(this).children(".sidebar-menu-item");
    // console.log(" sidebarItems : ",sidebarItems.hasClass('open'));
    if (sidebarItems.hasClass("open")) {
      sidebarItems.removeClass("open");
    } else {
      sidebarItems.addClass("open");
    }
    // console.log(" sidebarItems : ",sidebarItems.hasClass('open'));
  });

  $("#farms").on("click", function () {
    // console.log("cklici farms");
    var sidebarItems = $(this).children(".sidebar-menu-item");
    // console.log(" sidebarItems : ",sidebarItems);
    if (sidebarItems.hasClass("open")) {
      sidebarItems.removeClass("open");
    } else {
      sidebarItems.addClass("open");
    }
  });

  $(document).on("click", ".sidebar-submenu", function () {
    if ($(this).data("farm-id")) {
      var farmid = $(this).data("farm-id");
      var farmlabel = $(this).find(".sidebar-menu-text").text();
      console.log("data :", farmid, farmlabel);
      handleFarmClick(farmid, farmlabel);
    } else if ($(this).data("zone-id")) {
      console.log("data :", $(this).data("zone-id"));

      var zoneid = $(this).data("zone-id");
      var zonelabel = $(this).find(".sidebar-menu-text").text();
      console.log("data :", zoneid, zonelabel);

      handleZoneClick(zoneid, zonelabel);
    }
  });
});

//ajouter les zone
function handleFarmClick(farmId, farmlabel) {
  // Faites ce que vous voulez avec le nom de la ferme
  console.log("ID farm : " + farmId);
  // Vous pouvez appeler d'autres fonctions ou effectuer des actions supplémentaires ici
  $.ajax({
    type: "GET",
    url: "/web/get_zones", // Ajuster l'URL selon votre configuration
    data: { farm_id: farmId },
    success: function (data) {
      // Supprime tout le contenu actuel de l'élément Selecte "zones"
      $("#zones").empty();
      $("#label_farm").empty();
      $("#label_zone").empty();
      $("#label_farm").append(farmlabel);
      $("#chars").empty();
      // console.log("data farm:", data);
      // Crée un nouvel élément de type <li>
      var zoneListItem = $(
        '<li class="sidebar-menu-item" >' +
          '<a class="sidebar-menu-button js-sidebar-collapse" data-toggle="collapse" >' +
          '<span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">donut_large</span> Zones' +
          '<span class="ml-auto sidebar-menu-toggle-icon"></span>' +
          "</a>"
      );
      
      // Ajoute les options de zones renvoyées par le serveur
      for (var i = 0; i < data.length; i++) {
       
        zoneListItem.append('<ul class="sidebar-submenu collapse sm-indent" data-zone-id="' +
                      data[i].id + '"><li class="sidebar-menu-item"id="' +
                      data[i].name + '"><span class="sidebar-menu-button"> <span class="sidebar-menu-text">' +
                      data[i].label + '</span></span></li></ul>');
      }
      // Ajoute le nouvel élément <select> à l'élément Selecte "zones"
      $("#zones").append(zoneListItem);
      $("#zones").append("</li> ");
    },
    error: function (xhr, status, error) {
      // console.error("AJAX Error:", status, error);
    },
  });
}
// creation chars
function handleZoneClick(zoneId, zonelabel) {
  console.log("Zones id :" + zoneId);
  $.ajax({
    type: "GET",
    url: "/web/get_sensor",
    data: { zone_id: zoneId },
    success: function (dataresu) {
      $("#chars").empty();
      $("#label_zone").empty();
      $("#label_zone").append(zonelabel);
      var min = 10;
      var max = 37;
      var maxchar = 70;
      var datnow = new Date();
      var datbefor = new Date(datnow - 23 * 60 * 60 * 1000);

      var now = new Date();
      now.setMinutes(0);

      for (var j = 0; j < 4; j++) {
        var keys = Object.keys(dataresu[j])[0];
        // console.log(keys)
        var data_T = []; // vide data
        for (var i = 0; i < 24; i++) {
          // console.log(dataresu[j][keys][i]['y'])
          var timestamp = new Date(now - i * 60 * 60 * 1000);
          data_T.push({
            x: timestamp,
            y: dataresu[j][keys][i]["y"],
          });
        }

        var selectElement = $(
          '<div id="chartContainer' +
            j +
            '" style="height: 300px; width: 1000%;"></div>'
        );
        $("#chars").append(selectElement);

        var chart = new CanvasJS.Chart("chartContainer" + j, {
          animationEnabled: true,
          title: {
            // text: "date"
          },
          axisX: {
            valueFormatString: "HH:mm",
            minimum: datbefor,
            maximum: datnow,
            intervalType: "hour",
            interval: 2,
          },
          axisY: {
            maximum: maxchar,
            gridThickness: 0,
            minimum: 0,
          },
          legend: {
            verticalAlign: "top",
            horizontalAlign: "right",
            dockInsidePlotArea: false,
          },
          data: [
            {
              name: "max",
              type: "area",
              borderWidth: 0,
              toolTipContent: null,
              color: "rgb(253, 68, 68)",
              markerSize: 0,
              dataPoints: [
                { x: datbefor, y: maxchar },
                { x: datnow, y: maxchar },
              ],
            },
            {
              name: "center",
              type: "area",
              borderWidth: 0,
              toolTipContent: null,
              color: "rgb(37, 236, 64)",
              markerSize: 0,
              dataPoints: [
                { x: datbefor, y: max },
                { x: datnow, y: max },
              ],
            },
            {
              name: "min",
              borderWidth: 0,
              toolTipContent: null,
              type: "area",
              color: "rgb(253, 68, 68)",
              markerSize: 0,
              dataPoints: [
                { x: datbefor, y: min },
                { x: datnow, y: min },
              ],
            },
            {
              name: "",
              toolTipContent: "{y} °C",
              type: "spline",
              color: "rgba(0,75,141,0.7)",
              markerSize: 6,
              dataPoints: data_T,
            },
          ],
          backgroundColor: "#f5f7fa",
        }); // canvas char creation end

        chart.render();
      } //end for 4 chars
    },
    //success end
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
    }, // error end
  }); //ajax end
  $(".canvasjs-chart-credit").empty();
} ///handleZoneClick end
