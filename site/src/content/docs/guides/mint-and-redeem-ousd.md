---
title: "Minting and redeeming OUSD"
description: "Use an approved issuer or service flow to acquire or redeem OUSD, with exact deposit instructions and settlement checks."
modifiedAt: '2026-11-09'
reviewedAt: '2026-10-11'
draft: false
sources:
  - id: bridge-live
    reviewedAt: '2026-10-11'
    claim: "Bridge Building Inc. is the current OUSD issuer."
  - id: bridge-mint-burn
    reviewedAt: '2026-10-11'
    claim: "Bridge handles minting and burning within its issuance flow; a holder does not receive mint authority."
  - id: bridge-transfers
    reviewedAt: '2026-10-11'
    claim: "The Transfer guide gives an ACH USD to OUSD on Tempo request and explains returned deposit instructions; other examples contain conflicting networks."
  - id: bridge-ousd
    reviewedAt: '2026-10-11'
    claim: "OUSD is supported on Base, Ethereum, Solana and Tempo and excludes the EEA and other restricted jurisdictions."
  - id: visa-product
    reviewedAt: '2026-10-11'
    claim: "Visa offers limited beta portal access, with volume and geographic constraints; API access is coming soon."
  - id: bridge-sandbox
    reviewedAt: '2026-10-12'
    claim: "Bridge Sandbox supports simulated payment webhooks without live bank or blockchain transactions."
  - id: bridge-wallet-offramp
    reviewedAt: '2026-10-11'
    claim: "The wallet off-ramp flow requires a verified customer, funded wallet and external bank account; its USDB sample is not an OUSD-specific recipe."
related: [convert-ousd, create-wallets, integration-architecture]
---

Mint or redeem OUSD when a product needs to move between an approved funding asset and issuer-created OUSD. For example, a treasury application could turn incoming bank funds into OUSD for working capital, then redeem OUSD when the business needs bank money again.

## Understand issuance and redemption

[Minting](/guides/concepts/#minting-and-redemption) creates tokens through an authorized issuer flow; redemption retires them as part of returning value. Holding OUSD does not give an application permission to mint tokens or guarantee access to every redemption service.

Buying existing OUSD or exchanging another stablecoin for it is a separate [conversion](/guides/convert-ousd/) task. A token burn by itself is not evidence of bank [settlement](/guides/concepts/#finality-and-settlement).

## Define the requirements

- An approved issuer or service relationship for the business and customer
- The funding currency, destination account or wallet, and supported OUSD network
- Fees, minimums, volume limits, geographic restrictions and settlement timing
- Deposit instructions, customer references and evidence needed to reconcile both directions

## Build the mint and redeem workflow

1. **Complete onboarding for the direction you need.** Confirm issuance and redemption separately; access to one does not establish the other.
2. **Describe the source and destination precisely.** For minting, identify the approved funding source and OUSD destination. For redemption, identify the accepted OUSD route and the destination to be paid.
3. **Create the service request.** Save its reference and the returned instructions. Use the current API or portal available to your account.
4. **Fund only as instructed.** Check the amount, currency, destination and required reference. A [token contract address](/guides/concepts/#token-address) identifies the asset; it is not a customer's deposit address.
5. **Confirm both sides.** Reconcile the source debit, any fees, provider state and destination credit before completing the request in your ledger.

## Example: bank funds to a wallet and back

An illustrative mint flow is an approved bank deposit, issuer processing, then an OUSD wallet credit. The reverse flow needs its own approved OUSD deposit instructions and evidence of the eventual bank credit. Keep the two requests and their settlement records separate.

Use [Networks and contracts](/networks/) to verify the asset and [payment events and reconciliation](/guides/integration-architecture/) to handle delays. Check what the provider's [sandbox](/guides/concepts/#mainnet-testnet-and-sandbox) actually simulates before treating a successful test as evidence of live issuance.

## References and review

The [provider directory](/ecosystem/) and activity sections below link to the official product documentation behind each route. These general workflows are application-design guidance; provider-specific steps, eligibility and asset limits are in those profiles.

Documentation reviewed October 11, 2026. Modified November 9, 2026. No live integration independently tested.

## Available providers

<!-- task-providers:start -->
- [Bridge](/providers/bridge/#mint-and-redeem-ousd): Open Standard network partners can arrange direct OUSD access through Bridge.
- [BVNK](/providers/bvnk/#mint-and-redeem-ousd): Wholesale users can mint and burn OUSD at 1:1 against USD.
- [Mastercard](/providers/mastercard/#mint-and-redeem-ousd): Mastercard documents wholesale OUSD minting and redemption for exchanges, distributors and institutions.
- [Visa](/providers/visa/#mint-and-redeem-ousd): Eligible VSP clients can mint and redeem OUSD through the portal.
<!-- task-providers:end -->
