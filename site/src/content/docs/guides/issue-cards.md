---
title: "Issuing OUSD-funded cards"
description: "Plan an OUSD-funded customer card program, verify current token support, and separate card spending from wallet settlement."
modifiedAt: '2026-10-12'
reviewedAt: '2026-10-11'
draft: false
sources:
  - id: stripe-cards
    reviewedAt: '2026-10-11'
    claim: "Stablecoin-backed customer card issuing is private preview; the financial-account path describes USDC, while wallet funding uses Bridge."
  - id: bridge-card-funding
    reviewedAt: '2026-10-11'
    claim: "Current card funding documentation uses Stripe Issuing, separates wallet and billing currency, and requires token support confirmation."
  - id: bridge-card-noncustodial
    reviewedAt: '2026-10-11'
    claim: "Bridge shows OUSD examples on Tempo and Solana, but links to legacy provisioning and includes mixed USDC approval examples."
  - id: bridge-card-legacy
    reviewedAt: '2026-10-11'
    claim: "The old card-account provisioning endpoint is deprecated."
  - id: bridge-card-kyc
    reviewedAt: '2026-10-11'
    claim: "Card customers require identity checks and the approved cards endorsement."
  - id: stripe-treasury-cards
    reviewedAt: '2026-10-11'
    claim: "Business expense cards are a separate Treasury product with regional preview availability."
related: [create-wallets, custody-ousd, integration-architecture]
---

Issue cards when customers need to spend a balance at card-accepting merchants. For example, a wallet app could add a customer card whose purchases draw on an approved OUSD funding balance.

A customer card program and cards for your own company's expenses can be different products, with separate onboarding and eligibility.

## Understand the funding model

The card's billing currency, the wallet's funding token and the merchant's settlement currency are distinct. A card billed in USD is not proof that its funding source can be OUSD.

Card authorization reserves or debits funds according to the program's rules; capture, reversal and refund are later events. Keep that lifecycle separate from onchain [settlement](/guides/concepts/#finality-and-settlement).

## Define the requirements

- The approved program type, business countries and cardholder eligibility
- Explicit OUSD support, funding network, wallet model and current card API
- Cardholder identity checks, spending controls, fees and limits
- Funding timing, refunds, disputes and behavior when the balance or allowance is insufficient

## Build the card workflow

1. **Obtain program access.** Confirm the actual funding token and supported environment before building a customer-facing card flow.
2. **Onboard the cardholder.** Complete the program's required checks and store the returned customer and cardholder references separately.
3. **Connect the funding balance.** Reuse [Creating OUSD wallets](/guides/create-wallets/) and [Managing OUSD custody](/guides/custody-ousd/) to define who controls it. Confirm any onchain spending permission, including its spender and amount limit.
4. **Create and manage cards with the approved integration.** Use the current product documentation and account-specific parameters. A generic stablecoin example is not an OUSD recipe.
5. **Process the full lifecycle.** Reconcile authorizations, captures, reversals and refunds against the funding ledger without counting one purchase twice.

## Example: an authorization that changes

In an illustrative wallet app, a merchant first authorizes a purchase, later captures the final amount, and may refund it. Retain separate event references and reconcile each balance effect according to the program's funding timing.

Test insufficient funds, insufficient allowance and interrupted requests alongside the happy path. The shared [events and reconciliation guide](/guides/integration-architecture/) covers retry handling. Provider-specific OUSD card-funding details still need confirmation in the paths below.

## References and review

The [provider directory](/ecosystem/) and activity sections below link to the official product documentation behind each route. These general workflows are application-design guidance; provider-specific steps, eligibility and asset limits are in those profiles.

Documentation reviewed October 11, 2026. Modified October 12, 2026. No live integration independently tested.

## Available providers

<!-- task-providers:start -->
- [Bridge](/providers/bridge/#issue-cards): Bridge wallet-funded cards use Stripe Issuing; current OUSD card funding still needs confirmation.
- [Stripe](/providers/stripe/#issue-cards): Stripe’s customer Issuing card programs are in private preview; confirm OUSD funding for the chosen integration.
<!-- task-providers:end -->
