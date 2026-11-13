---
title: "Managing OUSD custody"
description: "Choose who controls OUSD transfers, check custodial access, and define withdrawal, recovery and reconciliation controls."
modifiedAt: '2026-10-12'
reviewedAt: '2026-10-11'
draft: false
sources:
  - id: bridge-wallets
    reviewedAt: '2026-10-11'
    claim: "Bridge offers OUSD custody on Base, Ethereum, Solana and Tempo, subject to legal and compliance approval, geography limits, and cent-denominated wallet accounting."
  - id: bridge-routes
    reviewedAt: '2026-10-11'
    claim: "Bridge payment-route restrictions limit EEA users to USDC and EURC."
  - id: privy-custodial-setup
    reviewedAt: '2026-10-11'
    claim: "Privy custodial-wallet setup uses Bridge as custodian and requires Enterprise enablement and beneficiary onboarding."
  - id: privy-custodial-lifecycle
    reviewedAt: '2026-10-11'
    claim: "Privy documents asynchronous custodial actions and warns failures may include partial onchain effects."
  - id: os-integrate
    reviewedAt: '2026-10-11'
    claim: "Open Standard lists Coinbase for custody but does not establish an account-specific institutional product."
  - id: coinbase-prime-support
    reviewedAt: '2026-10-11'
    claim: "Coinbase Prime says exact supported assets depend on the account and geography and should be checked in the Prime UI."
related: [create-wallets, hold-ousd, integration-architecture]
---

Plan custody when your product holds funds over time and must decide who can move or recover them. For example, a business treasury app might require one employee to request an OUSD withdrawal and another to approve it, with a recovery process when an administrator leaves.

The control arrangement belongs in the product design before deposits are enabled.

## Understand the custody arrangement

[Custody](/guides/concepts/#wallets-and-custody) covers safekeeping and control of funds. A hosted wallet interface does not by itself tell you who is the custodian or who holds signing authority. Ask those questions separately from [Creating OUSD wallets](/guides/create-wallets/), which covers provisioning.

Business-owned treasury funds and customer-owned funds also need distinct ownership records and approved fund flows.

## Define the requirements

- The legal owner, named custodian where applicable, and account or wallet model
- Business and beneficiary eligibility, including country and asset restrictions
- Authorized roles, approval limits, destination controls and credential storage
- Recovery, administrator replacement, emergency suspension and support escalation
- Balance precision, fees, statements and the records needed for reconciliation

These are requirements to resolve with the selected service, not a claim that every provider offers every control.

## Build the custody workflow

1. **Approve the fund flow.** Confirm whose funds are held, for what purpose, and under which product and custody arrangement.
2. **Provision the correct owner and wallet.** Bind each provider identity to your own ownership record; do not pool customer identities by accident.
3. **Configure and test authority.** Exercise allowed and denied withdrawals, administrator changes and the available recovery procedure before accepting funds.
4. **Validate deposits.** Use only the exact asset and network the service accepts. Check the official token in [Networks and contracts](/networks/).
5. **Control withdrawals.** Authenticate the request, apply approvals and reserve funds before submission. Retain a complete audit trail.
6. **Reconcile the outcome.** Check provider or chain state before recording final debits or releasing reservations. A failure can require investigation rather than an immediate retry.

## Example: a two-person withdrawal

In an illustrative business workflow, an operator creates a withdrawal request and a separate approver authorizes it. Your application then submits it once and tracks the final result. Confirm whether the selected provider enforces that policy itself or your application must do so.

Keep credentials and signing material out of browser code and ordinary logs. Use [payment events and reconciliation](/guides/integration-architecture/) for reliable records and [Sending payouts from OUSD](/guides/send-payouts/) for the destination flow.

## References and review

The [provider directory](/ecosystem/) and activity sections below link to the official product documentation behind each route. These general workflows are application-design guidance; provider-specific steps, eligibility and asset limits are in those profiles.

Documentation reviewed October 11, 2026. Modified October 12, 2026. No live integration independently tested.

## Available providers

<!-- task-providers:start -->
- [Bridge](/providers/bridge/#custody-ousd): Bridge offers custodial OUSD wallets, subject to approved production fund flows and geographic restrictions.
- [Coinbase](/providers/coinbase/#custody-ousd): Open Standard lists Coinbase custody; exact OUSD institutional support depends on the chosen account.
- [Privy](/providers/privy/#custody-ousd): Bridge is the custodian for Privy custodial wallets; Privy configures who may request actions.
- [Stripe](/providers/stripe/#custody-ousd): Bridge custodies OUSD held in Stripe Treasury financial accounts.
- [Visa](/providers/visa/#custody-ousd): Visa supplies key-management technology for Wallet-as-a-Service; the client remains its own custodian.
<!-- task-providers:end -->
