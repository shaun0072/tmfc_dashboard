<?php
//DB CONNECT INITIATION AND USAGE OF DATABASE BOTH GETTING AND POSTING DATA

//Returns mysqli object OR error message
function connect_to_db() {
	//Store mysqli() method result in variable
	$mysqli = new mysqli('localhost', 'root', 'happyday', 'tmfc_db');

	//Handle errors from db connection OR return mysqli object
	if(!$mysqli)
	{
		throw new Exception('Could not connect to database');
	}
	else
	{
		return $mysqli;
	}
}

//BOTH POST AND GET DATA TO AND FROM DATABASE

//POST DATA TO DATABASE ONLY



//GET DATA FROM DATABASE ONLY

//Returns array of distinct column values given the column name and table name
function get_table_list($column, $table) {
	//Connect to tmfc_db and store result in variable
	$conn = connect_to_db();

	//Get a list of all process names
	//create/execute query and assign results to variable
	$result = $conn->query('SELECT DISTINCT ' . $column . ' FROM ' . $table);
	//Throw error message if no results returned
	if(!$result) {
		throw new Exception('There was a problem getting process names');
	}
	//Iterate over results and assign each value into an array
	//declare array variable
	$table_list_array = array();
	//check if there was any results
	if($result->num_rows>0) {
		//cycle over results and assign values to $applicationTypes_array
		while($row = $result->fetch_row()) {
			$table_list_array[] = $row[0];
		}
	}
	return $table_list_array;
}


//Returns array of application_id's OR Exception message from applications table given a process name
function get_applications_from_process($process_name) {
	$name = 'Alkaline Zinc-Rack';
	//Connect to tmfc_db and store result in variable
	$conn = connect_to_db();

	//Get a list of all process names
	//create/execute query and assign results to variable
	$result = $conn->query('SELECT application_type FROM applications WHERE application_id IN (SELECT application_id FROM process_association WHERE process_id IN (SELECT process_id FROM processes WHERE process_name ="'.$process_name.'"))');
	//Throw error message if no results returned
	if(!$result) {
		throw new Exception('There was a problem getting application names');
	}

	$applicationNames_array = array();
	//check if there was any results
	if($result->num_rows>0) {
		//cycle over results and assign values to $processNames_array
		while($row = $result->fetch_row()) {
			$applicationNames_array[] = $row[0];
		}
	}

	return $applicationNames_array;
}

function get_tank_num_from_process($process_name) {
	//Connect to tmfc_db and store result in variable
	$conn = connect_to_db();

	//Get a list of all process names
	//create/execute query and assign results to variable
	$result = $conn->query('SELECT application_type FROM applications WHERE application_id IN (SELECT application_id FROM process_association WHERE process_id IN (SELECT process_id FROM processes WHERE process_name ="'.$process_name.'"))');
	//Throw error message if no results returned
	if(!$result) {
		throw new Exception('There was a problem getting application names');
	}

	$applicationNames_array = array();
	//check if there was any results
	if($result->num_rows>0) {
		//cycle over results and assign values to $processNames_array
		while($row = $result->fetch_row()) {
			$applicationNames_array[] = $row[0];
		}
	}

	return $applicationNames_array;
}

//Returns list of tank numbers given a line number
function get_tank_numbers($lineNumber) {
	$conn = connect_to_db();

	$result = $conn->query('SELECT tank_number FROM tanks WHERE tank_id IN (SELECT tank_id FROM line_numbers WHERE line_number="' . $lineNumber . '")');

	if(!$result) {
		throw new Exception('There was a problem getting application names');
	}

	$tankNumbers = array();

	if($result->num_rows>0) {
		//cycle over results and assign values to $processNames_array
		while($row = $result->fetch_row()) {
			$tankNumbers[] = $row[0];
		}
	}

	return $tankNumbers;
}


//Returns process_id given process name
function get_process_id($process_name='') {
	$conn = connect_to_db();

	$result= $conn->query('SELECT process_id FROM processes WHERE process_name ="'.$process_name.'"');
	$return =  $result->fetch_row();
	return $return[0];
}

?>
