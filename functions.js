

var general_obj,
	  process_obj,
	  app_obj;
function add_processes(proc_obj) {
	for(var key in proc_obj) {
		var list_item = '<li class="process_list_item" onclick="get_apps(this)" data-title-type="process">' + key +'</li>' ;
		$('.nav_cntr .process_list').append(list_item);
	}
}

function updt_dshbrd_info_cont(title, subinfo) {
	//clear current content
	$('.dashboard_info_cntr').empty();

	var title_html = '<h1><span class="title">'+title+'</span></h1>';
	$('.dashboard_info_cntr').append(title_html);

	for(key in subinfo) {
		var subinfo_html = '<h3><span class="info_title_describe">'+key+':</span> <span class="info_title">'+subinfo[key]+'</span></h3>';
		$('.dashboard_info_cntr').append(subinfo_html);
	}

}


function update_general_obj() {
	$.ajax({
		url:"update_general_info_handler.php",
		method:"POST",
		dataType: 'json',
		success: function(gen_obj)
		{
			console.log(gen_obj);
			general_obj = gen_obj;
		}
	});
}
update_general_obj();

function update_proc_obj() {

	$.ajax({
		url:"update_current_processes_handler.php",
		method:"POST",
		dataType: 'json',
		success: function(proc_obj)
		{
			process_obj = proc_obj;
			add_processes(proc_obj);
		}
	   });
}
update_proc_obj();

function null_to_na(val) {
	if(typeof val === "string" || val === null) {
		var new_val = (val != null) ? val : "n/a";
		return new_val;
	} else {
		return val;
	}
}


var countDecimals = function (value) {
    return value.toString().split(".")[1].length || 0;
}


function null_to_na_arry(arry) {
	if(arry.constructor === Array){
		for(var i=0;i<arry.length;i++) {
			arry[i] = null_to_na(arry[i]);
		}
		return arry;
	}
}

function update_app_obj_given_element(element) {
	var application_id = $(element).attr('data');

	update_app_obj(application_id);
}

function update_app_obj(app_id) {

	$.ajax({
		url:"update_app_handler.php",
		method:"POST",
		dataType: 'json',
		data: {"app_id": app_id},
		success: function(application_obj) {
			app_obj = application_obj;
			updt_dshbrd_info_cont(app_obj.type, {
				"Process": app_obj.proc_assoc.map(function(a) {return a.name}).reduce(function(tot, cur) {return tot + "/" + cur}),
				"Tank Number": app_obj["tank_assoc"][0]["name"]
			});
			update_cp_widget(app_obj);
		}
	 });
}

$('.tools_item').hover(function() {
//Hovering IN
	$(this).children('.tools_dropdown').stop().slideToggle('1');
	//The non-hovered tool items
	$('.tools_item').each(function() {$(this).find('.tool_option').css({fill:'#c3c6c9'})});
	$('.tools_item').each(function() {$(this).children('p').css({color:'#dee0e2'})})
	//the hovered tool items
	$(this).find('.tool_option').css({
		fill: 'black'
	});
	$(this).children('p').css({
		color: 'black'
	});
}, function() {
//Hovering OUT
	$(this).children('.tools_dropdown').stop().slideToggle('0');
	$('.tools_item').each(function() {$(this).find('.tool_option').css({fill : 'rgb(107, 119, 131)'})})
	$('.tools_item').each(function() {$(this).children('p').css({color : 'rgb(107, 119, 131)'})})
})

//Analytical Entry Form Creator
$('body').on('click', '.add_tr', function() {
	var prop_id = $(this).attr('data'),
		  name, unit;

	//get name and unit of property
	for(var i=0;i<app_obj.properties.length;i++) {
		if(app_obj.properties[i].property_id == prop_id) {
			name = app_obj.properties[i].name;
			unit = app_obj.properties[i].unit;
		}
	}

	var add_form = '<div class="add_tr_form">';
				add_form += '<h5 class="tr_property">'+name+'</h5>';
				add_form += '<table>';
					add_form += '<tr>';
						add_form += '<th>Date</th>';
						add_form += '<th>Time</th>';
						add_form += '<th>Result <span>('+unit+')</span></th>';
						add_form += '<th>Lab</th>';
					add_form += '</tr>';
					add_form += '<tr>';
						add_form += '<td class="tr_property"><input type="date" class="tr_date" /></td>';
						add_form += '<td><input type="time" class="tr_time" /></td>';
						add_form += '<td><input type="number" step="0.01" class="reading"/></td>';
						add_form += '<td><select class="lab_id">';

						for(var i=0;i<general_obj['labs'].length; i++) {
							var lab = general_obj['labs'][i]['lab_name'],
								  lab_id = general_obj['labs'][i]['lab_id'];
							add_form += '<option value="'+lab_id+'">'+lab+'</option>';
						}

						add_form += '</select></td>';
					add_form += '</tr>';
				add_form += '</table>';
				add_form += '<button data="'+prop_id+'" class="submit" onclick="add_tr(this)">Submit</button>';
			add_form += '</div>';

			displayOverlay(add_form);
});

