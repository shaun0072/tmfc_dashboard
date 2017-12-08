/*
ALL TEMPERATURES IN°F
tanks.length/width/depth - Convert to inches with PHP
tanks.total_capacity and tanks.freeboard_capacity - Record gallons
additions_log.addition_amount - Convert everyting to mls or grams in PHP and remove floating point e.g. 5 gal = 18927 mls OR 50 lbs = 453 grams
*/
CREATE TABLE users (
	username VARCHAR(16) NOT NULL PRIMARY KEY,
	passwd CHAR(40) NOT NULL,
	email VARCHAR(100) NOT NULL
);

CREATE TABLE applications (
	application_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	application_name VARCHAR(30) NOT NULL,
	application_type VARCHAR(60) NOT NULL,
	tds VARCHAR(60),
	tmfc_temp_optimum TINYINT UNSIGNED,
	tmfc_temp_min TINYINT UNSIGNED,
	tmfc_temp_max TINYINT UNSIGNED,
	tds_temp_min TINYINT UNSIGNED,
	tds_temp_max TINYINT UNSIGNED,
	tmf_pH_optimum DECIMAL(2,2) UNSIGNED,
	tmf_pH_min DECIMAL(4,2) UNSIGNED,
	tmf_pH_max DECIMAL(4,2) UNSIGNED,
	tds_pH_min DECIMAL(4,2) UNSIGNED,
	tds_pH_max DECIMAL(4,2) UNSIGNED,
	agitation VARCHAR(40),
	username VARCHAR(16) NOT NULL
);

CREATE TABLE  tanks (
	tank_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	tank_number SMALLINT UNSIGNED NOT NULL,
	counter_flow TINYINT(1) UNSIGNED NOT NULL,
	tank_shape VARCHAR(40),
	total_capacity SMALLINT UNSIGNED,
	freeboard_capacity SMALLINT UNSIGNED,
	tank_width SMALLINT UNSIGNED,
	tank_length SMALLINT UNSIGNED,
	tank_depth SMALLINT UNSIGNED,
	freeboard_depth SMALLINT UNSIGNED,
	tank2_width SMALLINT UNSIGNED,
	tank2_length SMALLINT UNSIGNED,
	tank2_depth SMALLINT UNSIGNED,
	freeboard2_depth SMALLINT UNSIGNED,
	tank_diameter SMALLINT UNSIGNED,
	tank_material VARCHAR(40),
	tank_heating_method VARCHAR(40),
	coil_material VARCHAR(40),
	tank_agitation VARCHAR(40)
);

CREATE TABLE tank_association (
	tank_association_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	tank_id INT(10) UNSIGNED NOT NULL,
	application_id INT(10) UNSIGNED NOT NULL,
	initiation_date INT(11) UNSIGNED NOT NULL,
	removal_date INT(11) UNSIGNED
);

CREATE TABLE line_numbers (
	line_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	line_number SMALLINT UNSIGNED NOT NULL,
	tank_number SMALLINT UNSIGNED NOT NULL,
	username VARCHAR(16) NOT NULL
);

CREATE TABLE processes (
	process_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	process_name VARCHAR(50) NOT NULL, 
	initiation_date  INT(11) UNSIGNED NOT NULL,
	removal_date  INT(11) UNSIGNED,
	username VARCHAR(16) NOT NULL
);

CREATE TABLE process_association (
	process_association_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	process_id INT(10) UNSIGNED NOT NULL,
	application_id INT(10) UNSIGNED NOT NULL,
	initiation_date  INT(11) UNSIGNED NOT NULL,
	removal_date  INT(11) UNSIGNED,
	username VARCHAR(16) NOT NULL
);

CREATE TABLE makeups (
	makeup_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	application_id INT(10) UNSIGNED NOT NULL,
	makeup_dt INT(11) UNSIGNED NOT NULL ,
	username VARCHAR(16) NOT NULL
);

CREATE TABLE components (
	component_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	application_id INT(10) UNSIGNED NOT NULL,
	component_name VARCHAR(50) NOT NULL,
	component_unit VARCHAR(30),
	tmfc_concentration_optimum FLOAT(8,4) UNSIGNED,
	tmfc_concentration_min FLOAT(8,4) UNSIGNED,
	tmfc_concentration_max FLOAT(8,4) UNSIGNED,
	tds_concentration_min FLOAT(8,4) UNSIGNED,
	tds_concentration_max FLOAT(8,4) UNSIGNED,
	username VARCHAR(16) NOT NULL
);

CREATE TABLE proprietary_chemicals (
	proprietary_chemical_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	application_id INT(10) UNSIGNED NOT NULL,
	chemical_name VARCHAR(50) NOT NULL,
	vendor VARCHAR(50),
	sds VARCHAR(60),
	makeup_requirement FLOAT(8,4) UNSIGNED,
	makeup_unit VARCHAR(30),
	cost_per_unit DECIMAL(8,3) UNSIGNED,
	cost_unit VARCHAR(30),
	username VARCHAR(16) NOT NULL
);

CREATE TABLE test_procedures (
	test_procedure_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	test_procedure VARCHAR(50),
	lab_name VARCHAR(60),
	lab_location VARCHAR(100),
	username VARCHAR(16) NOT NULL
);

CREATE TABLE test_results (
	test_result_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	application_id INT(10) UNSIGNED NOT NULL,
	test_result_dt INT(11) UNSIGNED NOT NULL,
	procedure_id INT(10) UNSIGNED NOT NULL,
	test_result_number FLOAT(8,4) UNSIGNED NOT NULL,
	test_result_unit VARCHAR(30) NOT NULL,
	username VARCHAR(16) NOT NULL
);

CREATE TABLE temperature_log (
	temperature_log_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	application_id INT(10) UNSIGNED NOT NULL,
	temperature_dt INT(11) UNSIGNED NOT NULL,
	temperature_reading TINYINT UNSIGNED NOT NULL,
	username VARCHAR(16) NOT NULL
);

CREATE TABLE pH_log (
	pH_log_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	application_id INT(10) UNSIGNED NOT NULL,
	pH_dt INT(11) UNSIGNED NOT NULL,
	pH_reading DECIMAL(2,2) UNSIGNED NOT NULL,
	username VARCHAR(16) NOT NULL
);

CREATE TABLE additions_log (
	addition_log_id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	application_id INT(10) UNSIGNED NOT NULL,
	addition_dt INT(11) UNSIGNED NOT NULL,
	proprietary_chemical_id INT(10) UNSIGNED NOT NULL,
	addition_amount INT(11) UNSIGNED NOT NULL,
	addition_unit VARCHAR(30) NOT NULL,
	username VARCHAR(16) NOT NULL
);

CREATE TABLE current_use (
	order_id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	
);