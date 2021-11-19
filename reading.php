<?php
?>
<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Reading</title>
	<link rel="icon" href="/favicon.svg?v=3">
	<link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap" rel="stylesheet">	
	<link type="text/css" media="screen" rel="stylesheet" href="/reading.css">	
	<script src="/jquery/jquery-3.5.1.min.js"></script>
	<script src="parser.js"></script>
	<script src="reading.js"></script>
</head>
<body>
	<section class='main'>
		<div class='grid'>
			<div class='item left'>
				<textarea name='text'></textarea>
				<div class='text'></div>
			</div>
			<div class='item right'>
			</div>
			<div class='item button edit-go'>
				<button class='edit'>Edit</button>
				<button class='go'>Go</button>
			</div>
			<div class='item button update'>
				<button class='update'>Update</button>
			</div>
		</div>
	</section>
	<section class='dummy'>
		<div class='info'>
			<div class='block word_de'>
				<div class='word_de'>&nbsp;</div>
			</div>
			<div class='block link google-translate'>
				<a class='google-translate' target='_blank' href='https://translate.google.com/?sl=de&tl=en&text=&op=translate'>Google Translate</a>
				<a class='wiktionary' target='_blank' href='https://de.wiktionary.org/wiki/'>Wiktionary</a>
			</div>
			<div class='block translation'>
				<button class='add'>Add</button>
			</div>
			<div class='block type'>
				<div class='label'>
					Type
				</div>
				<select name='type' value=''>
					<option val=''></option>
					<option val='noun'>Noun</option>
					<option val='verb'>Verb</option>
					<option val='adjective'>Adjective</option>
					<option val='pronoun'>Pronoun</option>
					<option val='adverb'>Adverb</option>
					<option val='article'>Article</option>
					<option val='modal verb'>Modal Verb</option>
					<option val='reflexive verb'>Reflexive Verb</option>
				</select>
			</div>
			<div class='block gender'>
				<div class='label'>
					Gender
				</div>
				<div class='grid'>
					<div class='item'>Masculine</div>
					<div class='item'>Feminine</div>
					<div class='item'>Neutral</div>
				</div>
			</div>
			<div class='block conjugation'>
				<div class='label'>
					Conjugation
				</div>
				<div class='grid'>
					<div class='item'>Ich</div>
					<div class='item'>Wir</div>
					<div class='item'>Bin</div>
					<div class='item'>Ihr</div>
					<div class='item'>Er&nbsp;/&nbsp;Sie&nbsp;/&nbsp;Es</div>
					<div class='item'>Sie</div>
				</div>
			</div>
			<div class='block case'>
				<div class='label'>
					Case
				</div>
				<div class='grid'>
					<div class='item'>Infinitiv</div>
					<div class='item'>Akuzativ</div>
					<div class='item'>Dativ</div>
					<div class='item'>Genitive</div>
				</div>
			</div>
			<div class='block singular-plural'>
				<div class='label'>
					Singular / Plural
				</div>
				<div class='grid'>
					<div class='item'>Singular</div>
					<div class='item'>Plural</div>
				</div>
			</div>
		</div>
		<div class='x'>
			<div class='word_en'>
				<input type='text' name='word_en' value=''>
			</div>
			<div class='type'>
				<select name='type' value=''>
					<option value=''></option>
					<option value='main'>Main</option>
					<option value='other'>Other</option>
				</select>
			</div>
			<div class='freq'>
				<select name='freq' value=''>
					<option value=''></option>
					<option value='common'>Common</option>
					<option value='uncommon'>Uncommon</option>
					<option value='rare'>Rare</option>
				</select>
			</div>
			<div class='action'>
				<button class='delete'></button>
			</div>
		</div>
	</section>
</body>
</html>