//click out of overlay
window.onclick = function(event) {
	if( event.target == document.getElementById('overlay') ) {
		$('#overlay').empty().hide();
	}
};

function displayOverlay(content) {
	$('#overlay').css('display', 'flex');
	$('#overlay').append(content);
}
function add_tr(submit) {
	//validate
	//set variables
	var app_id = app_obj['app_id'],
		  prop_id = $(submit).attr('data'),
		  result = $(submit).siblings('table').find('.reading').val(),
		  date = $(submit).siblings('table').find('.tr_date').val(),
		  time = $(submit).siblings('table').find('.tr_time').val(),
		  lab_id = $(submit).siblings('table').find('.lab_id').val(),
		  ts = moment(date + " " + time, "YYYY/M/D H:mm").unix(),
		  obj = {"property_id" : prop_id, "result": result, "ts": ts, "lab_id": lab_id, "app_id": app_id};
	//Add to DB
		$.ajax({
		url:"add_tr_handler.php",
		method:"POST",
		dataType: 'json',
		data: obj,
		success: function(application_obj) {
			app_obj = application_obj;
			update_cp_widget(app_obj);
			$('#overlay').empty().hide();
		}
	   });
}
function update_cp_table(data) {
  //get all inputs
	var inputs = $(".holder").find("input"),
	    colName, inputVal, obj={};
	obj.changes = {};
	//assign values from each input
	jQuery.each(inputs, function(k,v) {
		//set n/a and empty string values to null
		if($(v).val() === "n/a" || $(v).val() === '') {
			inputVal = -1;
		} else {
			inputVal = $(v).val();
		}
		colName = $(v).attr("name");

		obj.changes[colName] = inputVal;
	})

	obj.conditions = {};
	obj.conditions = data.conditions;
	obj.table = data.table;

	$.ajax({
		url:"update_fns.php",
		method:"POST",
		dataType: 'json',
		data: obj,
		complete: function(response) {
			console.log(response);
		},
		success: function() {
			update_app_obj(app_obj.app_id);
			update_cp_widget(app_obj);
			$('#overlay').empty().hide();
		}
	 });
}

function formatRange(min,max) {
	//2 numbers
	if(!isNaN(min) && !isNaN(max)) {return '<span>'+min+'</span> - <span>'+ max+'</span>';}
	//na to na
	if(min === "n/a" && max === "n/a") {return '<span>n/a</span>';}
	//na to number
	if(min === 'n/a' && !isNaN(max)) {return '<span>< '+max+'</span>';}
	//number to na
	if(max === 'n/a' && !isNaN(min)) {return '<span>> '+min+'</span>';}
}

