<?php
if(!empty($_FILES)) {
	
	//Validation Checks on file
	if ($_FILES['file']['error'] > 0)
	  {
		echo 'Problem: ';
		switch ($_FILES['file']['error'])
		{
		  case 1:  
			 echo 'File exceeded upload_max_filesize.';
			 break;
		  case 2:  
			 echo 'File exceeded max_file_size.';
			 break;
		  case 3:  
			 echo 'File only partially uploaded.';
			 break;
		  case 4:  
			 echo 'No file uploaded.';
			 break;
		  case 6:  
			 echo 'Cannot upload file: No temp directory specified.';
			 break;
		  case 7:  
			 echo 'Upload failed: Cannot write to disk.';
			 break;
		}
		exit;
	  }

	  // Does the file have the right MIME type?
	  if ($_FILES['file']['type'] != 'application/pdf')
	  {
		echo 'Problem: file is not a PDF image.';
		exit;
	  }

	  
	//Rename and move to directory
	$test = explode('.', $_FILES["file"]["name"]);
	$ext = end($test);
	$name = rand(100, 9999) . '.' . $ext;
	$location = './pdf/' . $name;  
	move_uploaded_file($_FILES["file"]["tmp_name"], $location);

	//Send ajax response data
	$message = $_FILES['file']['name'] . ' was uploaded successfully.';
	echo json_encode(array("message"=>$message, "new_file_name"=>$name));
}


