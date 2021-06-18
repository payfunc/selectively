import * as selectively from "../index"

describe("parse.group", () => {
	it("status:some(created | charged | paid | pending | deferred | ordered | denied) created:()", () => {
		const parsed = selectively
			.parse("status:some(created | charged | paid | pending | deferred | ordered | denied) created:()")
			.toString()
		expect(parsed).toEqual("status:some(created | charged | paid | pending | deferred | ordered | denied) created:()")
	})
	it("status:some(charged | ordered) created:2019-11*", () =>
		expect(selectively.parse("status:some(charged | ordered) created:2019-11*").toString()).toEqual(
			"status:some(charged | ordered) created:2019-11*"
		))
	it("status:some(charged | ordered) created:2019-11-26* client:CGaDLvmqkExR*", () =>
		expect(
			selectively.parse("status:some(charged | ordered) created:2019-11-26* client:CGaDLvmqkExR*").toString()
		).toEqual("status:some(charged | ordered) created:2019-11-26* client:CGaDLvmqkExR*"))
	const value = {
		amount: 1000,
		merchant: {
			name: "Example AB",
			descriptor: "Example Company",
			country: "SE",
			currency: "SEK",
			captured: 1000,
			fees: 1000,
			refundable: 1000,
			settled: 1000,
			scheme: ["visa", "mastercard"],
		},
		authorization: {
			amount: 1000,
			captured: { amount: 50 },
			currency: "SEK",
			card: {
				iin: "411111",
				last4: "1111",
				scheme: "visa",
				csc: "present",
				type: "debit",
			},
			capture: "auto",
			descriptor: "Example AB",
			recurring: "initial",
			verification: "rejected",
		},
	}
	it("implicit some", () => {
		const rule = "merchant.scheme:visa"
		const failingValue = { merchant: ["mastercard", "amex"] }
		expect(selectively.parse(rule).is(value)).toBeTruthy()
		expect(selectively.parse(rule).is(failingValue)).toBeFalsy()
	})
	it("3d on Initial Recurring", () => {
		const rule = "authorization.recurring:initial !authorization.verification:verified"
		const failingValue = { authorization: { recurring: "initial", verification: "verified" } }
		expect(selectively.parse(rule).is(value)).toBeTruthy()
		expect(selectively.parse(rule).is(failingValue)).toBeFalsy()
	})
	it("Standard 3d rule", () => {
		const rule = "authorization.amount>15 !authorization.verification:verified !authorization.recurring:subsequent"
		expect(selectively.parse(rule).is(value)).toBeTruthy()
	})
	it("Reject refunds that exceed the refundable amount", () => {
		const rule = "merchant.refundable<0"
		const modifiedValue = JSON.parse(JSON.stringify(value))
		modifiedValue.merchant.refundable = -3
		expect(selectively.parse(rule).is(value)).toBeFalsy()
		expect(selectively.parse(rule).is(modifiedValue)).toBeTruthy()
	})
	it("Force CsC for not recurring authorizations", () => {
		const rule = "!authorization.recurring:subsequent !authorization.card.csc:present"
		const modifiedValue = JSON.parse(JSON.stringify(value))
		modifiedValue.authorization.card.csc = "absent"
		expect(selectively.parse(rule).is(value)).toBeFalsy()
		expect(selectively.parse(rule).is(modifiedValue)).toBeTruthy()
	})
	it("Reject captures that exceed the authorized amount by more than 5 percent", () => {
		const rule = "amount>authorization.amount * 1.05 - authorization.captured.amount"
		const modifiedValue = JSON.parse(JSON.stringify(value))
		modifiedValue.authorization.captured.amount = 51
		expect(selectively.parse(rule).is(value)).toBeFalsy()
		expect(selectively.parse(rule).is(modifiedValue)).toBeTruthy()
	})
	it("authorization:has(descriptor)", () => {
		const rule = "authorization:has(descriptor)"
		const parsed = selectively.parse(rule)
		expect(parsed).toEqual({
			class: "Property",
			criteria: { class: "Has", precedence: 85, property: "descriptor" },
			name: "authorization",
			precedence: 80,
			symbol: ".",
		})
		const value = {
			authorization: { descriptor: {} },
		}
		const failingValue = {
			authorization: {},
		}
		expect(parsed.is(value)).toBeTruthy()
		expect(parsed.is(failingValue)).toBeFalsy()
	})
	it("merchant.refundable<-3000", () => {
		const rule = "merchant.refundable<-3000"
		const parsed = selectively.parse(rule)
		expect(parsed.is({ merchant: { refundable: 0 } })).toBeFalsy()
		expect(parsed.is({ merchant: { refundable: -5000 } })).toBeTruthy()
	})
	it("authorization.amount>225 !authorization.verification:verified !authorization.recurring:subsequent", () => {
		const rule = "authorization.amount>225 !authorization.verification:verified !authorization.recurring:subsequent"
		const parsed = selectively.parse(rule)
		expect(parsed.is({ authorization: { amount: 230, verification: "failing", recurring: "failing" } })).toEqual(true)
		expect(parsed.is({ authorization: { amount: 220, verification: "failing", recurring: "failing" } })).toEqual(false)
		expect(parsed.is({ authorization: { amount: 230, verification: "failing", recurring: "subsequent" } })).toEqual(
			false
		)
		expect(parsed.is({ authorization: { amount: 230, verification: "verified", recurring: "failing" } })).toEqual(false)
		expect(parsed.is({ authorization: { amount: 230, verification: "verified", recurring: "failing" } })).toEqual(false)
	})

	it("authorization.has...", () => {
		const rule = "authorization:has(currency)"
		const parsed = selectively.parse(rule)
		const failingValue = { authorization: { amount: 2 } }
		expect(parsed.is(failingValue)).toBeFalsy()
		expect(parsed.is(value)).toBeTruthy()
	})
})
