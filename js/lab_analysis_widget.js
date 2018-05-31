
function update_chart(property) {
  var currentDate = moment().unix();
  var threeMonthsAgo = moment().subtract(3, 'months').unix();

  var DataSet = [];
  for(var i=0;i<property.test_results.length;i++) {
    if(property.test_results[i].test_date < currentDate && property.test_results[i].test_date > threeMonthsAgo) {
      DataSet.unshift([(property.test_results[i].test_date * 1000), parseFloat(property.test_results[i].result)]);
    }
  }

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
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%e. %b',
            week: '%b %e',
            month: '%b \'%y',
            year: '%Y'
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
        data: DataSet,
        color: 'red',
        zIndex: 1
      }]
  });
}


function update_prop_btns(property) {
  //remove current buttons
  $('.lab_analysis .inside').empty();

  //create chart holder
  var chart_holder  = $('<div>',  {
    id: "chart_cntr",
    width: "100%",
    height: "300px",
  });

  //creat prop btns holder
  var property_btn_cntr = $('<div>', {
    class: "comp_btn_cntr",
  })

  //create ul to hold li of symbols
  var property_symbols = $('<ul>', {
    class: "conc_list"
    //html: "<li>Zn</li><li style='color: grey;transform: scale(0.9);'>NaOH</li><li>Carb</li><li>Fe</li><li>Cr</li><li>Cu</li>"
  })

  //create symbols buttons
  var symbols_arr = property.map(function(e) {return e.symbol});
  for(var i = 0; i < symbols_arr.length; i++) {
    var li = $('<li>', {
      text: symbols_arr[i],
      onclick: "update_chart(app_obj.properties["+i+"])"
    });
    property_symbols.append(li);
  }

  //attach ul of symbols btns
  $(property_btn_cntr).append(property_symbols);

  //attach chart and property btns
  $('.lab_analysis .inside').append(chart_holder, property_btn_cntr);
}



function update_lab_analysis_widget(app_obj){
  //check if properties
  if(app_obj.properties) {
    update_prop_btns(app_obj.properties);
    update_chart(app_obj.properties[0]);
  }
}
