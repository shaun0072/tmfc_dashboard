
function update_chart(property) {



  var myChart = Highcharts.chart('chart_cntr', {
      chart: {
        type: 'spline',
        backgroundColor : null,
      },
      credits : {
        enabled: false
      },
      legend : {
        enabled: false
      },
      title: {
          text: property.name,
          style : {
            color: '#c7cbd2',
            fontFamily:  "Quicksand, sans-serif"
          }
      },
      xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: { // don't display the dummy year
            month: '%e. %b',
            year: '%b'
          },
          lineWidth: 0,
          minorGridLineWidth: 0,
          lineColor: 'transparent',
          minorTickLength: 0,
          tickLength: 0
      },
      yAxis: {
        title: {
          text: property.unit,
        },
        gridLineWidth: 0,
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          }
        }
      },
      series: [{
        name: property.symbol,
        data: [
          [Date.UTC(1970, 10, 25), 0],
          [Date.UTC(1970, 11,  6), 0.25],
          [Date.UTC(1970, 11, 20), 1.41],
          [Date.UTC(1970, 11, 25), 1.64],
        ],
        color: 'red',
        zIndex: 1
      }]
  });
}



function update_lab_analysis_widget(app_obj){

  //check for PROPERTIES
  if(app_obj.properties) {
    var chart_holder  = $('<div>',  {
      id: "chart_cntr",
      width: "100%",
      height: "300px",
    });

    var property_btn_cntr = $('<div>', {
      class: "comp_btn_cntr",
    })

    var property_symbols = $('<ul>', {
      class: "conc_list",
      html: "<li>Zn</li><li style='color: grey;transform: scale(0.9);'>NaOH</li><li>Carb</li><li>Fe</li><li>Cr</li><li>Cu</li>"
    })


    $(property_btn_cntr).append(property_symbols);
    $('.lab_analysis .inside').append(chart_holder, property_btn_cntr);

    update_chart(app_obj.properties[0]);
  }
}
