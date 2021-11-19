class Parser
{
	// https://stackoverflow.com/questions/22156326/private-properties-in-javascript-es6-classes
	constructor(text)
	{
		this.text = text;
		if(this.text.length > 0)
		{
			this.curr_ix = 0;
			this.curr_char = this.text.charAt(this.curr_ix);
			this.last_ix = this.text.length - 1;
		}
		else
		{
			this.curr_ix = null;
			this.curr_char = null;
			this.last_ix = null;	
		}
		this.marks_patt = /[\,\.\!\?\:\;\(\)\[\]\"\„\“]/;
		this.symb_patt = /[\@\#\$\%\&\*\+\=\{\}\<\>\~]/;
		this.white_patt = /[\s]/;
		this.digit_patt = /[0-9]/;
		this.separ_patt = /[\s\,\.\!\?\:\;\(\)\[\]\"]/;
		this.iterations_limit = 1000000;
		this.tokens = [];
		this.processText();
	}
	advance(num = 1)
	{
		let r;
		this.curr_ix += num;
		if(this.curr_ix > this.last_ix)
		{
			this.curr_char = null;
			r = false;
		}
		else
		{
			this.curr_char = this.text.charAt(this.curr_ix);
			r = true;
		}
		return r;
	}
	last()
	{
		return (this.curr_ix === this.last) ? true : false;
	}
	whitespace(char)
	{
		if(char === undefined)
		{
			var char = this.curr_char;
		}
		if(this.white_patt.test(char) === true)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	newline(char)
	{
		if(char === undefined)
		{
			var char = this.curr_char;
		}
		if(char === '\n')
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	punctuation(char)
	{
		if(char === undefined)
		{
			var char = this.curr_char;
		}
		if(this.marks_patt.test(char) === true)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	digit(char)
	{
		if(char === undefined)
		{
			var char = this.curr_char;
		}
		if(this.digit_patt.test(char) === true)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	symbol(char)
	{
		if(char === undefined)
		{
			var char = this.curr_char;
		}
		if(this.symb_patt.test(char) === true)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	alpha()
	{
		if(this.whitespace() === true)
		{
			return false;
		}
		if(this.punctuation() === true)
		{
			return false;
		}
		if(this.digit() === true)
		{
			return false;
		}
		if(this.symbol() === true)
		{
			return false;
		}				
		return true;
	}
	number()
	{
		let type;
		let tix = this.curr_ix;
		let char = this.text.charAt(tix);
		let str = '';
		let stop = false;
		while(stop === false)
		{
			str += char;
			tix++;
			if(tix > this.last_ix)
			{
				stop = true;
			}
			else
			{
				char = this.text.charAt(tix);
				if(this.whitespace(char) === true || this.punctuation(char) === true)
				{
					stop = true;
				}
			}
		}
		let number_patt = /^[0-9]+([\.\,][0-9])*$/;
		if(number_patt.test(str) === true)
		{
			return 'number';
		}
		else
		{
			return 'word';
		}
	}
	pushToken(text, type = null, length = null)
	{
		let tok = {};
		tok.text = text;
		tok.type = type;
		tok.length = length;
		this.tokens.push(tok);
	}
	processNewline()
	{
		let r;
		if(this.newline() === true)
		{
			this.pushToken('\n', 'newline', 1);
			r = true;
		}
		else
		{
			r = false;
		}
		this.advance();
		return r;
	}
	processWhitespace()
	{
		let r;
		if(this.whitespace() === true)
		{
			let str = this.curr_char;
			let stop = false;
			while(stop === false)
			{
				// console.log('processSpace: "' + char + '"');
				if(this.advance() !== false && (this.whitespace() === true))
				{
					str += this.curr_char;
				}
				else
				{
					stop = true;
				}
			}
			this.pushToken(str, 'whitespace', str.length);
			r = true;
		}
		else
		{
			this.advance();
			r = false;
		}
		return r;
	}
	processPunctuation()
	{
		let r;
		if(this.punctuation() === true)
		{
			let str = this.curr_char;;		
			if(this.curr_ix <= this.last_ix - 2 &&
				this.text.charAt(this.curr_ix) === '.' && 
				this.text.charAt(this.curr_ix + 1) === '.' && 
				this.text.charAt(this.curr_ix + 2) === '.')
			{
				str = '...';
				this.advance(3);
			}
			else
			{
				this.advance();
			}
			this.pushToken(str, 'punctuation', str.length);
			r = true;
		}
		else
		{
			this.advance();
			r = false;
		}
		return r;
	}
	processNumber()
	{
		let r;
		if(this.digit() === true)
		{
			let str = this.curr_char;
			let stop = false;
			while(stop === false)
			{
				// console.log('processNumber: "' + char + '"');
				if(this.advance() !== false)
				{
					if(this.curr_char === '.' || this.curr_char === ',')
					{
						if((this.last() === true) || (this.digit(this.text.charAt(this.curr_ix + 1)) !== true))
						{
							stop = true;
						}
						else
						{
							str += this.curr_char;
						}
					}
					else if(this.digit() !== true)
					{
						stop = true;
					}
					else
					{
						str += this.curr_char;
					}
				}
				else
				{
					stop = true;
				}
			}
			this.pushToken(str, 'number', str.length);
			r = true;
		}
		else
		{
			this.advance();
			r = false;
		}
		return r;
	}
	processWord()
	{
		let r;
		if(this.alpha() === true)
		{
			let str = this.curr_char;
			let split = false;
			let stop = false;
			while(stop === false)
			{
				// console.log('processWord: "' + char + '"');
				if(this.advance() !== false)
				{
					if(this.char === '-')
					{
						str += this.curr_char;
						if((this.last() == true) || (this.alpha(this.text.charAt(this.curr_ix + 1)) !== true))
						{
							this.advance();
							split = true;
							stop = true;
						}
					}
					else if(this.alpha() !== true)
					{
						stop = true;
					}
					else
					{
						str += this.curr_char;
					}
				}
				else
				{
					stop = true;
				}
			}
			this.pushToken(str, (split === false) ? 'word' : 'split', str.length);
			r = true;
		}
		else
		{
			this.advance();
			r = false;
		}
		return r;
	}
	processNumberWord()
	{
		let r;
		if(this.digit() === true)
		{
			let str = this.curr_char;
			let stop = false;
			while(stop === false)
			{
				// console.log('processNumberWord: "' + this.curr_char + '"');
				if(this.advance() !== false)
				{
					if(this.char === '.' || this.char === ',')
					{
						if(this.last())
						{
							stop = true;
						}
						else if(this.digit(this.text.charAt(this.curr_ix + 1)) !== true)
						{
							stop = true;
						}
						else
						{
							str += this.curr_char;
						}
					}
					else if(this.digit() !== true && this.alpha() !== true)
					{
						stop = true;
					}
					else
					{
						str += this.curr_char;
					}
				}
				else
				{
					stop = true;
				}
			}
			this.pushToken(str, 'numberword', str.length);
			r = true;
		}
		else
		{
			this.advance();
			r = false;
		}
		return r;
		/**/
	}
	processMisc()
	{
		// console.log('processMisc: "' + this.curr_char + '"');
		this.pushToken(this.curr_char, 'misc', 1);
		this.advance();
	}
	processText()
	{
		if(this.text.length > 0)
		{
			let stop = false;
			let iterations = 0;
			while(stop === false)
			{
				// console.log('curr_ix char: ' + this.curr_char);
				if(this.newline() === true)
				{
					this.processNewline();
				}
				else if(this.whitespace() === true)
				{
					this.processWhitespace();
				}
				else if(this.punctuation() === true)
				{
					this.processPunctuation();
				}
				else if(this.digit() === true)
				{
					switch(this.number())
					{
						case 'number':
							this.processNumber();
							break;
						case 'word':
							this.processNumberWord();
							break;
						default:
							this.processMisc();
							break;
					}

				}
				else if(this.alpha() === true)
				{
					this.processWord();
				}
				else
				{
					this.processMisc();
				}
				iterations++;
				if(this.curr_ix > this.last_ix || iterations >= this.iterations_limit)
				{
					stop = true;
				}
			}
		}
		return this.tokens;
	}
}