function update_cp_widget(app_obj) {
	 $('.application_param table').empty();

	var temp_opt = (app_obj['parameters']['temp']['optimum'] ===  null) ?  null_to_na(app_obj['parameters']['temp']['optimum']) : (Math.round(app_obj['parameters']['temp']['optimum'] * 1) / 1).toFixed(0),
		  temp_tmf_min = (app_obj['parameters']['temp']['tmf_min'] ===  null) ?  null_to_na(app_obj['parameters']['temp']['tmf_min']) : (Math.round(app_obj['parameters']['temp']['tmf_min'] * 1) / 1).toFixed(0),
		  temp_tmf_max = (app_obj['parameters']['temp']['tmf_max'] ===  null) ?  null_to_na(app_obj['parameters']['temp']['tmf_max']) : (Math.round(app_obj['parameters']['temp']['tmf_max'] * 1) / 1).toFixed(0),
		  temp_tds_min = (app_obj['parameters']['temp']['tds_min'] ===  null) ?  null_to_na(app_obj['parameters']['temp']['tds_min']) : (Math.round(app_obj['parameters']['temp']['tds_min'] * 1) / 1).toFixed(0),
		  temp_tds_max = (app_obj['parameters']['temp']['tds_max'] ===  null) ?  null_to_na(app_obj['parameters']['temp']['tds_max']) : (Math.round(app_obj['parameters']['temp']['tds_max'] * 1) / 1).toFixed(0),
		  pH_opt = (typeof app_obj['parameters']['pH']['optimum'] === "number") ? (Math.round(app_obj['parameters']['pH']['optimum'] * 10) / 10).toFixed(1) : null_to_na(app_obj['parameters']['pH']['optimum']),
			pH_tmf_min = (typeof app_obj['parameters']['pH']['tmf_min'] === "number") ? (Math.round(app_obj['parameters']['pH']['tmf_min'] * 10) / 10).toFixed(1) : null_to_na(app_obj['parameters']['pH']['tmf_min']),
			pH_tmf_max = (typeof app_obj['parameters']['pH']['tmf_max'] === "number") ? (Math.round(app_obj['parameters']['pH']['tmf_max'] * 10) / 10).toFixed(1) : null_to_na(app_obj['parameters']['pH']['tmf_max']),
			pH_tds_min = (typeof app_obj['parameters']['pH']['tds_min'] === "number") ? (Math.round(app_obj['parameters']['pH']['tds_min'] * 10) / 10).toFixed(1) : null_to_na(app_obj['parameters']['pH']['tds_min']),
			pH_tds_max = (typeof app_obj['parameters']['pH']['tds_max'] === "number") ? (Math.round(app_obj['parameters']['pH']['tds_max'] * 10) / 10).toFixed(1) : null_to_na(app_obj['parameters']['pH']['tds_max']);


	//create tr with column headings
	var col_headings_tr = $("<tr>", {
		html: '<th></th><th>Latest</th><th>Optimum</th><th>TMF Range</th><th>TDS Range</th>'
	});

	$('.application_param table').append(col_headings_tr);


	//create element for temp tr
	var temp_tr = $("<tr>");

	//temp title
	var temp_title = $("<td>", {
		class: 'row_header',
		text: "Temperature (°F)"
	})

	//temp latest
	var latest_temp = $('<td>', {
		class: "latest_temp first_col",
		html: '<span>160</span>',
	});

	//temp opt
  var temp_opt = $('<td>', {
		text: temp_opt,
		data: {
			column_name: "Change Optimum",
			table: "applications",
			changes: {
				tmfc_temp_optimum :{
					label: 'Optimum',
					number: temp_opt
				}
			},
			conditions: {
				application_id: app_obj["app_id"]
			}
		}
	});

	//temp tmf_range
  var tmf_temp_range = $('<td>', {
		html: formatRange(temp_tmf_min, temp_tmf_max),
		data: {
			column_name: "Change TMF ",
			table: "applications",
			changes: {
				tmfc_temp_min :{
					label: 'TMF Minimum',
					number: temp_tmf_min
				},
				tmfc_temp_max :{
					label: 'TMF Maximum',
					number: temp_tmf_max
				}
			},
			conditions: {
				application_id: app_obj["app_id"]
			}
		}
	});

	//temp tds_range
  var tds_temp_range = $('<td>', {
		html: formatRange(temp_tds_min, temp_tds_max),
		data: {
			column_name: "Change TMF ",
			table: "applications",
			changes: {
				tds_temp_min :{
					label: 'TDS Minimum',
					number: temp_tds_min
				},
				tds_temp_max :{
					label: 'TDS Maximum',
					number: temp_tds_max
				}
			},
			conditions: {
				application_id: app_obj["app_id"]
			}
		}
	});

	temp_tr.append(temp_title, latest_temp, temp_opt, tmf_temp_range, tds_temp_range);

	$('.application_param table').append(temp_tr);


	//create element for pH tr
	var pH_tr = $("<tr>");

	//pH title
	var pH_title = $("<td>", {
		class: 'row_header',
		text: "pH"
	})

	//pH latest
	var latest_pH = $('<td>', {
		class: "latest_pH first_col",
		html: '<span>7.0</span>'
	});

	//pH opt
  var pH_opt = $('<td>', {
		text: pH_opt,
		data: {
			column_name: "Change pH",
			table: "applications",
			changes: {
				tmfc_pH_optimum :{
					label: 'Optimum',
					number: pH_opt
				}
			},
			conditions: {
				application_id: app_obj["app_id"]
			}
		}
	});

	//pH tmf_range
  var tmf_pH_range = $('<td>', {
		html: formatRange(pH_tmf_min, pH_tmf_max),
		data: {
			column_name: "Change TMF pH",
			table: "applications",
			changes: {
				tmfc_pH_min :{
					label: 'TMF Minimum',
					number: pH_tmf_min
				},
				tmfc_pH_max :{
					label: 'TMF Maximum',
					number: pH_tmf_max
				}
			},
			conditions: {
				application_id: app_obj["app_id"]
			}
		}
	});


	//pH tds_range
  var tds_pH_range = $('<td>', {
		html: formatRange(pH_tds_min, pH_tds_max),
		data: {
			column_name: "Change TMF ",
			table: "applications",
			changes: {
				tds_pH_min :{
					label: 'TDS Minimum',
					number: pH_tds_min
				},
				tds_pH_max :{
					label: 'TDS Maximum',
					number: pH_tds_max
				}
			},
			conditions: {
				application_id: app_obj["app_id"]
			}
		}
	});

	pH_tr.append(pH_title, latest_pH, pH_opt, tmf_pH_range, tds_pH_range);

	$('.application_param table').append(pH_tr);

	 //check if properties
	 if(app_obj['properties']) {
		 //iterate over properties array
		 for(var i=0; i < app_obj['properties'].length; i++) {
			//iterate over each key in properies obj
			for (var key in app_obj['properties'][i])  {
				//change null val to 'n/a'
				app_obj['properties'][i][key] = null_to_na(app_obj['properties'][i][key]);
			}
			//iterate over each key in properies obj
			for (var key in app_obj['properties'][i])  {
				//if val is a number
				if(!isNaN(app_obj['properties'][i][key])  ) {
					//round down
					app_obj['properties'][i][key] = Math.round(app_obj['properties'][i][key] * 100) / 100;
				}
			}

			var id = app_obj['properties'][i]['property_id'],
				  name = app_obj['properties'][i]['name'],
				  unit = app_obj['properties'][i]['unit'],
				  opt = app_obj['properties'][i]['tmf_optimum'],
				  tmf_min =  app_obj['properties'][i]['tmf_min'],
				  tmf_max =  app_obj['properties'][i]['tmf_max'],
				  tds_min =  app_obj['properties'][i]['tds_min'],
				  tds_max =  app_obj['properties'][i]['tds_max'],
				  latest_result = (app_obj['properties'][i]['test_results']) ? parseFloat(app_obj['properties'][i]['test_results'][0]['result']).toFixed(app_obj['properties'][i]['decimal_accuracy']) : "n/a";



			//PROPERTIES ROWS
			//create tr element
			var prop_tr = $('<tr>');

			//property title
			var add_btn = $('<span>', {
				class: 'add_tr',
				text: '+'
			});
			add_btn.attr("data", id);

			var prop_title = $('<td>', {
				text: name + ' (' + unit + ')',
				class: 'row_header',
			});
			prop_title.prepend(add_btn);

			//Latest result
			//conditional bg color if latest_result is within range
			var bgColor = '';
			if(latest_result >= tmf_min && latest_result <= tmf_max && latest_result !== "n/a") {
				bgColor = 'green_bg';
			} else if(parseFloat(latest_result) < tmf_min || parseFloat(latest_result) > tmf_max) {
				bgColor = 'red_bg';
			}

			var latest = $('<td>', {
				class: 'first_col',
				html: '<span class='+bgColor+'>'+latest_result+'</span>'
			});

			//Optimum
			var opt = $('<td>', {
				text: opt,
				data: {
					column_name: "Change Optimum",
					table: "controlled_properties",
					changes: {
						tmf_optimum :{
							label: 'Optimum',
							number: opt
						}
					},
					conditions: {
						application_id: app_obj["app_id"],
						property_id: id
					}
				}
			});

			//tmf range
			var tmf_range = $('<td>', {
				class: "tmf_range",
				html: formatRange(tmf_min, tmf_max),
				data: {
					column_name: "Change TMF Range",
					table: "controlled_properties",
					changes: {
						tmf_min: {
							label: 'Minimum',
							number: tmf_min
						},
						tmf_max: {
							label: 'Maximum',
							number: tmf_max
						},
					},
					conditions: {
						application_id: app_obj["app_id"],
						property_id: id
					}
				}
			});

			//tds range
			var tds_range = $('<td>', {
				class: "tds_range",
				html: formatRange(tds_min, tds_max),
				data: {
					column_name: "Change TDS Range",
					table: "controlled_properties",
					changes: {
						tds_min: {
							label: 'Minimum',
							number: tds_min
						},
						tds_max: {
							label: 'Maximum',
							number: tds_max
						},
					},
					conditions: {
						application_id: app_obj["app_id"],
						property_id: id
					}
				}
			});

			prop_tr.append(prop_title,latest, opt, tmf_range, tds_range);

			$('.application_param table').append(prop_tr);
		}
	} //end check for properties


}

