---
title: "Creating OUSD wallets"
description: "Provision an OUSD-capable wallet, connect it to the correct customer and network, and keep wallet creation separate from funding."
modifiedAt: '2026-11-09'
reviewedAt: '2026-10-11'
draft: false
sources:
  - id: privy-custodial-setup
    reviewedAt: '2026-10-11'
    claim: "Privy custodial wallets require Enterprise access, app enablement, Bridge integration registration and beneficiary KYC."
  - id: privy-custodial-create
    reviewedAt: '2026-10-11'
    claim: "Wallet creation includes provider, provider user, chain, owner and optional policy configuration."
  - id: privy-custodial-send
    reviewedAt: '2026-10-11'
    claim: "Privy documents an OUSD-on-Tempo transfer example; Base and Solana appear in a separate supported-chain list, requiring exact route confirmation."
  - id: bridge-wallets
    reviewedAt: '2026-10-11'
    claim: "Bridge also provides custodial wallets directly, with OUSD support subject to fund-flow approval."
  - id: privy-wallets
    reviewedAt: '2026-10-11'
    claim: "User-owned and application-controlled wallet models require distinct control decisions."
  - id: privy-create-wallet
    reviewedAt: '2026-10-11'
    claim: "Privy documents creation flows for Ethereum and Solana wallets; provisioning alone does not verify OUSD payment services."
related: [custody-ousd, hold-ousd, integration-architecture]
---

Create wallets when users need an address to receive funds or an account that can authorize onchain transactions. For example, a marketplace could provision a wallet for each seller, associate incoming OUSD with that seller, and later let them request withdrawals.

Wallet creation establishes an identity and control arrangement. Funding the wallet and enabling payment services are separate steps.

## Choose who controls the wallet

A [wallet](/guides/concepts/#wallets-and-custody) may be controlled by the user, by your application, or through a custodian. Define who can sign or approve transactions, how access is recovered, and which responsibilities remain with your application.

A wallet address, an internal user ID, a provider customer ID and the OUSD [token identifier](/guides/concepts/#token-address) represent different things. Do not use them interchangeably.

## Define the requirements

- The owner or beneficiary and any required identity checks
- The custody model, signing authority, recovery process and spending policies
- The exact chain, accepted OUSD token and provider-supported deposit route
- How repeated or interrupted provisioning requests avoid duplicate wallets

## Build the provisioning workflow

1. **Enable the chosen wallet product.** Complete account setup and any beneficiary onboarding before making creation requests.
2. **Bind the beneficiary.** Map the provider's customer reference to your authenticated application user on the server.
3. **Select the chain and authority.** Configure the owner and supported authorization policies before funding.
4. **Create the wallet.** Follow the selected product's documented request. Save the wallet ID, returned address, chain, owner and customer reference.
5. **Verify access boundaries.** Test that one user cannot read or spend another user's funds, and check the behavior of interrupted requests.
6. **Add funding as a separate flow.** Use the service's accepted route and the official identifiers in [Networks and contracts](/networks/). Never send money to the token contract itself.

## Example: one seller, several identities

An illustrative seller record links your internal seller ID to the custodian's customer ID and the wallet service's wallet ID. The receiving address belongs to that wallet; the OUSD identifier belongs to the asset on its network. Keep transfer authority alongside the wallet record.

Use [Managing OUSD custody](/guides/custody-ousd/) for operational controls and [events and reconciliation](/guides/integration-architecture/) when adding transfers. Generic chain compatibility alone does not verify a provider's OUSD deposit, custody or redemption service.

## References and review

The [provider directory](/ecosystem/) and activity sections below link to the official product documentation behind each route. These general workflows are application-design guidance; provider-specific steps, eligibility and asset limits are in those profiles.

Documentation reviewed October 11, 2026. Modified November 9, 2026. No live integration independently tested.

## Available providers

<!-- task-providers:start -->
- [Bridge](/providers/bridge/#create-wallets): Bridge provides a direct custodial-wallet API with explicit OUSD support on four networks.
- [BVNK](/providers/bvnk/#create-wallets): Existing BVNK customers can open a network-specific OUSD wallet in the portal; embedded wallets are also offered.
- [Coinbase](/providers/coinbase/#create-wallets): Open Standard lists Coinbase as a wallet integration path but does not identify an OUSD wallet API.
- [Mastercard](/providers/mastercard/#create-wallets): Mastercard is listed as an OUSD wallet integration path; product-level provisioning details still need confirmation.
- [Privy](/providers/privy/#create-wallets): Privy offers embedded wallets and a separate Bridge-backed custodial route with documented OUSD transfers.
- [Visa](/providers/visa/#create-wallets): VSP offers Wallet-as-a-Service or a connection to your existing wallet provider.
<!-- task-providers:end -->
