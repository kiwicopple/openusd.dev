import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import aeo from 'astro-aeo';
import {contentDates} from './src/lib/content-dates.ts';
const modifiedDates=contentDates();
export default defineConfig({
  vite: { plugins: [tailwindcss()] },
  site: 'https://openusd.dev',
  output: 'static',
  trailingSlash: 'always',
  integrations: [react(), sitemap({ serialize: item => { const lastmod=modifiedDates[new URL(item.url).pathname]; return lastmod?{...item,lastmod}:item; }, filter: url => !['/search', '/404', '/status', '/guides', '/contribute'].includes(new URL(url).pathname.replace(/\/$/, '')) && !new URL(url).pathname.endsWith('.json') && !new URL(url).pathname.endsWith('.txt') }), starlight({
    pagination: false,
    routeMiddleware: './src/routeData.ts',
    components: {
      Footer: './src/components/overrides/Footer.astro',
      Header: './src/components/overrides/Header.astro',
      SocialIcons: './src/components/overrides/HeaderLinks.astro',
      Sidebar: './src/components/overrides/Sidebar.astro',
    },
    logo: { light: './src/assets/logo-light.svg', dark: './src/assets/logo-dark.svg', alt: '', replacesTitle: true },
    favicon: '/favicon.ico',
    title: 'openusd.dev',
    description: 'An independent developer reference for Open USD.',
    customCss: ['./src/styles/shadcn.css', './src/styles/directory.css', './src/styles/theme.css'],
    head: [
      { tag: 'link', attrs: { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' } },
      { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' } },
      { tag: 'link', attrs: { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#0055FF' } },
      { tag: 'link', attrs: { rel: 'manifest', href: '/site.webmanifest' } },
      { tag: 'meta', attrs: { name: 'theme-color', content: '#f6f7f9', media: '(prefers-color-scheme: light)' } },
      { tag: 'meta', attrs: { name: 'theme-color', content: '#03050a', media: '(prefers-color-scheme: dark)' } },
      { tag: 'meta', attrs: { name: 'google-site-verification', content: 'TeBqWoivnh9hwRyGGAm9rCKPQVDd2-Dvv9x5EDpe_k8' } },
      { tag: 'link', attrs: { rel: 'alternate', type: 'application/rss+xml', title: 'Open USD Changelog', href: '/rss.xml' } },
    ],
    sidebar: [
      { label: 'Handbook', items: [
        { label: 'What is OUSD?', slug: 'guides/what-is-open-usd' },
        { label: 'Concepts', slug: 'guides/concepts' },
        { label: 'Integrating OUSD', link: '/start/' },
        { slug: 'guides/hold-ousd' },
        { slug: 'guides/send-payouts' },
        { slug: 'guides/issue-cards' },
        { slug: 'guides/mint-and-redeem-ousd' },
        { slug: 'guides/create-wallets' },
        { slug: 'guides/convert-ousd' },
        { slug: 'guides/custody-ousd' },
        { slug: 'guides/accept-payments' },
        { slug: 'guides/integration-architecture' },
      ] },
      { label: 'Ecosystem', items: [
        { label: 'Directory', link: '/ecosystem/' },
        { label: 'Providers', collapsed: true, items: [
          { label: 'Bridge', link: '/providers/bridge/' }, { label: 'BVNK', link: '/providers/bvnk/' }, { label: 'Coinbase', link: '/providers/coinbase/' },
          { label: 'Mastercard', link: '/providers/mastercard/' }, { label: 'Privy', link: '/providers/privy/' },
          { label: 'Stripe', link: '/providers/stripe/' }, { label: 'Visa', link: '/providers/visa/' },
        ] },
        { label: 'Networks', collapsed: true, items: [
          { label: 'Networks and contracts', link: '/networks/' },
          { label: 'Base', link: '/networks/base/' }, { label: 'Ethereum', link: '/networks/ethereum/' },
          { label: 'Solana', link: '/networks/solana/' }, { label: 'Tempo', link: '/networks/tempo/' },
        ] },
        { label: 'Open dataset', link: '/data/' }, { label: 'Changelog', link: '/changelog/' },
      ] },
      { label: 'Comparisons', items: [
        { slug: 'guides/open-usd-vs-usdc' },
        { slug: 'guides/open-usd-vs-usdg' },
        { slug: 'guides/open-usd-vs-usdt' },
        { slug: 'guides/open-usd-vs-open-issuance' },
      ] },
      { label: 'About', items: [{ label: 'About and review policy', link: '/about/' }, { label: 'Privacy Policy', link: '/privacy/' }] },
    ],
    credits: false,
  }), aeo({
    // Read the finished HTML so registry-driven pages and MDX components are included.
    pages: { exclude: ['/search', '/status', '/guides', '/contribute', '/404'], stripTitleSuffix: / \| openusd\.dev$/ },
    markdown: {
      frontmatter: true,
      includeLastModified: false,
      extraction: {
        selectors: ['main'],
        removeSelectors: ['nav', 'footer', 'form', 'starlight-toc', 'mobile-starlight-toc', '.sl-anchor-link', '#analytics-consent', '#result-count', '[data-llms-ignore]'],
      },
    },
    // The curated index is an Astro endpoint; the plugin owns per-page and full exports.
    site: { name: 'Open USD (OUSD) developer reference', description: 'Independent documentation for Open Standard’s OUSD payments stablecoin.' },
    corpus: { index: { enabled: false }, full: { enabled: true } },
    discovery: { sitemap: { mode: 'disabled', alias: { enabled: false } }, robots: { enabled: false }, indexNow: { enabled: false } },
    schema: { autoInject: false, infer: [] },
    metadata: { fillMissing: false },
    cache: { enabled: false },
  })],
});