//Event Listener - build parameter config form
$(document).on('click', '#cp_table td', function() {
	var data = $(this).data();
	//create holding element
	var formOutput = $("<div>", {
		class: "holder"
	});
	formOutput.css({
		background: "white",
		padding: "20px"
	})

	//create title and attach to formOutput
	var title = $('<h1>', {
		text: data['column_name']
	})
	formOutput.append(title);

	//build labels and inputs
	$.each(data["changes"], function(change,changeVal) {
  var label = $("<label>",  {
    text: data["changes"][change]["label"]
  });

  var input = $("<input>", {
    value: data["changes"][change]["number"],
		name: change
  });

	//attach label, input to formOutput
  formOutput.append(label, input);
})

//create submit btn element, attach to formOutput
var submitBtn = $("<button>", {
	text: "Submit",
	onclick: "update_cp_table($(this).data())",
	data: data
});
formOutput.append(submitBtn);

//display formOutput
displayOverlay(formOutput);
})

function get_apps(process_item) {

	var process = $(process_item).text();
	console.log(process);

	$('.applications_tab').stop().show();

	$('.application_list').empty();

	for(var key in process_obj[process]) {
		var an = process_obj[process][key]['application_name'];
		var tn = process_obj[process][key]['tank_number'][0];
		var id = process_obj[process][key]['app_id'];
		var list_item = '<li data-process="'+process+'" data="'+id+'" data-title-type="app" onclick="update_app_obj_given_element(this)"><span class="tank_num">'+tn+'</span> <span class="application">' + an + '</span></li>';

		$('.application_list').append(list_item);
	}

	$(function() {
		$('.application_list li').each(function(i, e) {
			$(this).delay( i * 30).animate({
				marginLeft: "0",
				"opacity" : 1
			});
		})
	})
}

