<?php
session_start();
if(isset($_SESSION["player"])){
	$player=$_SESSION["player"];
}
else {
	$player="Guest";
}
echo "<form class='form-inline login' id='login' role='form'><div class='form-group'><label for='name'>Enter your name: </label><input type='text' class='form-control' id='name' name='name'></div><input type='submit' value='Submit' class='btn btn-default'></form>";
echo "<form class='form-inline' id='logout' role='form'>Welcome, <span id='namedisplay'>".$player."</span>! <input type='submit' name='logout' value='Log out' class='btn btn-default'></form>";
if(isset($_SESSION["player"])){
	echo "<script>";
	echo "$('#login').hide();";
	echo "</script>";
}
else {
	echo "<script>";
	echo "$('#logout').hide();";
	echo "</script>";	
}
?>
<script>
$("#logout").submit(function(e){
	$("#name").val('');
	e.preventDefault();
	$("#logout").hide();
	$("#login").show();
	$.post("login-logout.php",{'logout':true});
});
$("#login").submit(function(e){
	e.preventDefault();
	$("#login").hide();
	$("#logout").show();
	$.post("login-logout.php",{'login':true,'name':$("#name").val()});
	console.log($("#name").val());
	$("#namedisplay").text($("#name").val());

});
</script>
