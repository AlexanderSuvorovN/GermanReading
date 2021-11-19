<?php
	$text = $_REQUEST['text'] ?? null;
	if($text !== null)
	{
		$sep = " \n\t\".,?!-:–«»()„”;[]„“";
		$tok = strtok($text, $sep);
		$words1 = array();
		$words2 = array();
		while ($tok !== false)
		{
			//$tok = ucfirst($tok);
			$words1[] = $tok;
			//$words2[$tok] = (isset($words2[$tok])) ? $words2[$tok] + 1 : 1;
		    $tok = strtok($sep);
		}
		//setlocale(LC_ALL, 'de_DE@euro', 'de_DE', 'deu_deu');
		//sort($words1, SORT_LOCALE_STRING);
		//ksort($words2, SORT_NUMERIC);
		$words3 = array_unique($words1);
	}
	$json = array();
	$json['status'] = 'success';
	$json['message'] = 'text has been successfully processed';
	$json['data'] = array();
	$json['data']['words1'] = $words1;
	$json['data']['words2'] = $words2;
	$json['data']['words3'] = $words3;
	echo json_encode($json);