//Shows hidden input field if <select> value = "new_input"
function showInput(sel) {
	var displayValue;
	if($(sel).val() == "new_input") {
			displayValue = 'inline';
		}	else {
			displayValue = 'none';
			$('input[data="'+ $(sel).attr('id') +'"]').val("");
		}
		$('input[data="'+ $(sel).attr('id') +'"], label[data="'+ $(sel).attr('id') +'"]').css('display', displayValue);
}
function upload_file_ajax(file, new_file_input, msgHolder) {
	var f = file.files[0];
	var form_data = new FormData();

	form_data.append('file', f);

	$.ajax({
		url:"file_upload_handler.php",
		method:"POST",
		data: form_data,
		contentType: false,
		cache: false,
		processData: false,
		dataType: 'json',
		beforeSend:function(){
		  new_file_input.html("<label class='text-success'>Image Uploading...</label>");
		},
		success:function(data)
		{
		msgHolder.html(data.message);
		new_file_input.val(data.new_file_name);
		console.log(new_file_input.val());
		}
	   });
}

//Add Process
var process_count = 1;
//on click
$('.addProcess').click(function(event) {
	event.preventDefault();

	//Assign Variables
	var lastSelProcessNameVal = $('select[name="selProcess[' + (process_count - 1) + ']"]').val().trim(),
		  lastInputProcessNameVal = $('input[name="inputProcess[' + (process_count - 1) + ']"]').val().trim(),
		  lastApplicationInitiationDateVal = $('input[name="application_initiation[' + (process_count - 1) + ']"]').val().trim(),
		  lastProcessInitiationDateVal = $('input[name="process_initiation[' + (process_count - 1) + ']"]').val().trim(),
		  selProcessNameFilled = (lastSelProcessNameVal !== "" && lastSelProcessNameVal !== "new_input") ? true : false,
		  inputProcessNameFilled = (lastInputProcessNameVal !== "") ? true : false,
		  lastAppDateFilled = (lastApplicationInitiationDateVal !== "") ? true : false,
		  lastProcessDateFilled = (lastProcessInitiationDateVal !== "") ? true : false,
		  lastProcessDateFilledIfNeeded = (selProcessNameFilled == !lastProcessDateFilled ) ? true : false,

		  selORinputFilled = (inputProcessNameFilled || selProcessNameFilled) ? true : false;

	//if process name and unit are not empty add property field
	if( selORinputFilled &&  lastAppDateFilled && lastProcessDateFilledIfNeeded) {
		//Add html for new property
		var html = '<div class="process_name_inputs">';
				html += '<label for="process_name-'+process_count+'"><span style="color:red">*</span>Process Name: </label>';
				html += '<select id="process_name-'+process_count+'" onchange="showInput(this)" name="selProcess['+process_count+']">';

					//Use info from existing option elements to make new ones
					$('#process_name-0 option').each(function() {
						var optionValue = $(this).val(),
							  optionText = $(this).text();
						html+= '<option value="' + optionValue + '">' + optionText + '</option>';
					})

				html += '</select>';
				html += '<input type="text" placeholder="New Process" data="process_name-'+process_count+'" name="inputProcess['+process_count+']" hidden />';

				html += '<label for="process_initiation-'+process_count+'" style="display:none;" data="process_name-'+process_count+'"><span style="color:red">*</span>Date of process initiation:</label>';
				html += '<input type="date" id="process_initiation-'+process_count+'" name="process_initiation['+process_count+']" data="process_name-'+process_count+'" hidden />';

				html += '<label for="application_initiation-'+process_count+'"><span style="color:red">*</span>Date of application initiation:</label>';
				html += '<input type="date" id="application_initiation-'+process_count+'" name="application_initiation['+process_count+']" required/>';
			html += '</div>';


		$('.process_name_section').append(html);
		process_count++;
	} else {
		console.log("something was not filled");
	}
});

