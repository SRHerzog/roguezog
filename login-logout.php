<?php
session_start();
if(isset($_POST['login'])&&isset($_POST['name'])){
	$_SESSION['player']=$_POST['name'];
	echo "login";
}
else if(isset($_POST['logout'])){
	unset($_SESSION['player']);
	echo "logout";
}
?>