<?php
include('db_fns.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {

	//Connect to tmfc_db
	$conn = connect_to_db();

	//set variables
	$a_id = $_POST['app_id'];
	$tr_id = '';
	$property_id = $_POST['property_id'];
	$lab_id = $_POST['lab_id'];
	$ts = $_POST['ts'];
	$result = $_POST['result'];
	$user = 'Shaun';


	//prepare statements
	$stmt = $conn->prepare("INSERT INTO test_results VALUES (?,?,?,?,?,?)");

	//bind
	$stmt->bind_param('siiids', $tr_id, $property_id, $ts, $lab_id, $result, $user);
	$execute = $stmt->execute();
	if(!$execute) {
		echo htmlspecialchars($stmt->error);
		exit;
	} else {
		//Application INFO
		$result = $conn->query('SELECT * FROM applications WHERE application_id ='.$a_id);


		if(!$result) {
			echo "Problem with applications selection";
			exit;
		}

		if($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				$app_obj['app_id'] = $row['application_id'];
				$app_obj['name'] = $row['application_name'];
				$app_obj['type'] = $row['application_type'];
				$app_obj['tds'] = $row['tds'];
				$app_obj['parameters']['temp']['optimum'] = $row['tmfc_temp_optimum'];
				$app_obj['parameters']['temp']['tmf_min'] = $row['tmfc_temp_min'];
				$app_obj['parameters']['temp']['tmf_max'] = $row['tmfc_temp_max'];
				$app_obj['parameters']['temp']['tds_min'] = $row['tds_temp_min'];
				$app_obj['parameters']['temp']['tds_max'] = $row['tds_temp_max'];
				$app_obj['parameters']['pH']['optimum'] = $row['tmfc_pH_optimum'];
				$app_obj['parameters']['pH']['tmf_min'] = $row['tmfc_pH_min'];
				$app_obj['parameters']['pH']['tmf_max'] = $row['tmfc_pH_max'];
				$app_obj['parameters']['pH']['tds_min'] = $row['tds_pH_min'];
				$app_obj['parameters']['pH']['tds_max'] = $row['tds_pH_max'];
				$app_obj['parameters']['agitation'] = $row['agitation'];
			}

		}

		//Process_association INFO
		$result = $conn->query('SELECT processes.process_id, process_name, process_association.initiation_date, process_association.removal_date FROM processes, process_association WHERE process_association.application_id ='.$a_id.' AND processes.process_id = process_association.process_id');


		if(!$result) {
			echo "Problem with process_association selection";
			exit;
		}

		if($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				$app_obj['proc_assoc'][] = ["id"=>$row['process_id'], "name"=>$row['process_name'], "initiation"=>$row['initiation_date'], "removal"=>$row['removal_date']];
			}

		}

		//Tank INFO
		$result = $conn->query('SELECT tank_association.tank_id, tanks.tank_number, tank_association.initiation_date, tank_association.removal_date FROM tanks, tank_association WHERE application_id ='.$a_id.' AND tank_association.tank_id = tanks.tank_id');


		if(!$result) {
			echo "Problem with tank_association selection";
			exit;
		}

		if($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				$app_obj['tank_assoc'][] = ["id"=>$row['tank_id'], "name"=>$row['tank_number'], "initiation"=>$row['initiation_date'], "removal"=>$row['removal_date']];
			}

		}


		//Properties INFO
		$result = $conn->query('
			SELECT property_id, property_name, property_symbol, property_unit, decimal_accuracy, tmf_optimum, tmf_min, tmf_max, tds_min, tds_max
			FROM controlled_properties
			WHERE application_id ='.$a_id
		);


		if(!$result) {
			echo "Problem with getting controlled_properties";
			exit;
		}

		if($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				$app_obj['properties'][] = [
					"property_id"=>$row['property_id'],
					"name"=>$row['property_name'],
					"symbol"=>$row['property_symbol'],
					"unit"=>$row['property_unit'],
					"decimal_accuracy"=>$row['decimal_accuracy'],
					"tmf_optimum"=>$row['tmf_optimum'],
					"tmf_min"=>$row['tmf_min'],
					"tmf_max"=>$row['tmf_max'],
					"tds_min"=>$row['tds_min'],
					"tds_max"=>$row['tds_max'],
				];
			}

		}


		//Test_results INFO
		$result = $conn->query("
			SELECT controlled_properties.property_id, test_result_id, test_result_number, labs.lab_id, lab_name, test_procedures.test_procedure_id, test_result_dt
			FROM test_results, controlled_properties, test_procedures, labs
			WHERE application_id=".$a_id."
			AND controlled_properties.property_id = test_results.property_id
			AND test_results.lab_id = labs.lab_id
			AND test_procedures.test_procedure_id = controlled_properties.procedure_id
			ORDER BY test_result_dt DESC"
		);


		if(!$result) {
			echo "Problem with getting test_results";
			exit;
		}

		if($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				for($x=0;$x<count($app_obj['properties']);$x++) {
					if($app_obj['properties'][$x]['property_id'] == $row['property_id']) {
						$app_obj['properties'][$x]['test_results'][] =
						[
							"test_result_id" =>$row['test_result_id'],
						  "result" =>$row['test_result_number'],
						  "procedure_id" =>$row['test_procedure_id'],
						  "lab" =>$row['lab_name'],
							"lab_id" =>$row['lab_id'],
					  	"test_date"=>$row['test_result_dt']
					 ];
					}
				}
			}

		}


		echo json_encode($app_obj);
	}
}

?>
