<?php
session_start();
if(isset($_SESSION['player'])){
	$player=$_SESSION['player'];
}
else{
	$player="Guest";
}
$file=fopen("logs.txt", "a") or die ("File read error.");
fwrite($file,$player . $_POST['log'] . "<br>");
echo "File write success!";
fclose($file);
?>