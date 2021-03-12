import { Token } from "../lexer"
import { Completion } from "./Completion"

export abstract class Base {
	abstract readonly class: string
	abstract complete(token: Token[]): Completion[]
}
