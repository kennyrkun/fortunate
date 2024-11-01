<?php

require_once("../../functions.php");

?>

<!DOCTYPE html>
<html>
	<head>
		<title><?= $commit ?> dialog editor</title>

		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
		
		<script src="https://kerrishaus.com/assets/scripts/jquery-3.6.0.min.js"></script>
        
		<script src="https://portal.kerrishaus.com/assets/javascript/messages.js"></script>
		<link rel="stylesheet" href="https://portal.kerrishaus.com/assets/styles/messages.css">

		<link rel="stylesheet" href="https://portal.kerrishaus.com/assets/styles/flex-utility.css">

        <script src="./scripts/dialogEditor.js"></script>

        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jerosoler/Drawflow/dist/drawflow.min.css">
        <script src="https://cdn.jsdelivr.net/gh/jerosoler/Drawflow/dist/drawflow.min.js"></script>
	</head>

	<body>
        <div id="drawflow"></div>

        <script>
            var id = document.getElementById("drawflow");
            const editor = new Drawflow(id);
            editor.start();
        </script>
	</body>
</html>
