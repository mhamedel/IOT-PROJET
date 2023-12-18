 var data_T = generateRandomData(24);
    var min = 10;
    var max = 37;
    var maxchar = 70;

    var datnow = new Date();
    var datbefor = new Date(datnow - 23 * 60 * 60 * 1000);

    var chart = new CanvasJS.Chart("chartContainer", {
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
            dockInsidePlotArea: false
        },
        data: [{
            name: "max",
            type: "area",
            borderWidth: 0,
            toolTipContent: null,
            color: "rgb(253, 68, 68)",
            markerSize: 0,
            dataPoints: [
                { x: datbefor, y: maxchar },
                { x: datnow, y: maxchar },
            ]
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
            ]
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
            ]
        },
        {
            name: "",
            toolTipContent: "{y} °C",
            type: "spline",
            color: "rgba(0,75,141,0.7)",
            markerSize: 6,
            dataPoints: data_T
        }],
        backgroundColor: "#f5f7fa"
    });

    function generateRandomData(length) {
        var data = [];
        var now = new Date();
        now.setMinutes(0);
        for (var i = 0; i < length; i++) {
            var timestamp = new Date(now - i * 60 * 60 * 1000);

            data.push({
                x: timestamp,
                y: Math.round(0 + Math.random() * 50)
            });
        }

        return data;
    }


    chart.render();

