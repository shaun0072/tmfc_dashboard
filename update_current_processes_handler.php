<?php 
	include('db_fns.php');

	$conn = connect_to_db();
	//error
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	} 
	
	$proc_obj = array();
	
	$sql = "SELECT applications.application_id, processes.process_name, applications.application_type, tanks.tank_number 
				FROM processes, process_association, tanks, tank_association, applications
				WHERE 
				processes.removal_date IS NULL AND
				process_association.removal_date IS NULL AND
				tank_association.application_id = applications.application_id AND
				process_association.application_id = applications.application_id AND
				processes.process_id = process_association.process_id AND
				tank_association.tank_id = tanks.tank_id";
	$result = $conn->query($sql);
	
	if(!$result) {
		echo "Problem with query";
		exit;
	}
	

	if ($result->num_rows > 0) {
		// output data of each row
		while($row = $result->fetch_assoc()) {
			$pn = $row['process_name'];
			$id = $row['application_id'];
			$at = $row['application_type'];
			$tn = $row['tank_number'];
			
			$proc_obj[$pn][] = ["app_id"=>$id, "application_name"=>$at, "tank_number"=>[$tn]];
		}
	}
	
	//return obj
	echo json_encode($proc_obj);
	
	$conn->close();
	
?>