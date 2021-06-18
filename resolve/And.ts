import { And } from "../And"
import { add, resolve } from "./resolve"

add<And>("and", (definitions, rule) => new And(rule.rules.map(r => resolve(definitions, r))))
