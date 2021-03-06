export interface Cursor {
	start: number
	end: number
}
export namespace Cursor {
	export function is(value: any): value is Cursor {
		return typeof value == "object" && typeof value.start == "number" && typeof value.end == "number"
	}
}
