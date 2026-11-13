---
title: "Accepting OUSD payments"
description: "Check OUSD checkout support, prepare the payment flow, and distinguish customer payment assets from merchant settlement."
modifiedAt: '2026-10-12'
reviewedAt: '2026-10-12'
draft: false
sources:
  - id: stripe-ousd-launch
    reviewedAt: '2026-10-12'
    claim: "Stripe’s launch announcement explicitly includes OUSD payment acceptance; the detailed token list still omits OUSD."
  - id: stripe-ousd
    reviewedAt: '2026-10-12'
    claim: "The OUSD ecosystem overview links to Stablecoin Payments as an integration path."
  - id: stripe-payments
    reviewedAt: '2026-10-12'
    claim: "The detailed accepted-token list names USDC, USDP and USDG, leaving OUSD checkout support unresolved."
  - id: stripe-accept-stablecoins
    reviewedAt: '2026-10-12'
    claim: "The Checkout guide documents activation, USD pricing, payment confirmation, and a USDC test flow; it does not establish OUSD acceptance."
related: [hold-ousd, integration-architecture]
---

Accept customer payments when a buyer needs to pay your application for a product or service. For example, a SaaS business could offer a stablecoin checkout option, confirm the payment on its server, and activate the subscription after successful payment.

For OUSD, first establish that the chosen checkout product accepts OUSD for your merchant account. The provider path recorded below has an unresolved OUSD support question.

## Separate payment from settlement

The asset a customer pays can differ from the currency credited to the merchant. An OUSD balance in your financial account does not establish that customers can pay in OUSD at checkout.

[Settlement](/guides/concepts/#finality-and-settlement) is the completed movement of funds. A browser redirect to a success page is not sufficient evidence to fulfill an order.

## Define the requirements

- Explicit OUSD acceptance for the merchant, customer and intended [network](/guides/concepts/#network)
- Merchant eligibility, access stage, transaction limits and fees
- The integration interface, settlement currency, refund asset and supported test procedure
- How the application handles cancellation, expiry, duplicate events and late payments

## Build the acceptance workflow

1. **Verify and enable the payment method.** Obtain OUSD-specific product support and account access before presenting it to customers.
2. **Create the order server-side.** Store the expected amount and currency, your order ID, and the provider's payment reference.
3. **Start the supported checkout flow.** Use current provider documentation for the selected hosted or embedded interface. Do not substitute OUSD into an example for another token.
4. **Confirm payment through trusted server state.** Authenticate payment notifications and retrieve the payment when necessary. Fulfill each order once.
5. **Reconcile merchant settlement and refunds.** Keep the customer payment asset, merchant currency, fees and credited amount separate.

## Example: activating a subscription

In an illustrative checkout, the browser may return before the payment notification arrives. Keep the order pending until the server confirms success, then activate the subscription once. A repeated notification must not create a second subscription or credit.

Test the approved asset-specific flow as well as cancellation and delayed events. A successful test with another stablecoin does not establish OUSD support. Use the shared [events and reconciliation guide](/guides/integration-architecture/), and [Holding OUSD](/guides/hold-ousd/) if retaining proceeds in OUSD is a separate requirement.

## References and review

The [provider directory](/ecosystem/) and activity sections below link to the official product documentation behind each route. These general workflows are application-design guidance; provider-specific steps, eligibility and asset limits are in those profiles.

Documentation reviewed October 12, 2026. Modified October 12, 2026. No live integration independently tested.

## Available providers

<!-- task-providers:start -->
- [Stripe](/providers/stripe/#accept-payments): Can customers pay in OUSD? Stripe’s September 30, 2026 launch announcement explicitly includes OUSD payment acceptance, and its OUSD overview links to Payments. The detailed accepted-token table still names only USDC, USDP and USDG. This conflict remained unresolved on October 12, 2026; confirm the merchant, network and integration with Stripe before implementation.
<!-- task-providers:end -->
