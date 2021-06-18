import * as selectively from "../index"
import { Completion } from "./Completion"

const merchant = new selectively.Type.Object({
	id: new selectively.Type.String(),
	descriptor: new selectively.Type.String(),
	name: new selectively.Type.String(),
	currency: new selectively.Type.String("Currency"),
	scheme: new selectively.Type.Union([
		new selectively.Type.String("unknown"),
		new selectively.Type.String("amex"),
		new selectively.Type.String("dankort"),
		new selectively.Type.String("diners"),
		new selectively.Type.String("discover"),
		new selectively.Type.String("electron"),
		new selectively.Type.String("interpayment"),
		new selectively.Type.String("jcb"),
		new selectively.Type.String("maestro"),
		new selectively.Type.String("mastercard"),
		new selectively.Type.String("unionpay"),
		new selectively.Type.String("visa"),
	]),
	refundable: new selectively.Type.Number(),
	captured: new selectively.Type.Number(),
	settled: new selectively.Type.Number(),
	fees: new selectively.Type.Number(),
})

const Card = new selectively.Type.Object({
	scheme: new selectively.Type.Union([
		new selectively.Type.String("unknown"),
		new selectively.Type.String("amex"),
		new selectively.Type.String("dankort"),
		new selectively.Type.String("diners"),
		new selectively.Type.String("discover"),
		new selectively.Type.String("electron"),
		new selectively.Type.String("interpayment"),
		new selectively.Type.String("jcb"),
		new selectively.Type.String("maestro"),
		new selectively.Type.String("mastercard"),
		new selectively.Type.String("unionpay"),
		new selectively.Type.String("visa"),
	]),
	iin: new selectively.Type.String(),
	last4: new selectively.Type.String(),
	expires: new selectively.Type.String(),
	type: new selectively.Type.Union([new selectively.Type.String("debit"), new selectively.Type.String("credit")]),
	csc: new selectively.Type.Union([new selectively.Type.String("matched"), new selectively.Type.String("present")]),
})

const template = new selectively.Type.Object({
	boolean: new selectively.Type.Boolean(),
	merchant: merchant,
	authorization: new selectively.Type.Object({
		id: new selectively.Type.String(),
		number: new selectively.Type.String(),
		reference: new selectively.Type.String(),
		amount: new selectively.Type.Number(),
		currency: new selectively.Type.Union([new selectively.Type.String("SEK"), new selectively.Type.String("EUR")]),
		card: Card,
		descriptor: new selectively.Type.String(),
		recurring: new selectively.Type.Union([
			new selectively.Type.String("initial"),
			new selectively.Type.String("subsequent"),
		]),
		verification: new selectively.Type.Union([
			new selectively.Type.String("verified"),
			new selectively.Type.String("unavailable"),
			new selectively.Type.String("rejected"),
		]),
		captured: new selectively.Type.Object({
			amount: new selectively.Type.Number(),
			latest: new selectively.Type.String(),
			auto: new selectively.Type.String(),
		}),
		refunded: new selectively.Type.Object({
			amount: new selectively.Type.Number(),
			latest: new selectively.Type.String(),
		}),
		settled: new selectively.Type.Object({
			gross: new selectively.Type.Number(),
			fee: new selectively.Type.Number(),
			net: new selectively.Type.Number(),
			latest: new selectively.Type.String(),
		}),
		voided: new selectively.Type.String(),
		status: new selectively.Type.Array([
			new selectively.Type.Union([
				new selectively.Type.String("authorized"),
				new selectively.Type.String("cancelled"),
				new selectively.Type.String("captured"),
				new selectively.Type.String("refunded"),
				new selectively.Type.String("settled"),
			]),
		]),
		created: new selectively.Type.String(),
	}),
})

