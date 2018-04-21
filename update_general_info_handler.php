<?php
include('db_fns.php');

$general_obj = array();

//Connect to tmfc_db
$conn = connect_to_db();

//labs INFO
$result = $conn->query('SELECT * FROM labs');
if(!$result) {
	echo "Problem with labs query";
	exit;
}

if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$general_obj['labs'][] = [
			'lab_id'=>$row['lab_id'],
			'lab_name'=>$row['lab_name'],
			'lab_location'=>$row['lab_location']
		];
	}
}

echo json_encode($general_obj);
?>
