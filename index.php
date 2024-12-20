<?php

require_once("functions.php");

?>

<!DOCTYPE html>
<html>
	<head>
		<title><?= $commit ?> game</title>

		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
		
		<script src="https://kerrishaus.com/assets/scripts/jquery-3.7.0.min.js"></script>
        
		<script src="https://portal.kerrishaus.com/assets/javascript/messages.js"></script>
		<link rel="stylesheet" href="https://portal.kerrishaus.com/assets/styles/messages.css">

		<link rel="stylesheet" href="https://portal.kerrishaus.com/assets/styles/flex-utility.css">

		<script src="./game/scripts/thirdparty/imageMapResizer.min.js"></script>
		
		<link rel="stylesheet" href="./game/styles/environment.css">
		<link rel="stylesheet" href="./game/styles/dialog.css">
		<link rel="stylesheet" href="./game/styles/character.css">
	</head>

	<body>
	    <style>
	        html, body
	        {
	            padding: 0;
	            margin: 0;
	            
	            background: black;
	            
	            max-width: 100vw;
	            max-height: 100vh;
	            
	            overflow: hidden;

				font-family: Tahoma;
	        }
	    </style>
	    
		<script type="module" id="game">
		    import { StateMachine } from "./game/scripts/states/StateMachine.js";
		    import { State        } from "./game/scripts/states/State.js";

			import { LoadingState } from "./game/scripts/states/LoadingState.js";
		    
		    let sleepSetTimeout_ctrl;

            window.sleep = function(ms)
            {
                clearInterval(sleepSetTimeout_ctrl);
                return new Promise(resolve => sleepSetTimeout_ctrl = setTimeout(resolve, ms));
            }
            
		    window.stateMachine = new StateMachine();

		    stateMachine.pushState(new LoadingState());
		</script>
	</body>
</html>
