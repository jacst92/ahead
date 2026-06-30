# Ahead

Ahead is the flagship software product of The Financial Learning Curve, also identified in-product as `A TFLC Product`.

Brand documentation:

- [TFLC master brand guide](TFLC_BRAND_GUIDE.md)
- [TFLC parent brand guidelines](docs/tflc-brand-guidelines.md)
- [Ahead product brand guidelines](docs/ahead-product-brand.md)

Product architecture:

- [Ahead Decision Engine](AHEAD_DECISION_ENGINE.md)
- [Ahead data model specification](AHEAD_DATA_MODEL.md)
- [Functional local budget](FUNCTIONAL_LOCAL_BUDGET.md)
- [Currency input verification](CURRENCY_INPUT_VERIFICATION.md)
- [Local data verification report](LOCAL_DATA_VERIFICATION.md)

Deployment:

- [Cloudflare Pages deployments](CLOUDFLARE_PAGES_DEPLOYMENT.md)
- [Cloudflare deployment status](CLOUD_FLARE_STATUS.md)

## Local Network Development

Ahead's standard local development server runs on port `4174` and binds to `0.0.0.0` so other devices on the same local network can open the app.

Start the server:

```powershell
py dev-server.py --host 0.0.0.0 --port 4174
```

Local machine:

```text
http://127.0.0.1:4174
```

Other devices on your local network:

```text
http://<my-local-ip>:4174
```

For example, if your computer's local IP address is `192.168.1.25`, open:

```text
http://192.168.1.25:4174
```

Hot reload is enabled for `.html`, `.css`, `.js`, and `.md` files. The server injects a local reload listener into served HTML and refreshes connected browsers when watched files change.

This configuration is intended only for local network development. Do not configure router port forwarding, tunneling, public reverse proxies, or firewall rules that expose port `4174` to the internet.

If another device on the same network cannot open the app, allow inbound TCP traffic to port `4174` only on the private local subnet:

```powershell
New-NetFirewallRule -DisplayName "Ahead local dev 4174" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 4174 -Profile Private -RemoteAddress LocalSubnet
```
