<?php

require_once("../../functions.php");

?>

<!DOCTYPE html>
<html lang="en">
  	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title><?= $commit ?> dialog editor</title>
  	</head>

	<body>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/js/all.min.js" integrity="sha256-KzZiKy0DWYsnwMF+X1DvQngQ2/FxF7MF3Ff72XcpuPs=" crossorigin="anonymous"></script>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css" integrity="sha256-h20CPZ0QyXlBuAw7A+KluUYx/3pK+c7lYEpqLTlxjYQ=" crossorigin="anonymous" />
		
		<script src="https://cdn.jsdelivr.net/gh/jerosoler/Drawflow/dist/drawflow.min.js"></script>
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jerosoler/Drawflow@0.0.48/dist/drawflow.min.css">

		<link rel="stylesheet" type="text/css" href="../styles/thirdparty/jerosoler/beautiful.css" />

		<script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>
		<script src="https://unpkg.com/micromodal/dist/micromodal.min.js"></script>
		<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">

		<script src="https://kerrishaus.com/assets/scripts/jquery-3.6.0.min.js"></script>

		<script src="https://portal.kerrishaus.com/assets/javascript/messages.js"></script>
		<link rel="stylesheet" href="https://portal.kerrishaus.com/assets/styles/messages.css">

		<link rel="stylesheet" type="text/css" href="../styles/dialogEditor.css" />

		<div id="editorContainer">
			<div id="shelf">
				<div class="drag-drawflow" draggable="true" ondragstart="drag(event)" data-node="characterDialog">
					<i class="fas fa-mouse"></i><span> Character Dialog</span>
				</div>
				<div class="drag-drawflow" draggable="true" ondragstart="drag(event)" data-node="characterDialog">
					<i class="fas fa-mouse"></i><span> Character Dialog</span>
				</div>
			</div>

			<div id="editor">
				<div id="drawflow" ondrop="drop(event)" ondragover="allowDrop(event)">
					<div class="btn-export" onclick="Swal.fire({ title: 'Export',
					html: '<pre><code>'+JSON.stringify(editor.export(), null,4)+'</code></pre>'
					})">Export</div>
						<div class="btn-clear" onclick="editor.clearModuleSelected()">Clear</div>
							<div class="btn-lock">
								<i id="lock" class="fas fa-lock" onclick="editor.editor_mode='fixed'; changeMode('lock');"></i>
								<i id="unlock" class="fas fa-lock-open" onclick="editor.editor_mode='edit'; changeMode('unlock');" style="display:none;"></i>
							</div>
							<div class="bar-zoom">
								<i class="fas fa-search-minus" onclick="editor.zoom_out()"></i>
								<i class="fas fa-search" onclick="editor.zoom_reset()"></i>
								<i class="fas fa-search-plus" onclick="editor.zoom_in()"></i>
							</div>
						</div>
					</div>
				</div>
			</div>

			<script src="../scripts/dialogEditor.js"></script>
		</div>
	</body>
</html>