import { Token } from "../lexer"
import { Base } from "./Base"
import { Completion } from "./Completion"

export type Completor<T extends Base> = (tokens: Token[], type?: T, baseObject?: Base) => Completion[] | Completion

export namespace Completor {
	export function functions(
		tokens: Token[],
		argument: (tokens?: Token[]) => Completion[],
		completion: Completion
	): Completion[] {
		return tokens.length == 0
			? [{ value: ":", suggestion: { value: ":" } }]
			: tokens.length <= 3 &&
			  tokens[0].value == ":" &&
			  completion.value.startsWith(tokens[1]?.value ?? "") &&
			  (tokens[2]?.value ?? "(") == "("
			? Completion.prepend(":", [completion])
			: tokens.length <= 4 &&
			  tokens.slice(0, 4).reduce((string, token) => string + token.value, "") == ":" + completion.value
			? Completion.prepend(":" + completion.value.substring(0, completion.value.length - 1), argument(), ")")
			: tokens.length == 5 &&
			  tokens.slice(0, 3).reduce((string, token) => string + token.value, "") + tokens[4].value ==
					":" + completion.value
			? Completion.prepend(
					":" + completion.value.substring(0, completion.value.length - 1),
					argument(tokens.slice(3, tokens.length - 1)),
					")"
			  )
			: tokens.length > 5 &&
			  tokens.slice(0, 3).reduce((string, token) => string + token.value, "") + tokens[tokens.length - 1].value ==
					":" + completion.value
			? Completion.prepend(
					":" + completion.value.substring(0, completion.value.length - 1),
					argument(tokens.slice(3, tokens.length - 1)),
					")"
			  )
			: []
	}

	export function expressions(
		tokens: Token[],
		argument: (tokens: Token[]) => Completion[],
		completion: Completion
	): Completion[] {
		return tokens.length == 0
			? [{ value: ":", suggestion: { value: ":" } }]
			: tokens[0].value != ":"
			? []
			: tokens.length == 1
			? Completion.prepend(":", [completion])
			: Completion.prepend(":", argument(tokens.slice(1)))
	}

	export function operators(
		tokens: Token[],
		argument: (tokens?: Token[]) => Completion[],
		completion: Completion
	): Completion[] {
		return tokens.length >= 1 && tokens[0].value == completion.value
			? Completion.prepend(completion.value, argument(tokens.slice(1)))
			: tokens.length == 0 ||
			  (tokens.length == 1 && completion.value.startsWith(tokens[0].value)) ||
			  tokens[0].value == completion.value.replace(/ /g, "")
			? [completion]
			: []
	}
}
