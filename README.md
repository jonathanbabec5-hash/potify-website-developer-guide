# POTIFY Website

[Complete repository directory tree](docs/DIRECTORY.md)

**Website integration source and route directory.** Give visitors one reliable way to move from a POTIFY project to the next.

### Setup and usage

Use Node.js 24 for the included checks. Use Python 3 for the local static preview.

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory public
```

Open one project from the directory. Open http://127.0.0.1:8000/ in a browser. 

### Developer entry points

The public directory is accompanied by original website router, account screens, Greenhouse and community components, portal integration code and selected database schemas. Its public preview runs without a database. Explore `public/`, `reference/`, `src/`, `tests/` in the full tree.

### Verification

The public entry page returned HTTP 200 and rendered local content in Chromium at a 390 × 844 viewport.

```sh
node --test tests/project.test.mjs
```

### Release scope

The complete main website source is verified in the owner-controlled private repository. This public developer edition omits private account records, runtime configuration and operational data. Production and Replit parity remain unverified. Main-domain response and Replit listing for POTIFY Website, checked November 25. Public route destinations are also present in the First Cycle universe page. This newly authored integration guide is separate from the production application. The SHA-256 and public route patterns from the actual main website bundle are in src/observed-routes.json. Original website routing and selected Greenhouse, account, community and GLP integration source were recovered at b40b28683e548a04619f1e018814dd91aec1256d.

[Technical whitepaper](docs/WHITEPAPER.md) · [Marketing and sales plan](docs/MARKETING.md) · [Dated developer log](docs/BUILD-LOG.md)

Existing asset and code terms remain applicable. Public access to a recording, illustration, brand or manuscript does not itself grant commercial reuse rights.
