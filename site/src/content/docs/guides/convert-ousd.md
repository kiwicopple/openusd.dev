---
title: "Converting OUSD"
description: "Exchange supported assets into or out of OUSD, distinguish conversion from bridging, and migrate balances without losing payment records."
modifiedAt: '2026-11-09'
reviewedAt: '2026-10-11'
draft: false
sources:
  - id: bridge-ousd-migration
    reviewedAt: '2026-10-11'
    claim: "Bridge documents stablecoin-to-OUSD migration, reverse conversion, and separate same-chain and cross-chain flows."
  - id: bridge-ousd
    reviewedAt: '2026-10-11'
    claim: "The OUSD-specific network list establishes Base, Ethereum, Solana and Tempo, rather than extra networks in generic migration examples."
  - id: stripe-convert-funds
    reviewedAt: '2026-10-11'
    claim: "Stripe documents financial-account currency conversion in the Dashboard, with API access in private preview."
  - id: coinbase-ousd-buy
    reviewedAt: '2026-10-11'
    claim: "Coinbase documents US retail buying access, not universal business or institutional conversion support."
  - id: coinbase-ousd
    reviewedAt: '2026-10-11'
    claim: "Coinbase lists Open Standard OUSD with matching official asset identifiers."
related: [mint-and-redeem-ousd, hold-ousd, integration-architecture]
---

Convert OUSD when a product needs to exchange it for another supported asset, or turn existing funds into OUSD. For example, a treasury app could convert a supported fiat balance into OUSD before paying suppliers, then reconcile the source debit and destination credit.

## Separate conversion from movement

Conversion changes the asset held. A transfer changes where funds are held; a cross-chain flow may do both. Native OUSD on two networks does not prove that a provider offers a direct [bridge](/guides/concepts/#native-and-bridged-tokens) between them.

An exchange trade is also different from [minting or redemption](/guides/mint-and-redeem-ousd/). Use the operation that matches your account and actual source of funds.

## Define the requirements

- Source asset and network, destination asset and network, and ownership on each side
- Exact supported pair and direction, eligibility, minimums, fees and any quoted rate
- Quote expiry, required funding instructions and expected settlement timing
- How pending transfers or late deposits affect a larger balance migration

## Build the conversion workflow

1. **Confirm the pair and route.** Verify both sides against the provider's current product support. Use [Networks and contracts](/networks/) when either side is onchain.
2. **Prepare the destination.** Establish the receiving account or wallet before initiating a conversion that moves funds there.
3. **Read available funds and review the quote.** Store [exact amounts](/guides/concepts/#decimals), fees and the quote reference where the product supplies one. A dollar-equivalent display value is not an executable quote.
4. **Submit the approved operation once.** Keep its reference and retry identity. Retrieve an uncertain result before attempting another conversion.
5. **Reconcile the resulting asset.** Match the source debit, fees and destination credit before marking the new balance spendable.

## Example: changing a product's storage asset

An illustrative migration includes more than converting the current balance: pause new activity, resolve in-flight work, change approved deposit and payout routes, verify the converted balance, then resume. Decide how late deposits in the former asset will be handled; a label change does not convert them.

Provider migration guides define which route changes are actually required. Use [Holding OUSD](/guides/hold-ousd/) for the resulting balance and the shared [reconciliation guide](/guides/integration-architecture/) for delayed or failed conversion events.

## References and review

The [provider directory](/ecosystem/) and activity sections below link to the official product documentation behind each route. These general workflows are application-design guidance; provider-specific steps, eligibility and asset limits are in those profiles.

Documentation reviewed October 11, 2026. Modified November 9, 2026. No live integration independently tested.

## Available providers

<!-- task-providers:start -->
- [Bridge](/providers/bridge/#convert-ousd): Bridge documents conversion into and out of OUSD using approved transfer routes.
- [BVNK](/providers/bvnk/#convert-ousd): BVNK offers OUSD conversion through its platform and API.
- [Coinbase](/providers/coinbase/#convert-ousd): Coinbase documents a US exchange purchase flow; institutional 1:1 conversion is a separate listed path.
- [Mastercard](/providers/mastercard/#convert-ousd): Open Standard lists Mastercard for buying, selling and swaps through API or portal access.
- [Stripe](/providers/stripe/#convert-ousd): Which conversion is available? Treasury converts OUSD to or from supported fiat balances in the same eligible financial account. The Dashboard flow is documented; the general currency-conversion API is private preview.
<!-- task-providers:end -->
