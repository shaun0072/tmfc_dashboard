

function update_lab_analysis_widget(){
  console.log("la widget called");
  var chart  = $('<div>',  {
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



  $('.lab_analysis .inside').append(chart, property_btn_cntr, property_symbols);


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
          text: 'Sodium Hydroxide Concentration',
    style : {
      color: '#c7cbd2',
      fontFamily:  "Quicksand, sans-serif"
    }
      },
      xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    lineWidth: 0,
     minorGridLineWidth: 0,
     lineColor: 'transparent',
     minorTickLength: 0,
     tickLength: 0
      },
      yAxis: {
          title: {
              text: 'opg',
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
          name: 'NaOH',
          data: [15.9, 16.1, 16.5, 16.2, 15.5, 15.8, 16.0, 15.9],
    color: 'red',
    zIndex: 1
      }]
  });

}