//Add Line and Tank
var LT_count = 1;
//on click
$('.addLT').click(function(event) {
	event.preventDefault();

	//Assign Variables
	var lastSelLineNumberVal = $('select[name = "selLineNumber[' + (LT_count - 1) + ']"]').val().trim(),
		  lastInputLineNumberVal = $('input[name="inputLineNumber[' + (LT_count - 1) + ']"]').val().trim(),
		  lastSelTankNumberVal = $('select[name = "selTankNumber[' + (LT_count - 1) + ']"]').val().trim(),
		  lastInputTankNumberVal = $('input[name="inputTankNumber[' + (LT_count - 1) + ']"]').val().trim(),
		  lastTankInitiationVal = $('input[name="tank_initiation[' + (LT_count - 1) + ']"]').val().trim(),
		  selLineNumberFilled = (lastSelLineNumberVal !== "" && lastSelLineNumberVal !== "new_input") ? true : false,
		  inputLineNumberFilled = (lastInputLineNumberVal !== "") ? true : false,
		  selTankNumberFilled = (lastSelTankNumberVal !== "" && lastSelTankNumberVal !== "new_input") ? true : false,
		  inputTankNumberFilled = (lastInputTankNumberVal !== "") ? true : false,
		  lastTankInitiationDateFilled = (lastTankInitiationVal !== "") ? true : false,
		  LineSelORinputFilled = (selLineNumberFilled || inputLineNumberFilled) ? true : false,
		  TankSelORinputFilled = (selTankNumberFilled || inputTankNumberFilled) ? true : false;

	//if process name and unit are not empty add component field
	if( LineSelORinputFilled && TankSelORinputFilled && lastTankInitiationDateFilled) {
		//Add html for new component
		var html = '<div class="line_tank_inputs">';
		html += '<label for="line_number-'+LT_count+'">Line Number: </label>';
		html += '<select id="lineNumber-'+LT_count+'" name="selLineNumber['+LT_count+']"  onchange="showInput(this), setTankSelOpt(this)">';

		//Use info from existing option elements to make new ones
		$('#lineNumber-0 option').each(function() {
			var optionValue = $(this).val(),
				  optionText = $(this).text();
			html+= '<option value="' + optionValue + '">' + optionText + '</option>';
		})

		html += '</select>';
		html += '<input type="number" name="inputLineNumber['+LT_count+']" id="line_number-'+LT_count+'" data="lineNumber-'+LT_count+'" hidden />';

		html += '<span class="tankNumber_container">';
			html += '<label for="tank_number-'+LT_count+'">Tank Number: </label>';
			html += '<select id="tankNumber-'+LT_count+'" onchange="showInput(this)" name="selTankNumber['+LT_count+']">';
				html += '<option value="">Select</option>';
			html += '</select>';
			html += '<input type="number" name="inputTankNumber['+LT_count+']" data="tankNumber-'+LT_count+'" name="inputTankNumber['+LT_count+']" hidden />';
			html += '<label for="tank_initiation-'+LT_count+'">Date of tank association with tank: </label>';
			html += '<input type="date" name="tank_initiation['+LT_count+']" id="tank_initiation-'+LT_count+'"/>';
		html += '</span>';
		html += '</div>';


		$('.line_tank_section').append(html);
		LT_count++;
	} else {
		console.log("something was not filled");
	}
});

