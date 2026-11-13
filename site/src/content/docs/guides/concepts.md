---
title: "Concepts"
description: "Blockchain, networks, stablecoins, wallets, minting, reserves, and payment integration terms explained for OUSD beginners."
modifiedAt: '2026-10-12'
reviewedAt: '2026-10-11'
draft: false
sources:
  - id: circle-cctp
    reviewedAt: '2026-10-11'
    claim: Circle documents CCTP burn-and-mint transfers of native USDC; this is an example, not an OUSD capability.
  - id: ethereum-intro
    reviewedAt: '2026-10-11'
    claim: "Blockchain records, network agreement, and transactions."
  - id: ethereum-networks
    reviewedAt: '2026-10-11'
    claim: "Separate network histories, mainnet and testnet environments."
  - id: ethereum-contracts
    reviewedAt: '2026-10-11'
    claim: "Smart contracts are programs deployed and run on a blockchain."
  - id: ethereum-erc20
    reviewedAt: '2026-10-11'
    claim: "Token-contract identifiers, balances, transfers and decimal display units."
  - id: solana-tokens
    reviewedAt: '2026-10-11'
    claim: "Mint accounts define tokens; separate token accounts hold balances."
  - id: ethereum-bridges
    reviewedAt: '2026-10-11'
    claim: "Bridges connect separate blockchain systems and introduce bridge-specific risks."
  - id: circle-bridged
    reviewedAt: '2026-10-11'
    claim: "Native and bridged USDC illustrate different issuer and backing arrangements, not OUSD support."
  - id: boe-money
    reviewedAt: '2026-10-11'
    claim: "Fiat money includes bank deposits and physical money."
  - id: ethereum-stablecoins
    reviewedAt: '2026-10-11'
    claim: "Stablecoins target a reference value; fiat-backed tokens use reserves and issuer redemption."
  - id: bridge-live
    reviewedAt: '2026-10-11'
    claim: "Bridge Building Inc. currently issues OUSD; the proposed national trust bank does not."
  - id: aicpa-stablecoins
    reviewedAt: '2026-10-11'
    claim: "Reserve assurance concerns specified information and criteria; report scope and date matter."
  - id: bridge-mint-burn
    reviewedAt: '2026-10-11'
    claim: "Generic stablecoin issuance and redemption flows, not proof of a user's OUSD eligibility."
  - id: ethereum-wallets
    reviewedAt: '2026-10-11'
    claim: "Wallets provide account access and transaction authorization; keys control access."
  - id: bridge-wallets
    reviewedAt: '2026-10-11'
    claim: "Provider-managed custody is distinct from self-custody and issuer account access."
  - id: bridge-payment-tracking
    reviewedAt: '2026-10-11'
    claim: "Identifiers connect provider operations, chain transactions and payment records for reconciliation."
  - id: ethereum-gas
    reviewedAt: '2026-10-11'
    claim: "Gas measures execution work; Ethereum transaction fees are paid in ETH."
  - id: solana-fees
    reviewedAt: '2026-10-11'
    claim: "Solana transaction fees are denominated in SOL."
  - id: solana-commitment
    reviewedAt: '2026-10-11'
    claim: "Processed, confirmed and finalized are distinct commitment levels."
  - id: bridge-transfer-states
    reviewedAt: '2026-10-11'
    claim: "Payment submission and processing are distinct provider states."
  - id: bridge-overview
    reviewedAt: '2026-10-11'
    claim: "APIs expose provider-specific operations and are distinct from generic token capabilities."
  - id: stripe-events
    reviewedAt: '2026-10-11'
    claim: "Webhooks need signature verification and handling of duplicate or out-of-order delivery."
  - id: stripe-idempotency
    reviewedAt: '2026-10-11'
    claim: "Idempotency keys distinguish retries of the same operation within provider-specific rules."
  - id: bridge-sandbox
    reviewedAt: '2026-10-12'
    claim: "Bridge Sandbox supports simulated payment webhooks without live bank or blockchain transactions."
related: [what-is-open-usd, integration-architecture]
---

**A stablecoin is the asset; a blockchain network records its transfers; a wallet or provider lets you use it.** These are the foundations for understanding Open Standard's OUSD.

The definitions below describe general concepts. For OUSD's actual deployments and service access, use [Networks and contracts](/networks/) and [Integrating OUSD](/start/). Examples illustrate the concepts; they are not tested OUSD payment flows.

## Blockchains and tokens

### Blockchain

