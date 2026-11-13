---
title: "Sending payouts from OUSD"
description: "Choose what a recipient receives when paying from OUSD: fiat, USDC, or an explicitly supported OUSD transfer."
modifiedAt: '2026-11-09'
reviewedAt: '2026-10-11'
draft: false
sources:
  - id: stripe-transfer-send
    reviewedAt: '2026-10-11'
    claim: "Treasury stablecoin-funded payouts deliver supported fiat or USDC/USDC.e on the documented external crypto rails."
  - id: stripe-connect
    reviewedAt: '2026-10-11'
    claim: "Connect stablecoin payouts are a private preview for eligible US platforms, use a fiat platform balance, and pay recipients in USDC."
  - id: stripe-global-payouts
    reviewedAt: '2026-10-11'
    claim: "Third-party payouts use recipient onboarding and a distinct Global Payouts flow."
  - id: bridge-wallets
    reviewedAt: '2026-10-11'
    claim: "Bridge custodial wallets explicitly support OUSD on Base, Ethereum, Solana and Tempo, subject to fund-flow approval."
  - id: bridge-transfers
    reviewedAt: '2026-10-11'
    claim: "Bridge Transfers separates the source and destination and provides deposit instructions for external sources."
related: [hold-ousd, create-wallets, integration-architecture]
---

Send payouts when your application needs to deliver funds to a person or business. For example, a marketplace could pay a seller from an OUSD-funded balance while letting the seller receive an approved stablecoin or money in a bank account.

Start with the recipient's required asset and destination. Funding a payout with OUSD does not mean the recipient receives OUSD.

## Understand the two sides

A payout has a source debit and a destination credit, potentially with conversion between them. A [network](/guides/concepts/#network) and [token identifier](/guides/concepts/#token-address) are part of a wallet destination; a ticker alone is insufficient.

A submitted transaction is also different from [settlement](/guides/concepts/#finality-and-settlement). Decide which provider state or chain confirmation establishes recipient delivery for your product.

## Define the requirements

- The recipient, their eligibility, and their bank account or wallet destination
- The source asset, recipient asset, supported route, fees, limits and expected timing
- Who approves the payment and how funds are reserved before submission
- How failures, returns, delayed delivery and uncertain outcomes are handled

## Build the payout workflow

1. **Onboard and verify the recipient.** Keep your user ID, the provider's recipient ID and the payment destination distinct.
2. **Validate the route.** Confirm the exact source and destination assets, country or network, and account permissions. Check wallet identifiers against [Networks and contracts](/networks/).
3. **Present the payment for approval.** Show the source debit, recipient amount and asset, fees and destination. Own-account transfers and payments to third parties may have different requirements.
4. **Reserve funds and submit once.** Persist a payment record and stable [idempotency key](/guides/concepts/#idempotency). A timeout leaves the outcome unknown; first retrieve the original payment instead of creating another.
5. **Track delivery and reconcile.** Match the provider reference, fees and recipient credit. Release a reservation only after the outcome is established.

## Example: paying a marketplace seller

An illustrative payment record could contain an OUSD source balance and a USDC recipient amount. Show both currencies in the payment history. Keep the state as submitted until the chosen route supplies delivery evidence; route a failed or returned payment to review.

Use [payment events, retries and reconciliation](/guides/integration-architecture/) for reliable processing. [Creating OUSD wallets](/guides/create-wallets/) covers provisioning if the recipient needs a new wallet.

## References and review

The [provider directory](/ecosystem/) and activity sections below link to the official product documentation behind each route. These general workflows are application-design guidance; provider-specific steps, eligibility and asset limits are in those profiles.

Documentation reviewed October 11, 2026. Modified November 9, 2026. No live integration independently tested.

## Available providers

<!-- task-providers:start -->
- [Bridge](/providers/bridge/#send-payouts): Bridge Transfers can deliver OUSD or another supported destination asset; check each route direction.
- [BVNK](/providers/bvnk/#send-payouts): BVNK lists direct business transfers and embedded payouts.
- [Mastercard](/providers/mastercard/#send-payouts): Open Standard lists Mastercard for sending funds, but does not specify an OUSD payout API or network matrix.
- [Privy](/providers/privy/#send-payouts): Privy documents custodial OUSD transfers, including an OUSD-on-Tempo example. This is a wallet-to-wallet transfer, not a bank-payout API.
- [Stripe](/providers/stripe/#send-payouts): What reaches the recipient? Treasury can fund payouts from OUSD, but the documented external assets are supported fiat, USDC or USDC.e. Native OUSD recipient delivery is not established by this product guide.
- [Visa](/providers/visa/#send-payouts): VSP supports OUSD transfers; the wallet arrangement determines where they are executed.
<!-- task-providers:end -->
