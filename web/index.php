<!DOCTYPE html>
<html >
  <head>
    <meta charset="UTF-8">
    <title>Roguezog v0.4</title>
        <link rel="stylesheet" href="css/style.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
        <script src='https://code.jquery.com/jquery-2.2.4.min.js'></script>
  </head>

  <body>
  <header><?php include "header.php"; ?></header>

    <div id="react-box" class="gameboard"></div>
<div id="instructions"><p>Instructions: Beat the boss!</p>
	
<p>You are the white/blue square. WASD to move, E to stand still, G to pick up treasure (after bumping into it). Red and pink squares are monsters, which can be fought for experience. Green squares are food, yellow squares are treasure. Experience increases your damage and your maximum HP.</p>

<p>Clicking on a square will give you information about that square in the JavaScript console (so you can cheat).</p>
<!-- <?php
$file=fopen("logs.txt","r") or die ("Log file read error");
echo fread($file,filesize("logs.txt"));
fclose($file);
?> -->
</div>
<script src='https://fb.me/react-15.1.0.min.js'></script>
<script src='https://fb.me/react-dom-15.1.0.min.js'></script>

        <script src="js/roguezog.js"></script>
        </script>
  </body>
</html>
