<?php
include('output_fns.php');
do_html_header();
?> 
<label>Application Name: </label><input  value="Cleaner" /><br />

<label>Application Type: </label>
<select>
	<option value="Soak Cleaner">Soak Cleaner</option>
	<option value="Plating">Plating</option>
	<option value="Coating">Coating</option>
	<option value="Rinse">Rinse</option>
</select><br />

<label>TDS: </label><br />

<label>Process: </label>
<select>
	<option selected="selected">Manganese Phosphate</option>
	<option>Zinc Phosphate</option>
	<option>Alkaline Zinc-Rack</option>
	<option>Passivation</option>
	<option>Chloride Zinc-Barrel</option>
</select>
<select>
	<option>Manganese Phosphate</option>
	<option selected="selected">Zinc Phosphate</option>
	<option>Alkaline Zinc-Rack</option>
	<option>Passivation</option>
	<option>Chloride Zinc-Barrel</option>
</select>
<br />

<label>Tank Number: </label><input  value="801" /><br />

<h3>Parameters</h3>

<label>Agitation</label>
<select>
	<option selected="selected">Mild-Air</option>
	<option>None</option>
	<option>Low-Air</option>
	<option>Mixer</option>
</select>

<p>Temperature</p>
<label>Optimum: </label><input value="140"/><br />
<label>min-tmf: </label><input value="140"/><br />
<label>max-tmf: </label><input value="140"/><br />
<label>min-tds: </label><input value="140"/><br />
<label>min-tds: </label><input value="140"/><br />

<p>pH</p>
<label>Optimum: </label><input value="n/a"/><br />
<label>min-tmf: </label><input value="n/a"/><br />
<label>max-tmf: </label><input value="n/a"/><br />
<label>min-tds: </label><input value="n/a"/><br />
<label>min-tds: </label><input value="n/a"/><br />

<h3>Properties</h3>

<div class="property">
	<label>Name: </label><input type="text" value="SSP-140"/><br />
	<label>Unit: </label>
	<select>
		<option selected="selected">opg</option>
		<option>%</option>
		<option>g/L</option>
		<option>none</option>
	</select><br />

	<label>Optimum: </label><input type="number" value="10" step=".01"/><br />
	<label>min-tmf: </label><input type="number" value="8" step=".01"/><br />
	<label>max-tmf: </label><input type="number" value="12" step=".01"/><br />
	<label>min-tds: </label><input type="number" value="8" step=".01"/><br />
	<label>max-tds: </label><input type="number" value="12" step=".01"/><br />
	
	<span class="close">X</span>
</div>

<div class="property">
	<label>Name: </label><input type="text" value="Activity"/><br />
	<label>Unit: </label>
	<select>
		<option>opg</option>
		<option selected="selected">%</option>
		<option>g/L</option>
		<option>none</option>
	</select><br />

	<label>Optimum: </label><input type="number" value="0" step=".01"/><br />
	<label>min-tmf: </label><input type="number" value="0" step=".01"/><br />
	<label>max-tmf: </label><input type="number" value="50" step=".01"/><br />
	<label>min-tds: </label><input type="number" value="" step=".01"/><br />
	<label>max-tds: </label><input type="number" value="" step=".01"/><br />
	
	<span class="close">X</span>
</div>

<h3>Proprietary Chemicals</h3>

<div class="pro_chemical">
	<label>Name: </label><input type="text" value="SSP140"/><br />
	<label>SDS: </label><br />
	<label>Vendor: <label>
	<select>
		<option>Accu-Labs</option>
		<option selected="selected">Haviland</option>
		<option>ABrite</option>
		<option>Columbia Chemical</option>
	</select><br />
	<label>Makeup Requirements: </label><input type="number" value="10"/>
	<label>Unit: </label>
	<select>
		<option>opg</option>
		<option>%</option>
		<option>g/L</option>
	</select>
	
	<span class="close">X</span>
<div>

<?php 
do_html_footer();
?>