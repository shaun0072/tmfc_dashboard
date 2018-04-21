<?php
function do_html_header() {
	?>
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8" />
			<link href="https://fonts.googleapis.com/css?family=Noto+Sans" rel="stylesheet"><!-- main -->
			<link href="https://fonts.googleapis.com/css?family=Revalia" rel="stylesheet"><!--  logo -->
			<link href="https://fonts.googleapis.com/css?family=Quicksand" rel="stylesheet">
			<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet">
			<link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
			<link rel="stylesheet" type="text/css" href="css/style.css">
			<style>
				.property_inputs, 
				.proprietary_chemical_inputs {
					border: 1px solid black;
				}
			</style>
		</head>
		<body>
	<?php
}

function do_html_footer() {
	?>
		<script type="text/javascript" src="jquery-2.1.4.min.js"></script>
		<script type="text/javascript" src="functions.js"></script>
		</body>
	</html>
	<?php
}

?>