describe("selectively.template", () => {
	it("template completions", () => {
		expect(Completion.stringify(template.complete(""))).toEqual(["boolean_", "merchant_", "authorization_", "!_"])
		expect(Completion.stringify(template.complete("autho"))).toEqual(["authorization_"])
		expect(Completion.stringify(template.complete("authorization"))).toEqual(["authorization._", "authorization:_"])
		expect(Completion.stringify(template.complete("authorization."))).toEqual([
			"authorization.id_",
			"authorization.number_",
			"authorization.reference_",
			"authorization.amount_",
			"authorization.currency_",
			"authorization.card_",
			"authorization.descriptor_",
			"authorization.recurring_",
			"authorization.verification_",
			"authorization.captured_",
			"authorization.refunded_",
			"authorization.settled_",
			"authorization.voided_",
			"authorization.status_",
			"authorization.created_",
		])
		expect(Completion.stringify(template.complete("authorization.verification:un"))).toEqual([
			"authorization.verification:unavailable_",
		])
		expect(Completion.stringify(template.complete("authorization.verification:"))).toEqual([
			"authorization.verification:verified_",
			"authorization.verification:*_",
			"authorization.verification:*_*",
			"authorization.verification:/_/",
			"authorization.verification:!_",
			"authorization.verification:_*",
			"authorization.verification:unavailable_",
			"authorization.verification:rejected_",
		])
	})
	it("authorization:has()", () => {
		const completion1 = selectively.Type.complete(template, "authorization:has()")
		expect(completion1).toEqual([
			{ full: "authorization:has(id)", cursor: 20, addon: "id" },
			{ full: "authorization:has(number)", cursor: 24, addon: "number" },
			{ full: "authorization:has(reference)", cursor: 27, addon: "reference" },
			{ full: "authorization:has(amount)", cursor: 24, addon: "amount" },
			{ full: "authorization:has(currency)", cursor: 26, addon: "currency" },
			{ full: "authorization:has(card)", cursor: 22, addon: "card" },
			{ full: "authorization:has(descriptor)", cursor: 28, addon: "descriptor" },
			{ full: "authorization:has(recurring)", cursor: 27, addon: "recurring" },
			{ full: "authorization:has(verification)", cursor: 30, addon: "verification" },
			{ full: "authorization:has(captured)", cursor: 26, addon: "captured" },
			{ full: "authorization:has(refunded)", cursor: 26, addon: "refunded" },
			{ full: "authorization:has(settled)", cursor: 25, addon: "settled" },
			{ full: "authorization:has(voided)", cursor: 24, addon: "voided" },
			{ full: "authorization:has(status)", cursor: 24, addon: "status" },
			{ full: "authorization:has(created)", cursor: 25, addon: "created" },
		])

		const input4 = "authorization:has(re)"
		const completion4 = selectively.Type.complete(template, input4)
		expect(completion4).toEqual([
			{ addon: "reference", cursor: 27, full: "authorization:has(reference)" },
			{ addon: "recurring", cursor: 27, full: "authorization:has(recurring)" },
			{ addon: "refunded", cursor: 26, full: "authorization:has(refunded)" },
		])
	})
	it("suggestions strings", () => {
		const completion1 = selectively.Type.complete(template, "authorization.reference:")
		expect(completion1).toEqual([
			{ cursor: 25, description: "endswith", addon: "*", full: "authorization.reference:*" },
			{ cursor: 25, description: "includes", addon: "**", full: "authorization.reference:**" },
			{ cursor: 25, description: "match", addon: "//", full: "authorization.reference://" },
			{ cursor: 25, description: "not", addon: "!", full: "authorization.reference:!" },
			{ cursor: 24, description: "startswith", addon: "*", full: "authorization.reference:*" },
		])
	})
	it("merchant.name>authorization.", () => {
		const input3 = "merchant.name>authorization."
		const completion3 = selectively.Type.complete(template, input3)
		expect(completion3).toEqual([
			{ addon: "id", cursor: 30, full: "merchant.name>authorization.id" },
			{ addon: "number", cursor: 34, full: "merchant.name>authorization.number" },
			{ addon: "reference", cursor: 37, full: "merchant.name>authorization.reference" },
			{ addon: "card.", cursor: 33, full: "merchant.name>authorization.card." },
			{ addon: "descriptor", cursor: 38, full: "merchant.name>authorization.descriptor" },
			{ addon: "captured.", cursor: 37, full: "merchant.name>authorization.captured." },
			{ addon: "refunded.", cursor: 37, full: "merchant.name>authorization.refunded." },
			{ addon: "settled.", cursor: 36, full: "merchant.name>authorization.settled." },
			{ addon: "voided", cursor: 34, full: "merchant.name>authorization.voided" },
			{ addon: "created", cursor: 35, full: "merchant.name>authorization.created" },
		])
	})

	it("authorization.verification:", () => {
		const completion3 = selectively.Type.complete(template, "authorization.verification:")
		expect(completion3).toEqual([
			{ addon: "verified", cursor: 35, description: undefined, full: "authorization.verification:verified" },
			{ addon: "*", cursor: 28, description: "endswith", full: "authorization.verification:*" },
			{ addon: "**", cursor: 28, description: "includes", full: "authorization.verification:**" },
			{ addon: "//", cursor: 28, description: "match", full: "authorization.verification://" },
			{ addon: "!", cursor: 28, description: "not", full: "authorization.verification:!" },
			{ addon: "*", cursor: 27, description: "startswith", full: "authorization.verification:*" },
			{ addon: "unavailable", cursor: 38, description: undefined, full: "authorization.verification:unavailable" },
			{ addon: "rejected", cursor: 35, description: undefined, full: "authorization.verification:rejected" },
		])
	})
	it("authorization.verification:**", () => {
		const completion3 = selectively.Type.complete(template, "authorization.verification:**")
		expect(completion3).toEqual([
			{ addon: "verified", cursor: 36, description: undefined, full: "authorization.verification:*verified*" },
			{ addon: "unavailable", cursor: 39, description: undefined, full: "authorization.verification:*unavailable*" },
			{ addon: "rejected", cursor: 36, description: undefined, full: "authorization.verification:*rejected*" },
		])
	})
	it("authorization.amount<", () => {
		const completion3 = selectively.Type.complete(template, "authorization.amount<")
		expect(completion3).toEqual([
			{ addon: "merchant.", cursor: 30, description: undefined, full: "authorization.amount<merchant." },
			{ addon: "authorization.", cursor: 35, description: undefined, full: "authorization.amount<authorization." },
			{ addon: "<=", cursor: 22, description: undefined, full: "authorization.amount<=" },
		])
	})
	it("authorization.amount<authorization.amount", () => {
		const completion3 = selectively.Type.complete(template, "authorization.amount<authorization.amount")
		expect(completion3).toEqual([
			{
				addon: "boolean",
				cursor: 49,
				description: undefined,
				full: "authorization.amount<authorization.amount boolean",
			},
			{
				addon: "merchant",
				cursor: 50,
				description: undefined,
				full: "authorization.amount<authorization.amount merchant",
			},
			{
				addon: "authorization",
				cursor: 55,
				description: undefined,
				full: "authorization.amount<authorization.amount authorization",
			},
			{ addon: "!", cursor: 43, description: "not", full: "authorization.amount<authorization.amount !" },
			{ addon: "|", cursor: 44, description: "or", full: "authorization.amount<authorization.amount | " },
			{ addon: " + ", cursor: 44, description: undefined, full: "authorization.amount<authorization.amount + " },
			{ addon: " - ", cursor: 44, description: undefined, full: "authorization.amount<authorization.amount - " },
			{ addon: " * ", cursor: 44, description: undefined, full: "authorization.amount<authorization.amount * " },
		])
	})
	it("merchant:has(scheme)", () => {
		const completion3 = selectively.Type.complete(template, "merchant:has(scheme)   ")
		expect(completion3).toEqual([])
	})
})
describe("merchant.scheme:*amex*", () => {
	it("merchant.scheme:*amex*", () => {
		const completion = selectively.Type.complete(template, "merchant.scheme:*amex*")
		expect(completion).toEqual([])
	})
})

