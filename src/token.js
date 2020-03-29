class Token {
	/**
	 * type should be one of the valid token types list below, and value is an
	 * optional value that can carry any extra information necessary for a given
	 * token type. (e.g. the matched string for an identifier)
	 */
	constructor(type, value) {
		this.type = type;
		this.value = value;
	}
};

[
	'EOF',
	'LAMBDA',
	'LPAREN',
	'RPAREN',
	'LCID', //lowercase identifier 
	'DOT',
	'PLUS',
	'MINUS',
	'MUL',
	'DIV'
].forEach(token => Token[token] = token);

module.exports = Token;
