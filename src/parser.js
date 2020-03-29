const AST = require('./ast');
const Token = require('./token');

class Parser {
	constructor(lexer) {
		this.lexer = lexer;
	}

	parse() {
		const result = this.term([]);
		// make sure we consumed all the program, otherwise there was a syntax error
		this.lexer.match(Token.EOF);

		return result;
	}
	// term ::= LAMBDA LCID  DOT term | application
	// λx.x | <app>
	// Term being called inside of term means a recusion because you can only accept 1 variable at a time

	//ctx = context
	term(ctx) {
		// SKIPs lambda symbol 
		// LCID lower case letter identifier (a-z)
		if (this.lexer.skip(Token.LAMBDA)) {
			const id = this.lexer.token(Token.LCID);
			this.lexer.match(Token.DOT);
			const term = this.term([id].concat(ctx));
			return new AST.Abstraction(id, term);
		} else {
			return this.application(ctx);
		}
	}

	// written this way to handle recursion
	// application ::= atom application'
	application(ctx) {
		let lhs = this.atom(ctx);

		// application' ::= atom application'
		//                | ε
		while (true) {
			const rhs = this.atom(ctx);
			if (!rhs) {
				return lhs;
			} else {
				lhs = new AST.Application(lhs, rhs);
			}
		}
	}

	// atom ::= LPAREN term RPAREN
	//        | LCID
	atom(ctx) {
		if (this.lexer.skip(Token.LPAREN)) {
			const term = this.term(ctx);
			this.lexer.match(Token.RPAREN);
			return term;
		} else if (this.lexer.next(Token.LCID)) {
			const id = this.lexer.token(Token.LCID)
			return new AST.Identifier(ctx.indexOf(id));
		} else {
			return undefined;
		}
	}
}

module.exports = Parser;
