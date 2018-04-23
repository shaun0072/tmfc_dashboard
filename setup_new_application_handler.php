<?php
include('db_fns.php');
include('form_helper_fns.php');


//Check if request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {


	//Remove whitespaces and set empty input values to NULL
	array_walk_recursive($_POST, function(&$v){
		$v=trim($v);
		if(empty($v)) {
			$v = NULL;
		}
	});



	//Connect to tmfc_db
	$conn = connect_to_db();



	//SET VARIABLES
	$last_app_id;
	$auto_increment= "";
	$user = 'Shaun';


	//Application Variables
	$application_name = $_POST['application_name'];
	$application_type = decideInput($_POST['selAppType'], $_POST['inputAppType']);
	$tds = $_POST['tds'];
	$tmfc_temp_optimum = $_POST['tmfc_temp_optimum'];
	$tmfc_temp_min = $_POST['tmfc_temp_min'];
	$tmfc_temp_max = $_POST['tmfc_temp_max'];
	$tds_temp_min = $_POST['tds_temp_min'];
	$tds_temp_max = $_POST['tds_temp_max'];
	$agitation = decideInput($_POST['selAgitation'], $_POST['inputAgitation']);
	$tmfc_pH_optimum = $_POST['tmfc_pH_optimum'];
	$tmfc_pH_min = $_POST['tmfc_pH_min'];
	$tmfc_pH_max = $_POST['tmfc_pH_max'];
	$tds_pH_min = $_POST['tds_pH_min'];
	$tds_pH_max = $_POST['tds_pH_max'];

	//Process Name Variables
	$sel_process_names = $_POST['selProcess'];
	$input_process_names = $_POST['inputProcess'];
	$process_initiations = $_POST['process_initiation'];

	//Process Association Variables
	$app_to_process_initiations = $_POST['application_initiation'];

	//Line Number Variables
	$sel_line_numbers = $_POST['selLineNumber'];
	$input_line_numbers = $_POST['inputLineNumber'];

	//Tank Number and Tank Association Variables
	$sel_tank_numbers = $_POST['selTankNumber'];
	$input_tank_numbers = $_POST['inputTankNumber'];
	$tank_association_initiations = $_POST['tank_initiation'];
	$tank_removal = NULL;





	//Prepare stmts
	/* Prepared statement, stage 1: prepare */
	if (!($applications_stmt = $conn->prepare("
		INSERT INTO applications(
			application_id,
			application_name,
			application_type,
			tds,
			tmfc_temp_optimum,
			tmfc_temp_min,
			tmfc_temp_max,
			tds_temp_min,
			tds_temp_max,
			agitation,
			tmfc_pH_optimum,
			tmfc_pH_min,
			tmfc_pH_max,
			tds_pH_min,
			tds_pH_max,
			username
		)
		VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"))) {
	    echo "Prepare failed: (" . $conn->errno . ") " . $conn->error;
	}
	$process_stmt = $conn->prepare('INSERT INTO processes VALUES(?,?,?,?,?)');
	$process_association_stmt = $conn->prepare('INSERT INTO process_association VALUES(?,?,?,?,?,?)');
	$tank_entry_stmt = $conn->prepare('INSERT INTO tanks(tank_id, tank_number, counter_flow) VALUES(?,?,?)');
	$tank_association_stmt = $conn->prepare('INSERT INTO tank_association VALUES(?,?,?,?,?)');
	$line_numbers_stmt = $conn->prepare('INSERT INTO line_numbers VALUES(?,?,?,?)');
	$properties_stmt = $conn->prepare("
		INSERT INTO controlled_properties(
				property_id,
				application_id,
				property_name,
				property_symbol,
				property_unit,
				decimal_accuracy,
				procedure_id,
				tmf_optimum,
				tmf_min,
				tmf_max,
				tds_min,
				tds_max,
				username
			)
			VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");
	$procedure_stmt = $conn->prepare("INSERT INTO test_procedures VALUES (?,?,?)");
	if(!($PC_stmt = $conn->prepare("
		INSERT INTO proprietary_chemicals(
			proprietary_chemical_id,
			application_id,
			chemical_name,
			vendor,
			sds,
			makeup_requirement,
			makeup_unit,
			username
			) VALUES (?,?,?,?,?,?,?,?)"))) {
		echo "Prepare failed: (" . $conn->errno . ") " . $conn->error;
	}







	//BIND AND EXECUTE
	//bind application table statements
	$applications_stmt->bind_param('ssssiiiiisiiiiis', $auto_increment, $application_name, $application_type, $tds, $tmfc_temp_optimum, $tmfc_temp_min, $tmfc_temp_max, $tds_temp_min, $tds_temp_max, $agitation, $tmfc_pH_optimum, $tmfc_pH_min, $tmfc_pH_max, $tds_pH_min, $tds_pH_max, $user);

	//execute applications table
	$applications_execute = $applications_stmt->execute();
	if(!$applications_execute) {
		echo  htmlspecialchars($applications_stmt->error);
		exit;
	} else {
		echo 'Applications was entered' . "<br />";
	  }

	//set variable for auto-generated application_id from applications table
	$last_app_id = $conn->insert_id;	//this gets the last number generated in the auto_increment column of the last query. It is useful for subsequent queries that require the generated (auto_incremented) number from the previous insert. It only works after the execute() statement in a prepared statement




	//Bind data for process_association table
	//check that process_name input is NOT NULL
	if(isset($sel_process_names[0])) {


		//cycle through each element of sel_process_names array
		for($x = 0; $x < count($sel_process_names) ; $x++) {

			//assign input values to variables
			$process_id; $last_process_id;
			$sel_process_name = $sel_process_names[$x];
			$new_process_name = $input_process_names[$x];
			$process_name = decideInput($sel_process_name, $new_process_name);
			$application_initiation = strtotime($app_to_process_initiations[$x]);
			$process_initiation = strtotime($_POST['process_initiation'][$x]);
			$removal_date = NULL;


			//if process exits, get/store process_id
			if( $sel_process_name !== "new_input" && isset($sel_process_name) ) $process_id = get_process_id($process_name);

			//if process does NOT exist - create new one in processes table and get/store process_id
			if(isset($new_process_name) && !empty($new_process_name)) {
				$process_stmt->bind_param('ssiis', $auto_increment, $process_name, $process_initiation, $removal_date, $user);
				$result = $process_stmt->execute();
				//error check
				if(!$result) {
						echo htmlspecialchars($process_stmt->error);
						echo "Problem with Process entry";
						exit;
				} else {
						echo 'New Process was entered' . "<br />";
				  }

				$process_id = $conn->insert_id;
			}


			//bind, execute for process_association table
			$process_association_stmt->bind_param('siiiis', $auto_increment, $process_id, $last_app_id, $application_initiation, $removal_date, $user);
			$execute = $process_association_stmt->execute();

			if(!$execute) {
					echo htmlspecialchars($process_association_stmt->error);
					echo "Problem with process_association entry";
					exit;
			} else {
					echo 'Process_association was entered' . "<br />";
			  }
		}
	}




	//Check that there are values in line_numbers
	if($sel_line_numbers[0]) {

		//If there are values, cycle through each
		for($x = 0; $x < count($sel_line_numbers); $x++) {
			//assign variables
			$sel_line_number = $sel_line_numbers[$x];
			$input_line_number = $input_line_numbers[$x];
			$line_number = decideInput($sel_line_number, $input_line_number);
			$sel_tank_number = $sel_tank_numbers[$x];
			$input_tank_number = $input_tank_numbers[$x];
			$tank_number = decideInput($sel_tank_number, $input_tank_number);
			$tank_initiation_date = strtotime($tank_association_initiations[$x]);
			$counter_flow = 0;


			//Check if tank number exists in tanks table
			$tank_sql = 'SELECT tank_id FROM tanks WHERE tank_number ="' . $tank_number . '"';
			$tank_check_result = $conn->query($tank_sql);

			//if so, get tank_id
			if($tank_check_result->num_rows > 0)
			{
				while($row = $tank_check_result->fetch_row()) {
					$tank_id = $row[0];
				}
			}


			//if not, insert tank entry into tanks table, get tank_id
			else
			{
				$tank_entry_stmt->bind_param('sii', $auto_increment, $tank_number, $counter_flow);
				$tank_result = $tank_entry_stmt->execute();
				$tank_id = $conn->insert_id;
				if(!$tank_result) {
					echo htmlspecialchars($tank_entry_stmt->error);
					echo 'Problem with tanks entry';
					exit;
				} else {
					echo "Tank entry was made" . "<br />";
				}
			}


			//insert record of line_number with tank_id
			$line_numbers_stmt->bind_param('siis', $auto_increment, $line_number, $tank_id, $user);
			$line_numbers_result = $line_numbers_stmt->execute();
			if(!$line_numbers_result) {
				echo "Problem with entry into line_numbers";
				exit;
			} else {
				echo "Line Number entry with tank_id was made" . "<br />";
			}

			//bind neccesary values to tank_association table and execute
			$tank_association_stmt->bind_param('siiii', $auto_increment, $tank_id, $last_app_id, $tank_initiation_date, $removal_date);
			$tank_assoc_result = $tank_association_stmt->execute();
			if(!$tank_assoc_result) {
				echo "Problem with tank_association entry";
				exit;
			} else {
				echo "Tank Association was entered" . "<br />";
			}
		}
	}



	//bind execute each property to controlled_properties table
	//check that properties array has values
	if(isset($_POST['property_name'][0])) {
		for($x = 0; $x < count($_POST['property_name']); $x++) {

			$procedure_file_name = $_POST['test_procedure_file'][$x];
			$procedure_stmt->bind_param('sss', $auto_increment, $procedure_file_name, $user);
			$procedure_execute = $procedure_stmt->execute();
			if(!$procedure_execute) {
					echo htmlspecialchars($procedure_stmt->error);
					exit;
			} else {
					echo 'Test Procedure was entered' . "<br />";
			  }
			$property_procedure_id = $conn->insert_id;

			$property_name = $_POST['property_name'][$x];
			$property_symbol = $_POST['property_symbol'][$x];
			$property_unit = decideInput($_POST['selproperty_unit'][$x], $_POST['inputproperty_unit'][$x]);
			$decimal_accuracy = $_POST['decimal_accuracy'][$x];
			$tmf_optimum = $_POST['tmf_optimum'][$x];
			$tmf_min = $_POST['tmf_min'][$x];
			$tmf_max = $_POST['tmf_max'][$x];
			$tds_min = $_POST['tds_min'][$x];
			$tds_max = $_POST['tds_max'][$x];

			//bind
			$properties_stmt->bind_param('sisssiiddddds', $auto_increment, $last_app_id, $property_name, $property_symbol, $property_unit, $decimal_accuracy, $property_procedure_id, $tmf_optimum, $tmf_min, $tmf_max, $tds_min, $tds_max, $user);
			$execute = $properties_stmt->execute();
			if(!$execute) {
					echo htmlspecialchars($properties_stmt->error);
					exit;
			} else {
					echo 'Property was entered' . "<br />";
			  }
		}
	}

	//bind and execute each proprietary chemical to proprietary_chemical table
	//check that proprietary chemical array has values
	if(isset($_POST['proprietary_chemical_name'][0])) {
		for($x = 0; $x < count($_POST['proprietary_chemical_name']); $x++) {
			$proprietary_chemical_name = $_POST['proprietary_chemical_name'][$x];
			$proprietary_sds = $_POST['sds'][$x];
			$proprietary_chemical_vendor = decideInput($_POST['selproprietary_chemical_vendor'][$x], $_POST['inputproprietary_chemical_vendor'][$x]);
			$proprietary_chemical_makeup = $_POST['proprietary_chemical_makeup'][$x];
			$proprietary_chemical_makeup_unit = decideInput($_POST['selproprietary_chemical_makeup_unit'][$x], $_POST['inputproprietary_chemical_makeup_unit'][$x]);

			//bind
			$PC_stmt->bind_param('sisssdss', $auto_increment, $last_app_id, $proprietary_chemical_name, $proprietary_chemical_vendor, $proprietary_sds, $proprietary_chemical_makeup, $proprietary_chemical_makeup_unit, $user);
			$execute = $PC_stmt->execute();

			if(!$execute) {
					echo htmlspecialchars($properties_stmt->error);
					exit;
			} else {
					echo 'Proprietary Chemicals was entered' . "<br />";
			  }
		}
	}


}
?>
