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
	$json = array();
	$text = $_REQUEST['text'] ?? null;
	if($text === null)
	{
		ajaxResponse(['status' => 'error', 'message' => 'query needs to be specified']);
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
		$text = strtolower($text);
		$data = [];
		$s = $dbh->prepare("SELECT * FROM `words_de` WHERE `word` = :word");
		$s->bindParam(':word', $text, PDO::PARAM_STR);
		$s->execute();
		$fetch = $s->fetch(PDO::FETCH_ASSOC);
		if($fetch === false)
		{
			$data['word_de'] = null;
		}
		else
		{
			$data['word_de'] = $fetch;
		}
		$s = $dbh->prepare("SELECT `word_de`, `word_en` FROM `x_words_de_en` WHERE `word_de` = :word");
		$s->bindParam(':word', $text, PDO::PARAM_STR);
		$s->execute();
		$fetch = $s->fetchAll(PDO::FETCH_ASSOC);
		if($fetch === false)
		{
			$data['x'] = null;
		}
		else
		{
			$data['x'] = [];
			foreach($fetch as &$x)
			{
				$data['x'][] = array(
					'word_de' => $x['word_de'], 
					'word_en' => $x['word_en']);
			}
			$s = $dbh->prepare("SELECT * FROM `words_en` WHERE `word` = :word");
			$s->bindParam(':word', $data['x'][0]['word_en'], PDO::PARAM_STR);
			$s->execute();
			$fetch = $s->fetch(PDO::FETCH_ASSOC);
			if($fetch === false)
			{
				$data['word_en'] = null;
			}
			else
			{
				$data['word_en'] = $fetch;
			}
		}
		ajaxResponse(['status' => 'success', 'message' => 'text has been successfully translated', 'data' => $data]);
	}
	catch(PDOException $e)
	{
		ajaxResponse(['status' => 'failed', 'message' => $e->getMessage()]);
	}

