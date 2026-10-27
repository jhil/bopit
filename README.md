# Bop It

A browser reaction game using the original experiment’s toy artwork, voice cues, and background beat.

Live at https://bopit.jeffand.co.

Press B, P, or T, or click or tap the matching part of the toy. Correct responses score a point and make the next turn faster. Incorrect or late responses end the round. Escape stops the round. Switching away from the tab stops it rather than leaving the clock running unseen. The original fill recording loops underneath the voice cues during a round. Sound toggles both together. High scores stay in this browser.

This edition requires no Leap Motion, Twitter account, server, or multiplayer lobby. The original Leap Motion source is preserved on the `legacy/leap-motion` branch.

If voice cues fail to load, the game displays an explanation and remains playable using the visible commands.

## Development

Use Node 24 and the pinned pnpm release from `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm test          # focused behavior tests
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build         # Next static export into out/
pnpm check         # all checks and the production build
pnpm preview       # serve the exported files with Wrangler
pnpm cf:deploy     # build and deploy to Cloudflare Workers
```

`wrangler.jsonc` owns the subdomain. Deployment requires Cloudflare credentials with Workers and zone access. No application secrets are required. Build output and local credentials stay out of Git.

Browser verification covers the core interaction, a direct reload, keyboard operation, and a narrow viewport. Audio changes also require a listening check.
