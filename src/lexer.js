/**
 * An API for the parser to consume the tokens
 */
const Token = require('./token');

class Lexer {
	constructor(input) {
		this._input = input;
		this._index = 0;
		this._token = undefined;
		this._nextToken();
	}

	/**
	 * Return the next char of the input or '\0' if we've reached the end
	 */
	_nextChar() {
		if (this._index >= this._input.length) {
			return '\0';
		}

		return this._input[this._index++];
	}

	/**
	 * Set this._token based on the remaining of the input
	 *
	 * This method is meant to be private, it doesn't return a token, just sets
	 * up the state for the helper functions.
	 */
	_nextToken() {
		let c; //Stores the value returned by nextChar
		do {
			c = this._nextChar();
		} while (/\s/.test(c));
		//'/\s/.test' is a regExpression that test if a string is empty or contains space

		// switch cases checks if each character returned in Char is a valid token and matches it with it's corresponding semantic value: \\ = LAMBDA
		switch (c) {
			case 'λ':
			case '\\':
				this._token = new Token(Token.LAMBDA);
				break;

			case '.':
				this._token = new Token(Token.DOT);
				break;

			case '(':
				this._token = new Token(Token.LPAREN);
				break;

			case ')':
				this._token = new Token(Token.RPAREN);
				break;

			case '\0':
				this._token = new Token(Token.EOF);
				break;

			default:
				//Test to see if the input contains a valid LCID
				if (/[a-z]/.test(c)) {
					let str = '';
					do {
						// add each character to str 
						str += c;
						c = this._nextChar();
					} while (/[a-zA-Z]/.test(c));

					// put back the last char which is not part of the identifier
					this._index--;

					this._token = new Token(Token.LCID, str);
				} else {
					this.fail();
				}
		}
	}

	/**
	 * Assert that the next token has the given type, return it, and skip to the
	 * next token.
	 */
	token(type) {
		if (!type) {
			return this._token.value; //check to see if the 'token' will return an error
		}

		const token = this._token;
		this.match(type);
		return token.value;
	}

	/**
	 * Throw an error message and the location of the error
	 */
	fail() {
		throw new Error(`Unexpected token at offset ${this._index}`);
	}

	/**
	 * Throw an error message and the location of the error
	 */
	next(type) {
		return this._token.type == type;
	}

	/**
	 * Check if the next token has a valid type and skip
	 */
	match(type) {
		if (this.next(type)) {
			this._nextToken();
			return;
		}
		console.error(`${this._index}: Invalid token: Expected '${type}' found '${this._token.type}'`);
		throw new Error('Parse Error');
	}

	/**
	 * Skips the token if it matches a valid token.
	 */
	skip(type) {
		if (this.next(type)) {
			this._nextToken();
			return true;
		}
		return false;
	}
}

module.exports = Lexer;
