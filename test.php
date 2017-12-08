<?php
function insertDate($date) {
	$ts = strtotime($date);
	echo $ts;
	$conn = new mysqli("localhost", "root", "happyday", "test");
	
	$result = $conn->query("UPDATE user SET timestamp_date=" . $ts);
	
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	} 
	else {
		echo "<p>Date Added!</p>";
	}	
}

function retrieveDate() {
	$conn = new mysqli("localhost", "root", "happyday", "test");

	$result = $conn->query("SELECT timestamp_date FROM user WHERE username='shaun'");

	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	} 
	
	if ($result->num_rows > 0) 
	{
		// output data of each row
		while($row = $result->fetch_assoc()) 
		{
			$dt = new DateTime();
			$dt->setTimestamp($row['timestamp_date']);
			$dt->setTimezone(new DateTimeZone("America/Chicago")); 
			echo "<p>" . $dt->format("l, d-M-Y H:i:s T") . "</p><br />";
		}
	} 
	else 
	{
		echo "0 results";
	}
}



?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
	</head>
	<body>
		<form method="POST">
			<label for="date">Date:</label>
			<input type="date" name="date" id="date" />
			<input type="submit" />
		</form>
		<form method="POST">
			<input type="text" value="test" name="test"/ hidden>
			<input type="submit" value="Get Date">
		</form>

		<select name="select_value" onchange="sendAjax(this)">
			<option value="">Select</option>
			<option value="Rinse">Rinse</option>
			<option value="Alkaline Zinc Electroplate">Alkaline-Zinc</option>
			<option value="Sour Dip">Sour Dip</option>
		</select>
		<input type="text" name="input_value" hidden/>
		<input type="submit">
		<div class="container"></div>
		
		<form method="POST" enctype="multipart/form-data">
			<input type="hidden" name="MAX_FILE_SIZE" value="1000000" />
			<label for="the_file">Upload a file:</label>
			<input type="file" name="the_file" id="the_file" />
			<input type="submit" value="Upload File" />
		</form>
		
		<div class="upload_pic_ajax">
			<input type="hidden" name="MAX_FILE_SIZE" value="1000000" />
			<label for="the_file">Upload a file:</label>
			<input type="file" name="the_file" id="the_file" />
			<button onclick="uploadAjaxPDF(event)">Upload FIle AJAX</button>
		</div>
	
	<script type="text/javascript" src="jquery-2.1.4.min.js"></script>
	<script type="text/javascript">
	
	function uploadAjaxPDF(event) {
			event.preventDefault();
		
		
			//assign passed values to data
			$.ajax({
				url: "test.php",
				data: data,
				cache: false,
				contentType: false,
				processData: false,
				method: 'POST',
				success: function(data) {
					alert(data);
				}
			});
		}
	
	
		function sendAjax(sel) {
			var selVal = $(sel).val();
			$.ajax({
				url: "ajax.php",
				method: 'POST',
				data: {data: selVal},
				dataType: 'json',
				complete: function(data) {
					console.log(data);
				},
				success: function(data) {
					$('.container').empty();
					for(var i=0;i<data.length;i++) {
						var html = "";
						html += '<p>' + data[i] + '</p>';
						$('.container').append(html);
					}
				}
			});
		}
		
		
	</script>
	</body>
</html>