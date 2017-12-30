var proc_app_obj = {
	"Alkaline Zinc-Rack" : [
		["Cleaner", [1701]], 
		["Electro-Cleaner", [1702]],
		["Rinse", [1703]], 
		["Acid Pickle", [1704]], 
		["Rinse", [1705]],
		["Plating Tank", [1706]],
		["Plating Tank", [1707]],
		["Rinse", [1708]],
		["Sour Dip", [1709]],
		["Rinse", [1710]],
		["Tri-Clear Chromate", [1711]],
		["Rinse", [1712]],
		["Tri-Yellow Chromate", [1713]],
		["Rinse", [1714]],
		["Hot Rinse - Clear", [1715]],
		["Hot Rinse - Yellow", [1716]]
	],
	"Chloride Zinc-Barrel" : [
		["Cleaner", [1301]], 
		["Electro-Cleaner", [1302]],
		["Rinse", [1303]], 
		["Acid Pickle", [1304]], 
		["Rinse", [1305]],
		["Plating Tank", [1307]],
		["Sour Dip", [1309]],
		["Tri-Clear Chromate", [1310]],
		["Rinse", [1311]],
		["Tri-Yellow Chromate", [1312]],
		["Rinse", [1313]],
		["Tri-Clear Seal", [1314]],
		["Tri-Yellow Seal", [1315]]
	]
};

$('.tools_item').hover(function() {
	$(this).children('.tools_dropdown').stop().slideToggle();
	console.log('test');
}, function() {
	$(this).children('.tools_dropdown').stop().slideToggle();
})

function left_bar(obj) {
	for(var key in obj) {
		if(obj.hasOwnProperty(key)) {
			var list_item = '<li onclick="get_apps(this)">' + key +'</li>' ;
			$('.nav_cntr .process_list').append(list_item);
		}
	}
	
}
left_bar(proc_app_obj);

function get_apps(process_item) {
	
	$('.application_list').empty();
	var process = $(process_item).text();
	for(var key in proc_app_obj) {
		if( key == process) {
			for(var i =0 ; i < proc_app_obj[key].length; i++) {
				var list_item = '<li><span class="tank_num">' + proc_app_obj[key][i][1][0] + '</span> <span class="application">' + proc_app_obj[key][i][0] + '</span></li>';
				$('.application_list').append(list_item);
			}
		}
	}
	
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
		  
	//if process name and unit are not empty add component field
	if( selORinputFilled &&  lastAppDateFilled && lastProcessDateFilledIfNeeded) {
		//Add html for new component
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

//Add Component
var component_count = 1; 
//on click
$('.addComponent').click(function(event) {
	event.preventDefault();
	
	//Assign Variables
	var lastComponentNameVal = $('input[name="component_name[' + (component_count - 1) + ']"]').val().trim(),
		  lastSelVal = $('select[name="selcomponent_unit[' + (component_count - 1) + ']"]').val().trim(),
		  lastInputVal = $('input[name="inputcomponent_unit[' + (component_count - 1) + ']"]').val().trim(),
		  componentNameFilled = (lastComponentNameVal !== "") ? true : false,
		  selValFilled = (lastSelVal !== "" && lastSelVal !== "new_input") ? true : false,
		  inputValFilled = (lastInputVal !== "") ? true : false,
		  selORinputFilled = (selValFilled || inputValFilled) ? true : false;
		  
	//if component name and unit are not empty add component field
	if(componentNameFilled && selORinputFilled) {
		//Add html for new component
		var html = '<div class="componenet_inputs">';	
			html += '<label for="component_name">Component Name: </label><input type="text" name="component_name[' +component_count +']" id="component_name"><br />';
			
			html += '<label for="component_unit-'+ component_count +'">Component Unit: </label>';
			html += '<select id="component_unit-'+ component_count +'" onchange="showInput(this)"  name="selcomponent_unit[' + component_count + ']">';
			
			//Use info from existing option elements to make new ones
			$('#component_unit-0 option').each(function() {		
				var optionValue = $(this).val(),
					  optionText = $(this).text();					  
				html+= '<option value="' + optionValue + '">' + optionText + '</option>';
			})
	
			html += '</select>';
			html += '<input type="text" name="inputcomponent_unit[' + component_count + ']" data="component_unit-'+ component_count +'" hidden><br />';

			html += '<label for="tmfc_concentration_optimum-'+ component_count +'">TMFC Optimum Concentration: </label><input type="number" name="tmfc_concentration_optimum[' + component_count + ']" id="tmfc_concentration_optimum-'+ component_count +'"><br />';
			html += '<label for="tmfc_concentration_min-'+ component_count +'">TMFC Minimum Concentration: </label><input type="number" name="tmfc_concentration_min[' + component_count + ']" id="tmfc_concentration_min-'+ component_count +'"><br />';
			html += '<label for="tmfc_concentration_max-'+ component_count +'">TMFC Maximum Concentration: </label><input type="number" name="tmfc_concentration_max[' + component_count + ']" id="tmfc_concentration_max-'+ component_count +'"><br />';
			html += '<label for="tds_concentration_min-'+ component_count +'">TDS Minimum Concentration: </label><input type="number" name="tds_concentration_min[' + component_count + ']" id="tds_concentration_min-'+ component_count +'"><br />';
			html += '<label for="tds_concentration_max-'+ component_count +'">TDS Maximum Concentration: </label><input type="number" name="tds_concentration_max[' + component_count + ']" id="tds_concentration_max-'+ component_count +'"><br />';
		html += '</div>';
		$('.component_section').append(html);
		component_count++;
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
				
				html +=	'<label for="proprietary_chemical_makeup-' + PC_count + '">Proprietary Chemical Makeup Requirement Number: </label><input type="number" name="proprietary_chemical_makeup[' + PC_count + ']" id="proprietary_chemical_makeup-' + PC_count + '" />';
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



//# sourceMappingURL=app.js.map
