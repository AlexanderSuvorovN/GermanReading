<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>AJAX MySQL</title>
	<link rel="icon" href="/favicon.svg?v=3">
</head>
<?php
	$text = 'verbündet';
	try
	{
		$database = 'german';
		$username = 'german';
		$password = 'cE8vQ4yO0fs38l';
		$dbh = new PDO("mysql:host=localhost;dbname=".$database.";charset=utf8mb4", $username, $password);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch(PDOException $e)
	{
		echo $e->getMessage();
	}
	try
	{
		$text = strtolower($text);
		$data = [];
		$s = $dbh->prepare("SELECT `word` FROM `words_de` WHERE `word` = :word");
		$s->bindParam(':word', $text, PDO::PARAM_STR);
		$s->execute();
		$fetch = $s->fetch(PDO::FETCH_ASSOC);
		if($fetch === false)
		{
			$data = null;
		}
		else
		{
			$data = $fetch['word'];
		}
	}
	catch(PDOException $e)
	{
		echo $e->getMessage();
	}
?>
<body>
	<?= $data ?>.
	<?= phpinfo() ?>
</body>
</html>