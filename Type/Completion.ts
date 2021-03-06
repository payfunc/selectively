import { Cursor } from "./Cursor"

export interface Completion {
	readonly value: string
	readonly cursor?: Cursor | number
	suggestion?: { value: string; description?: string }
}
export namespace Completion {
	export function stringify(completions: Completion[]): string[] {
		return completions.map(c =>
			typeof c.cursor == "number"
				? c.value.slice(0, c.cursor) + "_" + c.value.slice(c.cursor, c.value.length)
				: c.value + "_"
		)
	}
	export function prepend(prefix: string, completion: Completion, suffix?: string): Completion
	export function prepend(prefix: string, completions: Completion[], suffix?: string): Completion[]
	export function prepend(
		prefix: string,
		completion: Completion | Completion[],
		suffix?: string
	): Completion | Completion[] {
		return Array.isArray(completion)
			? completion.map(c => prepend(prefix, c, suffix))
			: {
					value: prefix + completion.value + (suffix ?? ""),
					cursor:
						typeof completion?.cursor == "number"
							? completion?.cursor + prefix.length
							: Cursor.is(completion.cursor)
							? { start: completion.cursor.start + prefix.length, end: completion.cursor.end + prefix.length }
							: completion.value.length + prefix.length,
					suggestion: completion.suggestion,
			  }
	}
}
