<?php
function do_html_header() {
	?>
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8" />
			<style>
				.componenet_inputs, 
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