//Add Property
var property_count = 1;
//on click
$('.addProperty').click(function(event) {
	event.preventDefault();

	//Assign Variables
	var lastPropertyNameVal = $('input[name="property_name[' + (property_count - 1) + ']"]').val().trim(),
		  lastSelVal = $('select[name="selproperty_unit[' + (property_count - 1) + ']"]').val().trim(),
		  lastInputVal = $('input[name="inputproperty_unit[' + (property_count - 1) + ']"]').val().trim(),
		  propertyNameFilled = (lastPropertyNameVal !== "") ? true : false,
		  selValFilled = (lastSelVal !== "" && lastSelVal !== "new_input") ? true : false,
		  inputValFilled = (lastInputVal !== "") ? true : false,
		  selORinputFilled = (selValFilled || inputValFilled) ? true : false;

	//if property name and unit are not empty add property field
	if(propertyNameFilled && selORinputFilled) {
		//Add html for new property
		var html = '<div class="property_inputs">';
			html += '<label for="property_name">Property Name: </label><input type="text" name="property_name[' +property_count +']" id="property_name"><br />';
			html += '<label for="property_symbol">Property Symbol: </label><input type="text" name="property_symbol[' +property_count +']" id="property_symbol"><br />';

			html += '<label for="property_unit-'+ property_count +'">Property Unit: </label>';
			html += '<select id="property_unit-'+ property_count +'" onchange="showInput(this)"  name="selproperty_unit[' + property_count + ']">';

			//Use info from existing option elements to make new ones
			$('#property_unit-'+(property_count-1)+' option').each(function() {
				var optionValue = $(this).val(),
					  optionText = $(this).text();
				html+= '<option value="' + optionValue + '">' + optionText + '</option>';
			})

			if($('input[name="inputproperty_unit['+(property_count-1)+']"').val() != "") {
				html+= '<option value="' + $('input[name="inputproperty_unit['+(property_count-1)+']"]').val() + '">' + $('input[name="inputproperty_unit['+(property_count-1)+']"]').val() + '</option>';
			}

			html += '</select>';
			html += '<input type="text" name="inputproperty_unit[' + property_count + ']" data="property_unit-'+ property_count +'" hidden><br />';

			html += '<label for="decimal_accuracy-'+ property_count +'">Accurate to what decimal place: </label><input type="number" name="decimal_accuracy['+ property_count +']" id="decimal_accuracy-'+ property_count +'"/><br />';

			html += '<label for="test_procedure-'+ property_count +'">Analytical Procedure</label><input type="text" name="test_procedure_file['+ property_count +']" id="test_procedure-'+ property_count +'"/><br />';
			html += '<label for="tmf_optimum-'+ property_count +'">TMFC Optimum Level: </label><input type="number" name="tmf_optimum[' + property_count + ']" id="tmf_optimum-'+ property_count +'"  step="0.01"><br />';
			html += '<label for="tmf_min-'+ property_count +'">TMFC Minimum Level: </label><input type="number" name="tmf_min[' + property_count + ']" id="tmf_min-'+ property_count +'"  step="0.01"><br />';
			html += '<label for="tmf_max-'+ property_count +'">TMFC Maximum Level: </label><input type="number" name="tmf_max[' + property_count + ']" id="tmf_max-'+ property_count +'"  step="0.01"><br />';
			html += '<label for="tds_min-'+ property_count +'">TDS Minimum Level: </label><input type="number" name="tds_min[' + property_count + ']" id="tds_min-'+ property_count +'"  step="0.01"><br />';
			html += '<label for="tds_max-'+ property_count +'">TDS Maximum Level: </label><input type="number" name="tds_max[' + property_count + ']" id="tds_max-'+ property_count +'"  step="0.01"><br />';
		html += '</div>';
		$('.property_section').append(html);
		property_count++;
	} else {
		console.log("something was not filled");
	}
});

//Add Proprietary Chemical
var PC_count = 1;
//on click
$('.addProprietaryChemical').click(function(event) {
	event.preventDefault();

	//Assign Variables
	var lastPCName = $('input[name="proprietary_chemical_name['+ (PC_count - 1) +']"]').val().trim(),
		  lastPCVendorSel = $('select[name="selproprietary_chemical_vendor['+ (PC_count - 1) +']"]').val().trim(),
		  lastPCVendorInput = $('input[name="inputproprietary_chemical_vendor['+ (PC_count - 1) +']"]').val().trim(),
		  lastPCNameFilled = (lastPCName !== "") ? true : false,
		  lastPCVendorSelFilled = (lastPCVendorSel !== "" && lastPCVendorSel !== "new_input") ? true : false,
		  lastPCVendorInputFilled = (lastPCVendorInput !== "") ? true : false,
		  selORinputFilled = (lastPCVendorSelFilled || lastPCVendorInputFilled) ? true : false;

	if(lastPCNameFilled && selORinputFilled) {
		var html = '<div class="proprietary_chemical_inputs">';
				html +=	'<label for="proprietary_chemical_name-' + PC_count + '">Proprietary Chemical: </label><input type="text" name="proprietary_chemical_name[' + PC_count + ']" id="proprietary_chemical_name-' + PC_count + '" /><br />';

				html += '<label for="sds_file-' + PC_count + '">Safety Data Sheet: </label><input type="file" name="a_file[' + PC_count + ']" id="sds_file-' + PC_count + '"onchange="upload_file_ajax(this, $(\'#sds-' + PC_count + '\'), $(\'#sds-' + PC_count + '_msg\'))"/><span id="sds-' + PC_count + '_msg"></span><input type="text" id="sds-' + PC_count + '" name="sds[' + PC_count + ']" hidden /><br />';

				html +=	'<label for="proprietary_chemical_vendor-0">Vendor: </label>';
				html +=	'<select id="proprietary_chemical_vendor-' + PC_count + '" name="selproprietary_chemical_vendor[' + PC_count + ']"  onchange="showInput(this)">';

					//Use info from existing option elements to make new ones
					$('#proprietary_chemical_vendor-0 option').each(function() {
						var optionValue = $(this).val(),
							  optionText = $(this).text();
						html+= '<option value="' + optionValue + '">' + optionText + '</option>';
					})

				html +=	'</select>';
				html +=	'<input type="text" name="inputproprietary_chemical_vendor[' + PC_count + ']" data="proprietary_chemical_vendor-' + PC_count + '" hidden /><br />';

				html +=	'<label for="proprietary_chemical_makeup-' + PC_count + '">Proprietary Chemical Makeup Requirement Number: </label><input type="number" name="proprietary_chemical_makeup[' + PC_count + ']" id="proprietary_chemical_makeup-' + PC_count + '"  step="0.01" />';
				html +=	'<label for="proprietary_chemical_makeup_unit-' + PC_count + '">Unit: </label>';
				html +=	'<select id="proprietary_chemical_makeup_unit-' + PC_count + '" name="selproprietary_chemical_makeup_unit[' + PC_count + ']" onchange="showInput(this)">';

					//Use info from existing option elements to make new ones
					$('#proprietary_chemical_makeup_unit-0 option').each(function() {
						var optionValue = $(this).val(),
							  optionText = $(this).text();
						html+= '<option value="' + optionValue + '">' + optionText + '</option>';
					})

				html +=	'</select>';
				html +=	'<input type="text" name="inputproprietary_chemical_makeup_unit[' + PC_count + ']" data="proprietary_chemical_makeup_unit-' + PC_count + '" hidden/><br />';
			html +=	'</div>';
		$('.proprietary_chemical_section').append(html);
		PC_count++;
	} else {
		console.log("something not filled");
	}


});


