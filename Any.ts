import { Base } from "./Base"
import { Criteria } from "./Criteria"
import { is } from "./Is"

export class Any extends Base {
	constructor(readonly value: Criteria) {
		super()
	}
	is(value: any): boolean {
		return typeof(value) == "object" ? Object.getOwnPropertyNames(value).some(property => is(this.value, value[property]) || this.is(value[property])) :
		is(this.value, value)
	}
}
export function any<T>(criteria: Criteria): Base {
	return new Any(criteria)
}
