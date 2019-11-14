import { Base, create } from "./Base"
import { Criteria } from "./Criteria"

export class Not extends Base {
	readonly precedence = 90
	constructor(readonly criteria: Base) {
		super()
	}
	is(value: any): boolean {
		return !this.criteria.is(value)
	}
	toString(): string {
		return `!${ this.criteria.stringify(this.precedence) }`
	}
}
export function not(criteria: Criteria): Not
export function not(criteria: Criteria, value: any): boolean
export function not(criteria: Criteria, value?: any): Not | boolean {
	const result = new Not(create(criteria))
	return value ? result.is(value) : result
}
