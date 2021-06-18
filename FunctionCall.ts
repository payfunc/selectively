import { Definition } from "./Definition"
import { Rule } from "./Rule"

export class FunctionCall extends Rule {
	readonly precedence = 85
	readonly class = "FunctionCall"
	constructor(
		readonly identifier: string,
		readonly argument: (bigint | boolean | number | string | Expression)[],
		readonly definition?: Definition
	) {
		super()
	}
	is(value: any): boolean {
		return this.definition?.call(this.argument, value)
	}
	toString(): string {
		return `(${this.property})`
	}
}
