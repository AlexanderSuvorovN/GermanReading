var reading = 
{
	text: null,
	edit_button: null,
	go_button: null,
	dummy: null,
	active_token: null
}
$(function()
{
	reading.text = {};
	reading.text.input_node = $('section.main > div.grid > div.left > textarea');
	reading.text.output_node = $('section.main > div.grid > div.left > div.text');
	reading.right = {};
	reading.right.node = $('section.main > div.grid > div.right');
	reading.edit_button = $('section.main > div.grid > div.button.edit-go > button.edit').hide();
	reading.go_button = $('section.main > div.grid > div.button.edit-go > button.go');
	reading.update_button = $('section.main > div.grid > div.button.update > button.update');
	reading.dummy = {};
	reading.dummy.node = $('section.dummy');
	reading.dummy.right = $('section.dummy > div.info');
	reading.dummy.x = $('section.dummy > div.x');
	reading.text.output_node.hide();
	reading.edit_button.hide();
	reading.go_button.on('click',
		function()
		{
			reading.text.content = reading.text.input_node.val().trim();
			let parser = new Parser(reading.text.content);
			// console.log(parser.tokens);
			reading.text.output_node.empty();
			let paragraphs = [];
			let pix = 0;
			let fresh_p = true;
			paragraphs.push($('<div></div>').addClass('paragraph'));
			for(let i = 0; i < parser.tokens.length; i++)
			{
				let tok = parser.tokens[i];
				let tok_node = $('<span></span>').addClass('token').addClass(tok.type).text(tok.text);
				switch(tok.type)
				{
					case 'newline':
						if(fresh_p !== true)
						{
							let p = paragraphs[pix].clone().empty();
							paragraphs.push(p);
							pix++;
							fresh_p = true;
						}
						break;
					case 'word':
						tok_node.on('click', 
							function(e)
							{
								if(reading.active_token !== null)
								{
									reading.active_token.removeClass('active');
								}
								reading.active_token = tok_node;
								ajaxTranslate(tok.text);
							});
						paragraphs[pix].append(tok_node);
						fresh_p = false;
						break;
					default:
						paragraphs[pix].append(tok_node);
						fresh_p = false;
						break;
				}
			}
			// console.log(paragraphs);
			for(const p of paragraphs)
			{
				reading.text.output_node.append(p);
			}
			reading.text.input_node.hide();
			reading.text.output_node.show();
			reading.go_button.hide();
			reading.edit_button.show();
		});
	reading.edit_button.on('click',
		function()
		{
			reading.text.output_node.hide();
			reading.edit_button.hide();
			reading.text.input_node.show();
			reading.go_button.show();
		});
	reading.update_button.on('click',
		function()
		{
			ajaxUpdateX();
		});
})
function ajaxTranslate(text)
{
	$.ajax(
		{
			url: '/ajax.translate.php',
			method: 'post',
			data:
				{
					text: text
				},
				dataType: 'json'
		})
		.done(
			function(response)
			{
				// console.log(response);
				if(response.status === 'success')
				{
					let data = response.data;
					data.text = text;
					if(data.x.length > 0)
					{
						reading.active_token
							.addClass('active')
							.removeClass('x-missing')
							.addClass('x-found');
					}
					else
					{
						reading.active_token
							addClass('active')
							.removeClass('x-found')
							.addClass('x-missing');
					}
					displayTranslate(data);
				}
				else
				{
					displayNoTranslate();
				}
			});
}
function displayTranslate(data)
{
	reading.right.node.empty().append(reading.dummy.right.clone());
	let word_de = (data.word_de !== null) ? data.word_de.word : data.text;
	reading.right.node.find('div.block.word_de').find('div.word_de').text(word_de);
	reading.right.node.find('div.block.link').find('a.google-translate').attr('href', 'https://translate.google.com/?sl=de&tl=en&text='+word_de+'&op=translate')
	reading.right.node.find('div.block.link').find('a.wiktionary').attr('href', 'https://de.wiktionary.org/wiki/'+word_de);
	if(data.word_en !== null)
	{
		for(const x of data.x)
		{
			addX(x);
		}
	}
	else
	{
		addX(null);
	}
	reading.right.node.find('div.block.translation').find('button.add').on('click',
		function(e)
		{
			addX(null);
		});
	reading.right.node.find('div.block.gender').find('div.grid > div.item').on('click',
		function(e)
		{
			console.log('click');
			let this_node = $(this);
			this_node.addClass('active');
			this_node.siblings().removeClass('active');
		});
	reading.right.node.find('div.block.conjugation').find('div.grid > div.item').on('click',
		function(e)
		{
			let this_node = $(this);
			this_node.toggleClass('active');
		});
	reading.right.node.find('div.block.case').find('div.grid > div.item').on('click',
		function(e)
		{
			let this_node = $(this);
			this_node.toggleClass('active');
		});
	reading.right.node.find('div.block.singular-plural').find('div.grid > div.item').on('click',
		function(e)
		{
			let this_node = $(this);
			this_node.addClass('active');
			this_node.siblings().removeClass('active');
		});
}
function displayNoTranslate()
{
}
function addX(x = null)
{
	if(x === null)
	{
		x = {};
	}
	let block_node = reading.right.node.find('div.block.translation');
	let x_node = reading.dummy.x.clone();
	let word_en = (x.word_en !== undefined && x.word_en !== null) ? x.word_en : '';
	let type = (x.type !== undefined && x.type !== null) ? x.type : '';
	let freq = (x.rank !== undefined && x.type !== null) ? x.freq : '';
	x_node.find('input[name="word_en"]').val(word_en);
	x_node.find('select[name="type"]').val(type);
	x_node.find('input[name="freq"]').val(x.freq);
	x_node.find('button.delete').on('click', () => x_node.remove());
	let x_list = block_node.find('div.x');
	if(x_list.length > 0)
	{
		x_node.insertAfter(x_list.last());
	}
	else
	{
		block_node.prepend(x_node);
	}
}
function ajaxUpdateX()
{
	let data = {};
	data.word_de = {};
	data.word_de.word = reading.right.node.find('div.block.word_de').find('div.word_de').text().trim().toLowerCase();
	data.word_de.type = reading.right.node.find('div.block.type').find('select[name="type"]').val().trim().toLowerCase();
	// if(data.word_de.type === '')
	// {
	// 	delete data.word_de.type;
	// }
	let x_list = reading.right.node.find('div.block.translation').find('div.x');
	data.x = null;
	data.word_en = null;
	x_list.each(
		function(i, x)
		{
			let x_node = $(x);
			let word_en = x_node.find('input[name="word_en"]').val().trim().toLowerCase();
			let type = x_node.find('select[name="type"]').val().trim().toLowerCase();
			let freq = x_node.find('select[name="freq"]').val().trim();
			if(word_en !== '')
			{
				let x = {};
				x.word_de = data.word_de.word;
				x.word_en = word_en;
				x.type = (type !== '') ? type : null;
				x.freq = (freq !== '') ? freq : null;
				if(data.x === null)
				{
					data.x = [];
					data.x.push(x);
				}
				else
				{
					let found = false;
					let priority = [null, 'other', 'main'];
					for(let i = 0; i < data.x.length; i++)
					{
						let e = data.x[i];
						if(x.word_en === e.word_en)
						{
							found = true;
							if(priority.indexOf(x.type) > priority.indexOf(e.type))
							{
								e.type = x.type;
								e.freq = x.freq;
							}
						}
					}
					if(found === false)
					{
						data.x.push(x);
					}
				}
			}
		});
	if(data.x !== null)
	{
		let sorted = [];
		let rank = 0;
		for(let x of data.x)
		{
			if(x.type === 'main')
			{
				x.rank = ++rank;
				sorted.push(x);
			}
		}
		rank = 0;
		for(let x of data.x)
		{
			if(x.type === 'other')
			{
				x.rank = ++rank;
				sorted.push(x);
			}
		}
		rank = 0;
		for(let x of data.x)
		{
			if(x.type === null)
			{
				x.rank = ++rank;
				sorted.push(x);
			}
		}
		data.x = sorted;
		for(let i = 0; i < data.x.length; i++)
		{
			if(data.x[i].type === null)
			{
				delete data.x[i].type;
			}
			if(data.x[i].freq === null)
			{
				delete data.x[i].freq;
			}
		}
		data.word_en = {};
		data.word_en.word = data.x[0].word_en;
	}
	else
	{
		delete data.x;
	}
	// console.log(data);
	$.ajax(
		{
			url: '/ajax.updatex.php',
			method: 'post',
			data:
				{
					data: data
				},
				dataType: 'json'
		})
		.done(
			function(response)
			{
				// console.log(response);
				let msg;
				if(response.status === 'success')
				{
					msg = 'Database has been successfully updated for the word "' + data.word_de.word + '"';
					console.log(msg);
				}
				else
				{
					msg = 'Database has been successfully updated for the word "' + data.word_de.word + '"';
					alert(msg);
				}
			});	
}