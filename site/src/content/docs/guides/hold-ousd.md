---
title: "Holding OUSD"
description: "Enable an OUSD business balance, choose a supported funding route, and distinguish stored OUSD from the asset transferred."
modifiedAt: '2026-11-09'
reviewedAt: '2026-10-11'
draft: false
sources:
  - id: stripe-treasury
    reviewedAt: '2026-10-11'
    claim: "OUSD is a supported financial-account storage currency; availability is account- and country-dependent."
  - id: stripe-store-funds
    reviewedAt: '2026-10-11'
    claim: "A financial account uses one stablecoin storage currency, with Bridge custody."
  - id: stripe-add-funds
    reviewedAt: '2026-10-11'
    claim: "Crypto funding instructions use USDC or USDC.e on Tempo, not direct OUSD deposits."
  - id: stripe-convert-funds
    reviewedAt: '2026-10-11'
    claim: "Dashboard conversion is documented; the conversion API is private preview."
related: [create-wallets, custody-ousd, convert-ousd, integration-architecture]
---

Hold OUSD when your product needs a dollar-denominated balance that stays available between payments. For example, a business cash-management app could retain funds in OUSD, show the spendable balance, and use it later for supplier payouts.

The balance may live in a managed financial account or an onchain wallet. Choose that model before building the balance screen.

## Understand the balance

A [stablecoin](/guides/concepts/#stablecoin) balance is an amount of a particular asset. Keep the asset held, the asset deposited, and the asset paid out as separate fields: a service may convert between them.

[Custody](/guides/concepts/#wallets-and-custody) determines who safeguards the funds and authorizes movement. Use [Creating OUSD wallets](/guides/create-wallets/) if each customer needs an address; use [Managing OUSD custody](/guides/custody-ousd/) to choose the control arrangement.

## Define the requirements

- Whose money is held: the business's own funds or a named customer's funds
- Whether you need an account balance, an onchain wallet, or both
- Approved business and beneficiary countries, funding methods and withdrawal routes
- Fees, minimum amounts, access restrictions and the distinction between pending and spendable funds

## Build the holding workflow

1. **Establish the owner and account.** Complete the chosen service's onboarding and bind its account or wallet ID to the correct owner in your application.
2. **Enable the asset and funding route.** Confirm that the resulting balance is OUSD. For an onchain deposit, verify the exact [network and token address](/networks/) accepted by the service.
3. **Fund using the issued instructions.** Keep the deposit asset, amount and reference. An OUSD storage setting does not establish that an address accepts direct OUSD deposits.
4. **Confirm the credit.** Record fees and any conversion separately. Update spendable funds only when the service reports the relevant credit as available.
5. **Reconcile and expose the balance.** Compare your records with the provider or chain and retain the original transaction references. Use the shared [events and reconciliation workflow](/guides/integration-architecture/).

## Example: a business cash account

An illustrative account record separates the funding deposit, the conversion into OUSD, the available OUSD balance, and any amount reserved for a pending payout. That prevents a bank debit or an unconfirmed deposit from being displayed as spendable OUSD.

When funds leave, use [Sending payouts from OUSD](/guides/send-payouts/) to choose what the recipient receives.

## References and review

The [provider directory](/ecosystem/) and activity sections below link to the official product documentation behind each route. These general workflows are application-design guidance; provider-specific steps, eligibility and asset limits are in those profiles.

Documentation reviewed October 11, 2026. Modified November 9, 2026. No live integration independently tested.

## Available providers

<!-- task-providers:start -->
- [Bridge](/providers/bridge/#hold-ousd): Bridge custodial wallets explicitly support OUSD on Base, Ethereum, Solana and Tempo.
- [BVNK](/providers/bvnk/#hold-ousd): BVNK offers OUSD storage through its platform and API.
- [Coinbase](/providers/coinbase/#hold-ousd): Coinbase documents buying and managing Open USD on its US exchange; business holding arrangements need confirmation.
- [Privy](/providers/privy/#hold-ousd): Privy can expose a Bridge-custodied OUSD wallet and its balance inside an application.
- [Stripe](/providers/stripe/#hold-ousd): Can an account hold OUSD? An eligible Treasury financial account can store OUSD, with Bridge custody. It holds one stablecoin storage currency at a time.
- [Visa](/providers/visa/#hold-ousd): VSP supports OUSD balances for selected institutional clients in beta.
<!-- task-providers:end -->
