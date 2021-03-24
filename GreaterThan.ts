import { Rule } from "./Rule"

export class GreaterThan extends Rule {
	readonly precedence = 70
	readonly class = "GreaterThan"
	constructor(readonly value: bigint | boolean | number | string) {
		super()
	}
	is(value: any): boolean {
		return value > this.value
	}
	toString(): string {
		return this.value.toString()
	}
}
export function greaterThan(criteria: bigint | boolean | number | string): GreaterThan
export function greaterThan(criteria: bigint | boolean | number | string, value?: any): boolean
export function greaterThan(criteria: bigint | boolean | number | string, value?: any): GreaterThan | boolean {
	const result = new GreaterThan(criteria)
	return value ? result.is(value) : result
}