A blockchain is a shared record updated by a network of computers. Updates are grouped into linked blocks, and the network follows rules for agreeing which updates are valid. A token transfer changes the balances recorded by that system. [Ethereum introduction](https://ethereum.org/developers/docs/intro-to-ethereum/).

**Why it matters:** the blockchain can show token activity. It does not, by itself, verify the money or other assets held outside the chain to back a stablecoin.

### Network

A network is the particular blockchain system you use, such as Ethereum or Solana. Networks maintain distinct balances and transaction histories; the same-looking address does not mean a balance exists on every network. [Ethereum networks](https://ethereum.org/developers/docs/networks/).

**Example:** “Receive 100 OUSD” needs a network as well as an address. Check that the receiving wallet or service supports that exact token on that network.

### Smart contract

A smart contract is a program deployed on a blockchain. Token contracts can keep track of balances and enforce transfer rules. Calling a contract means asking the network to run its code, not signing a conventional paper contract. [Ethereum smart contracts](https://ethereum.org/developers/docs/smart-contracts/).

**Why it matters:** a token's features depend on its actual contract and permissions. “Programmable money” does not mean every holder can change those rules.

### Token address

A token address identifies a particular token on a particular network. On Ethereum-style networks, it is the address of the token contract. A name or ticker is only a label and can be reused by unrelated tokens. [ERC-20 token contracts](https://ethereum.org/developers/docs/standards/tokens/erc-20/).

**For OUSD:** compare the network and full identifier with the [official address reference](/networks/). A token's contract or mint address is not your personal receiving address. Do not send funds directly to it.

### Mint account

On Solana, a mint account is the record identifying a token, including its supply and decimal precision. Separate token accounts hold balances of that token. The shared token program applies the rules. Here, “mint” names an account; it does not mean permission to create tokens. [Solana tokens](https://solana.com/docs/tokens).

**Example:** OUSD's Solana mint address answers “which token?” A recipient's token account answers “where is this holder's balance?”

### Decimals

Decimals specify how an integer token amount is displayed in human-readable units. If an illustrative token has six decimals, 1,500,000 smallest units represent 1.5 tokens. This example does not assert OUSD's precision. [ERC-20 decimal units](https://ethereum.org/developers/docs/standards/tokens/erc-20/).

**Why it matters:** read the documented precision for the actual token or API. Store exact amounts so rounding does not change a payment.

### Native and bridged tokens

A natively issued stablecoin is issued directly on that network. A bridged representation can instead depend on tokens held elsewhere and a system connecting the chains. Some cross-chain systems burn and mint native tokens rather than create a wrapped representation, as [Circle documents for CCTP](https://www.circle.com/cross-chain-transfer-protocol). [Ethereum bridges](https://ethereum.org/bridges/), [Circle's native and bridged USDC explanation](https://www.circle.com/bridged-usdc).

**Why it matters:** similar names can hide different identifiers, support, and risks. Native OUSD on two networks does not prove a supported route between them. “Native stablecoin” also does not mean the network's fee currency, such as ETH or SOL.

## Dollars and backing

### Fiat currency

Fiat currency means conventional money such as US dollars or pounds sterling. It includes money in bank accounts, not just notes and coins. [Bank of England: What is money?](https://www.bankofengland.co.uk/explainers/what-is-money.).

**Example:** a USD bank payment and an OUSD transfer use different systems, even when both amounts refer to dollars.

### Stablecoin

A stablecoin is a digital token designed to track a reference value. A **peg** is that target relationship, for example one token to one US dollar. It is a target, not a promise that every market trade always happens at exactly $1. [Ethereum stablecoins](https://ethereum.org/stablecoins/).

**Why it matters:** dollar pricing is easier to interpret, but backing, redemption rights, market price, and fees still need separate checks. OUSD is a stablecoin; it is not the US dollar itself.

### Issuer

The issuer is the organization responsible for creating a stablecoin and its issuance obligations. A wallet, exchange, or payment provider may give you access without being the issuer.

**For OUSD:** the issuer is Bridge Building Inc. Open Standard created OUSD. Bridge's proposed national trust bank is a separate entity and does not currently issue it. [Bridge's September 30, 2026 announcement](https://withbridge.com/blog/ousd-is-live-issued-by-bridge).

### Reserves

Reserves are assets held to support a stablecoin issuer's ability to meet redemptions. Depending on the token, these can include cash and other assets. “Dollar-backed” does not necessarily mean cash-only backing. [Ethereum's fiat-backed stablecoin explanation](https://ethereum.org/stablecoins/).

**Why it matters:** look at the assets, who holds them, and the redemption terms. The [OUSD introduction](/guides/what-is-open-usd/#governance-and-reserves) links to its announced reserve arrangements; this site has not audited those reserves.

### Attestation

A reserve attestation is assurance work on specified information, such as an issuer's reported tokens outstanding and backing assets, assessed against stated criteria. It is not automatically an audit of the whole company or a guarantee of future reserves. [AICPA stablecoin reporting criteria](https://www.aicpa-cima.com/news/article/aicpa-publishes-comprehensive-criteria-for-reporting-on-stablecoins).

**Why it matters:** read the report's date, scope, criteria, and conclusion. A link to a reporting portal alone does not establish what a particular report verified.

### Minting and redemption

**Minting** creates token units. **Burning** removes units from supply. **Redemption** exchanges tokens through an authorized issuer or service for the corresponding value, subject to its terms. Buying existing tokens from another holder is not necessarily minting. [Bridge's minting and burning flow](https://apidocs.bridge.xyz/platform/issuance/minting-and-burning).

**Example:** an issuer may mint after receiving funds and burn tokens during redemption. Holding OUSD does not grant issuance permission or establish direct redemption eligibility. Use a provider's documented flow; sending tokens to an arbitrary address is not redemption.

## Holding and moving tokens

### Wallets and custody

A wallet is a tool for viewing balances and authorizing transactions. The balances are recorded on the blockchain. Private keys provide transaction authority and must remain secret. **Custody** describes who controls that authority: you, a service, or a defined shared-control arrangement. [Ethereum wallets](https://ethereum.org/wallets/), [Bridge's custodial wallets](https://apidocs.bridge.xyz/platform/wallets/overview).

**Why it matters:** understand who can approve transfers and how access is recovered before choosing a wallet. Creating a wallet does not create an issuer account.

### Transactions and explorers

A transaction requests a change to the blockchain, such as a token transfer. Its transaction ID lets you find the record. A block explorer is a website for inspecting those records. [Ethereum transactions](https://ethereum.org/developers/docs/intro-to-ethereum/).

**Example:** keep the network and transaction ID beside the payment record. Inspect the outcome, token, recipient, and amount; an ID alone does not prove the intended payment completed. [Bridge payment tracking](https://apidocs.bridge.xyz/platform/orchestration/more/payment-tracking).

### Network fees

Network fees pay for transaction processing. On Ethereum, **gas** measures the work performed and fees are paid in ETH. Solana transaction fees are paid in SOL. A service may handle fee payment for its users. [Ethereum gas](https://ethereum.org/developers/docs/gas/), [Solana fees](https://solana.com/docs/core/fees).

**Why it matters:** a zero issuer minting fee does not make every transfer free. Check who pays network and service fees, in which asset, including when an operation fails.

### Finality and settlement

**Finality** is a network's state in which a transaction is treated as irreversible under its consensus rules. Confirmation levels and timing differ; Solana, for example, distinguishes processed, confirmed, and finalized. [Solana commitment levels](https://solana.com/docs/rpc#configuring-state-commitment).

**Settlement** concerns completion of the payment obligation. Blockchain finality, a provider crediting a recipient, and funds reaching a bank account are different milestones. A submitted request is not proof of all three. [Bridge transfer states](https://apidocs.bridge.xyz/platform/orchestration/transfers/transfer-states).

**Why it matters:** decide which evidence your application needs before marking an invoice paid.

## Building an integration

### API

An application programming interface (API) is a structured way for software to request information or actions from another system. A provider might expose balance lookups or transfer creation through one. [Bridge platform overview](https://apidocs.bridge.xyz/get-started/introduction/overview).

**Why it matters:** an API belongs to a particular service, with its own permissions and supported operations. A token deployment or partner announcement does not establish API access for your account.

### Webhook

A webhook is a notification a service sends to your application when an event occurs. It can tell your app that a payment changed state. Notifications can arrive more than once or out of order; verify their authenticity before using them. [Stripe webhooks](https://docs.stripe.com/webhooks).

**Example:** receive the event, then apply the provider's documented state and retry rules. The event's meaning matters more than when it arrived.

### Idempotency

Idempotency makes retrying the same operation safe from accidental duplicate effects. An idempotency key lets a provider recognize repeated requests, within that provider's documented rules. [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests).

**Example:** after a transfer request times out, investigate the existing operation and reuse the appropriate key for a retry. A new key can look like a new transfer.

### Reconciliation

Reconciliation means matching records from different systems and investigating differences. For a payment, that can mean matching your invoice and ledger with the provider transfer, blockchain transaction, fees, and bank records. [Bridge payment tracking](https://apidocs.bridge.xyz/platform/orchestration/more/payment-tracking).

**Why it matters:** matching the amount alone is not enough. Preserve identifiers and unresolved mismatches. The [payment architecture guide](/guides/integration-architecture/) shows an illustrative design.

### Mainnet, testnet, and sandbox

**Mainnet** is a production blockchain. A **testnet** is a separate blockchain for testing. A **sandbox** is a provider's test environment; it may simulate activity without using a blockchain. [Ethereum networks](https://ethereum.org/developers/docs/networks/).

**For OUSD:** a mainnet deployment does not establish a test token or faucet. Bridge Sandbox supports simulated payment activity and associated webhooks, without submitting transactions to live banks or blockchains. Do not assume a blockchain testnet or every OUSD route. Passing a simulation therefore does not prove OUSD settlement. [Bridge sandbox limits](https://apidocs.bridge.xyz/get-started/introduction/quick-start/setting-up-sandbox).

## Continue reading

- [What is OUSD?](/guides/what-is-open-usd/) for the actual issuer, governance, and reserve references
- [Networks and contracts](/networks/) to identify the correct token
- [Integrating OUSD](/start/) for provider-specific access

Page and linked sources reviewed October 11, 2026. Modified October 12, 2026. The AICPA criteria announcement was published March 6, 2025; Bridge's launch announcement was published September 30, 2026. Other source publication dates were not identified; documentation update dates are not treated as original publication dates. No payment integration or reserve report was independently tested or audited for this guide.
