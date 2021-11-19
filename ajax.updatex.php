<?php
	function ajaxResponse($o)
	{
		$GLOBALS['json']['status'] = $o['status'];
		if(isset($o['message']))
		{
			$GLOBALS['json']['message'] = $o['message'];
		}
		if(isset($o['data']))
		{
			$GLOBALS['json']['data'] = $o['data'];
		}
		$GLOBALS['dbh'] = null;
		echo json_encode($GLOBALS['json']);
		exit();
	}
	function bindDataValue(&$s, $placeholder, $data, $path)
	{
		if(is_array($path) === false)
		{
			$path = [$path];
		}
		$set_null = false;
		$stop = false;
		$i = 0;
		$p = $path[$i];
		$d = $data;
		while($stop === false)
		{
			// print('bindDataValue, path: '.$p.PHP_EOL);
			if(isset($d[$p]) === true)
			{
				if($i < count($path) - 1)
				{
					$d = $d[$p];
					$p = $path[++$i];
				}
				else
				{
					// print('bindDataValue, value: '.$d[$p].PHP_EOL);
					$stop = true;
				}

			}
			else
			{
				$stop = true;
				$set_null = true;
				break;
			}
		}
		if($set_null === false && $d[$p] !== null)
		{
			$s->bindValue($placeholder, $d[$p], PDO::PARAM_STR);
		}
		else
		{
			$s->bindValue($placeholder, NULL, PDO::PARAM_NULL);	
		}
	}
	$json = array();
	$data = $_REQUEST['data'] ?? null;
	if($data['word_de'] === null)
	{
		ajaxResponse(['status' => 'failed', 'message' => 'word DE must be specified']);
	}
	$data['word_de']['word'] = strtolower($data['word_de']['word']);
	foreach($data['x'] as &$x)
	{
		$x['word_de'] = strtolower($x['word_de']);
		$x['word_en'] = strtolower($x['word_en']);
		if(isset($x['type']) === true)
		{
			$x['type'] = strtolower($x['type']);
		}
		if(isset($x['freq']) === true)
		{
			$x['freq'] = strtolower($x['freq']);
		}
	}
	try
	{
		$database = 'german';
		$username = 'german';
		$password = 'cE8vQ4yO0fs38l';
		$dbh = new PDO("mysql:host=localhost;dbname=".$database.";charset=utf8", $username, $password);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch(PDOException $e)
	{
		ajaxResponse(['status' => 'failed', 'message' => 'Can not establish database connection: '.$e->getMessage()]);
	}
	try
	{
		// var_dump($data);
		//
		// 1. check if word DE exists in the database
		// 2. if no, then insert new word DE record...
		//    else update it...
		// 3. delete all x-records for the word DE
		// 4. insert all x-records for the word DE
		// 5. check every word EN for x-records
		//    check if it exists in the database
		//    insert if it does not exist
		$dbh->beginTransaction();
		// print('1. check if word DE exists in the database...'.PHP_EOL);
		$s = $dbh->prepare('SELECT `word` FROM `words_de` WHERE `word` = :word AND `type` = :type LIMIT 1');
		$s->bindValue(':word', $data['word_de']['word']);
		bindDataValue($s, ':type', $data, ['word_de', 'type']);
		$s->execute();
		$fetch = $s->fetch(PDO::FETCH_ASSOC);
		if($fetch === false)
		{
			// print('2. insert new word DE record...'.PHP_EOL);
			$s = $dbh->prepare('INSERT INTO `words_de` (`word`, `type`, `gender`, `conjugation`, `kasus`, `singular_plural`, `definite_indefinite`) VALUES(:word, :type, :gender, :conjugation, :kasus, :singular_plural, :definite_indefinite)');
			$s->bindValue(':word', $data['word_de']['word'], PDO::PARAM_STR);
			bindDataValue($s, ':type', $data, ['word_de', 'type']);
			bindDataValue($s, ':gender', $data, ['word_de', 'gender']);
			bindDataValue($s, ':conjugation', $data, ['word_de', 'conjugation']);
			bindDataValue($s, ':kasus', $data, ['word_de', 'kasus']);
			bindDataValue($s, ':singular_plural', $data, ['word_de', 'singular_plural']);
			bindDataValue($s, ':definite_indefinite', $data, ['word_de', 'definite_indefinite']);
			$s->execute();
		}
		else
		{
			// gender, conjugation, kasus, singular-plural, etc...
		}
		// print('3. delete all x-records for the word DE...'.PHP_EOL);
		$s = $dbh->prepare('DELETE FROM `x_words_de_en` WHERE `word_de` = :word_de');
		$s->bindValue(':word_de', $data['word_de']['word'], PDO::PARAM_STR);
		$s->execute();
		foreach($data['x'] as $x)
		{
			$s = $dbh->prepare('INSERT INTO `x_words_de_en` (`word_de`, `word_en`, `type`, `rank`, `freq`) VALUES (:word_de, :word_en, :type, :rank, :freq)');
			$s->bindValue(':word_de', $x['word_de'], PDO::PARAM_STR);
			$s->bindValue(':word_en', $x['word_en'], PDO::PARAM_STR);
			bindDataValue($s, ':type', $x, ['type']);
			bindDataValue($s, ':rank', $x, ['rank']);
			bindDataValue($s, ':freq', $x, ['freq']);
			$s->execute();
		}
		foreach($data['x'] as $x)
		{
			$s = $dbh->prepare('SELECT `word` FROM `words_en` WHERE `word` = :word_en');
			$s->bindValue(':word_en', $x['word_en'], PDO::PARAM_STR);
			$s->execute();
			$fetch = $s->fetch(PDO::FETCH_ASSOC);
			if($fetch === false)
			{
				$s = $dbh->prepare('INSERT INTO `words_en` (`word`) VALUES (:word_en)');
				$s->bindValue(':word_en', $x['word_en'], PDO::PARAM_STR);
				$s->execute();
			}
		}
		$dbh->commit();
		ajaxResponse(['status' => 'success', 'message' => 'operation has been successfully performed']);
	}
	catch(PDOException $e)
	{
		ajaxResponse(['status' => 'failed', 'message' => $e->getMessage()]);
	}