describe("boolean complete test", () => {
	it("boolean complete test", () => {
		const completion = selectively.Type.complete(template, "boolean")
		expect(completion).toEqual([{ addon: ":", cursor: 8, description: undefined, full: "boolean:" }])
	})
	it("boolean complete test2", () => {
		const completion = selectively.Type.complete(template, "boolean:")
		expect(completion).toEqual([
			{ addon: "true", cursor: 12, description: undefined, full: "boolean:true" },
			{ addon: "false", cursor: 13, description: undefined, full: "boolean:false" },
			{ addon: "!", cursor: 9, description: "not", full: "boolean:!" },
		])
	})
	it("boolean complete test3", () => {
		const completion = selectively.Type.complete(template, "boolean:tru")
		expect(completion).toEqual([{ addon: "true", cursor: 12, description: undefined, full: "boolean:true" }])
	})
	it("boolean complete test4", () => {
		const completion = selectively.Type.complete(template, "boolean:!")
		expect(completion).toEqual([
			{ addon: "true", cursor: 13, description: undefined, full: "boolean:!true" },
			{ addon: "false", cursor: 14, description: undefined, full: "boolean:!false" },
		])
	})
	it("dadadadadadadadadadadadadada", () => {
		const string = JSON.stringify({
			fontFamily: '"Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif',
			header: { background: "86,86,86", color: "255,255,255" },
			body: { background: "227,227,227", color: "0,0,0" },
			success: { background: "81,196,115", color: "255,255,255" },
		})
		expect(string).toEqual(
			'{"fontFamily":"\\"Roboto\\", \\"Helvetica Neue\\", Helvetica, Arial, sans-serif","header":{"background":"86,86,86","color":"255,255,255"},"body":{"background":"227,227,227","color":"0,0,0"},"success":{"background":"81,196,115","color":"255,255,255"}}'
		)
		const object = JSON.parse(string)
		expect(object).toEqual({
			fontFamily: '"Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif',
			header: { background: "86,86,86", color: "255,255,255" },
			body: { background: "227,227,227", color: "0,0,0" },
			success: { background: "81,196,115", color: "255,255,255" },
		})
	})
})
