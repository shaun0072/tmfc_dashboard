<?php 
include('db_fns.php');

$lineNumber = $_POST['data'];
echo json_encode(get_tank_numbers($lineNumber));

?>