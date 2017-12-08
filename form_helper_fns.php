<?php
//USED TO HELP BUILD FORMS - NO DATABASE CONNECTION REQUIRED


//Returns html string of<option> elements whose values are populated with each value in the array given
function to_option_tags($list_array) {
	//Delcare variable to hold html string
	$options_html = "";
	//Cycle through array and assign values to option element
	for($x = 0; $x < count($list_array); $x++) {
		if($list_array[$x] !== NULL) {
			$options_html .= "<option value='" . $list_array[$x] ."'>" . $list_array[$x] . "</option>";
		}	
	}
	return $options_html;
}


//Returns input value or seleted value
function decideInput($selectValue, $inputValue) {
	$finalValue;
	if( $selectValue == "new_input") {
		$finalValue = $inputValue;
	} else {
		$finalValue = $selectValue;
	}
	return $finalValue;
}
?>