$(function()
{
	let text_node = $('div.text > textarea');
	$('button.process').on('click', 
		function(e)
		{
			console.clear();
			let str = text_node.val().trim();
			let words1 = str.split(/[\s\(\)\[\]\.\,\?\!\;\:\-"…„“«»]/);
			let words2 = {};
			let xpatt = new RegExp('%|[0-9]+');
			words1.forEach(
				function(val, ix)
				{
					if(val !== '' && xpatt.test(val) !== true)
					{
						val = val.toLowerCase().trim(); //.replace(/^"|"$/g, '');
						if(words2[val] !== undefined)
						{
							words2[val].count++;
						}
						else
						{
							words2[val] = {};
							words2[val].count = 1;
						}
					}
					// console.log(val);
				});
			console.log(Object.keys(words1).length);
			console.log(Object.keys(words2).length);
			console.log(words2);
			let words_node = $('<div></div>').addClass('words');
			let characters = 0;
			for(key in words2)
			{
				if(characters + key.length >= 5000)
				{
					$('body').append(words_node);
					words_node = $('<div></div>').addClass('words');
					characters = 0;
				}
				let node = $('<div></div>').addClass('line').text(key);
				words_node.append(node);
				characters += key.length;
			}
			$('body').append(words_node);
		});
	/*
	function translate(words)
	{
		console.clear();
		let limit = 3;
		let iterations = 0;
		for(key in words)
		{
			$.ajax(
				{
					url: 'https://dict.deepl.com/german-english/search?ajax=1&source=german&onlyDictEntries=1&jsStatus=0&kind=full',
					method: 'post',
					data:
						{
							query: key
						},
						dataType: 'html'
				})
				.done(
					function(response)
					{
						//console.log(response);
						let html = $(response);
						console.log(html.find('span.tag_type'));
					});	
			iterations++;
			if(iterations >= limit)
			{
				break;
			}
		}
	}
	*/
});