<?php
include('db_fns.php');


$table = $_POST['table'];
$changes = $_POST['changes'];
$conditions = $_POST['conditions'];

// $table = 'applications';
// $changes = ["tmfc_pH_min"=>10,"tmfc_pH_max"=> -1];
// $conditions = ["application_id"=>1];

function build_update_query($table, $changes, $conditions) {
  $query = 'UPDATE ' . $table;
  $query .= ' SET ';
  foreach ($changes as $key => $value) {
    if($value === "-1") {
      $value = "NULL";
    }
    $query .= $key . '=' . $value . ",";
  }
  $query = rtrim($query, ",");
  $query .= " WHERE ";
  foreach ($conditions as $key => $value) {
    $query .= $key . '=' . $value . " AND ";
  }
  $query = rtrim($query, " AND ");

  return $query;
}


//Connect to tmfc_db
$conn = connect_to_db();

$result = $conn->query(build_update_query($table, $changes, $conditions));
if(!$result) {
	echo "Problem updating " . $table;
	exit;
} else {
  echo json_encode("success!");
}


?>