//get tank numbers given a line number - ajax request
function setTankSelOpt(sel) {
	var selVal = $(sel).val(),
		  tankIdAttr = '#' +$(sel).siblings('.tankNumber_container').children('select[id^="tankNumber-"]').attr('id'),
		  option;
		  console.log(tankIdAttr);
	if(selVal == "") {
		$(tankIdAttr).empty();
		option += '<option value=""></option>';
		$('.tankNumber_container').css('display', 'none');
		$(tankIdAttr).append(option);
	} else {
		$.ajax({
			url: "get_tank_num_handler.php",
			method: 'POST',
			data: {data: selVal},
			dataType: 'json',
			complete: function(data) {
				console.log(data);
			},
			success: function(tankNumbers) {
				$(tankIdAttr).empty();
				for(var i = 0 ; i < tankNumbers.length; i++) {
					option += '<option value="'+ tankNumbers[i] +'">'+ tankNumbers[i] +'</option>';
				}
				option += '<option value="new_input">New Tank Number</option>';
				$(tankIdAttr).append(option);
				$('.tankNumber_container').css('display', 'inline');
				showInput($(tankIdAttr));
			}
		});
	}
}

//Event Listener for updating Dashboard Info Title
$(document).on('click', '.process_list_item, .application_list li' , function(e) {
	var type = $(this).attr("data-title-type");

	switch(type) {
		case "process":
				var process_name = $(this).text();
				updt_dshbrd_info_cont(process_name, {});
				break;
		case "app":
			  var app_name = $(this).find('.application').text();
				var process_name = $(this).attr('data-process');
				var tank_num = $(this).find('.tank_num').text();
				updt_dshbrd_info_cont(app_name, {
					"Process": process_name,
					"Tank Number": tank_num
				} );
				break;
		default:
				console.log("something else");
	}
})
//Application Selected List Item Styling
$(document).on('click','.application_list li', function(e) {
  $('.application_list li').removeClass('selected');
	$(e.currentTarget).addClass('selected');
})

//Process Selected List Item Styling
$(document).on('click','.process_list_item', function(e) {
  $('.process_list_item').removeClass('selected');
	$(e.currentTarget).addClass('selected');
})
//submitValidation
/* $("input[type='submit']").on('click', function(event) {
	var application_name = $('#application_name').val(),
		  initiation_date = $('initiation_date').val(),
		  selAppType = $('#applicationType').val(),
		  inputAppType = $('input[name="inputAppType"]').val(),
		  selProcName = $('#process').val(),
		  inputProcName = $('input[name="inputProcess"]').val();

	if(application_name == "" || selAppType == "" || inputAppType == "" || selProcName == "" ||  initiation_date == "") {
		event.preventDefault();
		$('body').append('<p style="background:red;color:white;">Please fill in fields highlighted red</p>');

		(application_name == "") ? $('label[for="application_name"]').css("color", "red") : false;
		(selAppType == "" || inputAppType == "") ? $('label[for="application_type"]').css("color", "red") : false;
		(selProcName == "") ? $('label[for="process_name"]').css("color", "red") : false;
		(initiation_date == "") ? $('label[for="initiation_date"]').css("color", "red") : false;
	}
}); */
