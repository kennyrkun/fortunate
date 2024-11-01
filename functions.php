<?php

// TODO: show commit on loading page
if (file_exists(".git"))
{
	$refs = file_get_contents(".git/HEAD");
	$ref = substr($refs, strrpos($refs, "/"), -1); // have to use this to strip a space for some reason
	$commit = file_get_contents(".git/refs/heads" . $ref); // slash is included in beginning of $ref
	$commit = substr(htmlspecialchars($commit), 0, 6);
}
else
	$commit = "commit unknown";

?>