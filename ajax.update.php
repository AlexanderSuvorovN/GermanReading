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
	var_dump($_REQUEST);
	$json = array();
	$word_de = $_REQUEST['word_de'] ?? null;
	$word_en = $_REQUEST['word_en'] ?? null;
	$data = $_REQUEST['data'] ?? null;
	if($word_de === null)
	{
		ajaxResponse(['status' => 'error', 'message' => 'word in DE needs to be specified']);
	}
	if($word_en === null)
	{
		ajaxResponse(['status' => 'error', 'message' => 'word in EN needs to be specified']);
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
		$word_de['word'] = strtolower($word_de['word']);
		$word_en['word'] = strtolower($word_en['word']);
		$data = [];
		$dbh->beginTransaction();
		$s = $dbh->prepare("SELECT `word` FROM `words_de` WHERE `word` = :word_de LIMIT 1");
		$s->bindParam(':word_de', $word_de['word'], PDO::PARAM_STR);
		$s->execute();
		$fetch = $s->fetch(PDO::FETCH_ASSOC);
		if($fetch === false)
		{
			$s = $dbh->prepare("INSERT INTO `words_de` (`word`) VALUES (:word_de)");
			$s->bindParam(':word_de', $word_de['word'], PDO::PARAM_STR);
			$s->execute();
		}
		$s = $dbh->prepare("SELECT `word` FROM `words_en` WHERE `word` = :word_en LIMIT 1");
		$s->bindParam(':word_en', $word_en['word'], PDO::PARAM_STR);
		$s->execute();
		$fetch = $s->fetch(PDO::FETCH_ASSOC);
		if($fetch === false)
		{
			$s = $dbh->prepare("INSERT INTO `words_en` (`word`) VALUES (:word_en)");
			$s->bindParam(':word_en', $word_en['word'], PDO::PARAM_STR);
			$s->execute();
		}
		$s = $dbh->prepare("INSERT INTO `x_words_de_en` (`word_de`, `word_en`) VALUES (:word_de, :word_en)");
		$s->bindParam(':word_de', $word_de['word'], PDO::PARAM_STR);
		$s->bindParam(':word_en', $word_en['word'], PDO::PARAM_STR);
		// $s->execute();
		$dbh->commit();
		ajaxResponse(['status' => 'success', 'message' => 'database has been successfully updated']);
	}
	catch(PDOException $e)
	{
		$dbh->rollBack();
		ajaxResponse(['status' => 'failed', 'message' => $e->getMessage()]);
	}