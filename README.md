# Card Validator API

A card number validation REST API built with **Express.js** and **TypeScript** (`strict: true`).

It exposes a single endpoint that reports whether a card number is well-formed using the
**Luhn checksum**, and — for valid numbers — identifies the card **network** (Visa, Mastercard,
American Express, Discover) from its IIN/BIN prefix.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

The server starts on `http://localhost:3000` by default (override with the `PORT` env var).

### Build for production

```bash
npm run build
npm start
```

---

## Project structure

```
src/
  controllers/
    card.controller.ts       # HTTP concerns: input checks + response envelope
  routes/
    card.routes.ts           # Router wiring for /api/v1/card
  middleware/
    rate-limit.middleware.ts # express-rate-limit instances
    error.middleware.ts      # 404 + global error handlers
  services/
    luhn.ts                  # Luhn checksum — pure function
    card.network.ts          # IIN/BIN prefix -> network detection
    card.service.ts          # Orchestrates luhn + network detection
  utils/
    custom-response.ts       # customContent() -> { status, message, data } envelope
  app.ts                     # App assembly: security, health, routes, error handlers
  server.ts                  # Entry point: starts the HTTP server
  __tests__/
    luhn.test.ts             # Unit tests for the Luhn algorithm
    card.test.ts             # Integration tests for the endpoint (supertest)
```

Each layer has one job: the **service** knows the validation rules but nothing about HTTP; the
**controller** handles HTTP input/output but delegates the actual check; **middleware** covers
cross-cutting concerns (rate limiting, errors). You can read any file top-to-bottom without needing
another one in your head.

---

## API

### `GET /api/health`

Liveness check.

```json
{ "status": "success", "message": "Card validator API is running" }
```

### `POST /api/v1/card/validate`

Validates a card number.

#### Request

```json
{ "card_number": "4111111111111111" }
```

`card_number` — required. A string or number. Spaces and dashes are accepted
(e.g. `"4111 1111 1111 1111"`).

#### Responses

All responses use a consistent envelope: `{ "status": "success" | "error", "message"?, "data"? }`.

**200 OK** — the request was understood and validation ran (regardless of the result):

```json
{
  "status": "success",
  "message": "Card number is valid.",
  "data": { "valid": true, "network": "Visa" }
}
```

```json
{
  "status": "success",
  "message": "Card number is invalid.",
  "data": { "valid": false, "network": null }
}
```

**400 Bad Request** — `card_number` is missing, empty, or the wrong type:

```json
{ "status": "error", "message": "card_number is required." }
```

**422 Unprocessable Entity** — `card_number` contains characters that cannot form a card number
(anything other than digits, spaces, and dashes):

```json
{ "status": "error", "message": "card_number contains invalid characters." }
```

**404 Not Found** — unknown route. **429 Too Many Requests** — rate limit exceeded.

---

## Security

- **helmet** — sets safe HTTP response headers.
- **express-rate-limit** — a coarse limiter across `/api` (100 req / 15 min) plus a stricter limiter
  on `/api/v1/card/validate` (20 req / min) to deter card/BIN enumeration.
- **`x-powered-by` disabled** — does not advertise the framework.

---

## Running tests

```bash
npm test
```

Runs two suites:

- `luhn.test.ts` — unit tests for the Luhn algorithm.
- `card.test.ts` — integration tests for the endpoint via supertest (status codes + envelope).

---

## Design decisions

### Validation logic — the Luhn algorithm

The Luhn algorithm is the industry-standard checksum used by every major card network to catch typos
and fabricated numbers. It does not confirm a card actually exists or is active — that requires a
network lookup — but it is the correct first gate for format validation.

### Framework — Express over NestJS

The task is a single endpoint. NestJS brings a lot of structure (modules, decorators, DI) that pays
off across many endpoints and teams. For a focused scope, Express keeps the code direct and easy to
trace top to bottom.

### Layering — controller / service / utils

Card logic lives in a **services/** layer (`luhn`, `card.network`, `card.service`) that has no
knowledge of HTTP, so it can be unit-tested in isolation. The **controller** owns request/response
concerns only. This separation is why the Luhn suite tests the algorithm directly while the route
suite tests the HTTP contract.

### Response shape — a consistent envelope

Every response is `{ status, message?, data? }`, so clients branch on a single `status` field. A card
that fails the Luhn check is **not** an HTTP error: it is a successful evaluation that produced a
negative result, so it returns **200** with `status: "success"` and `data.valid: false`. HTTP 4xx is
reserved for problems with the *request* itself (missing input, wrong type, illegal characters) — the
split between **400** (missing/malformed) and **422** (present but unparseable) makes that distinction
explicit.

### Card network detection

After a valid Luhn check, the response includes the detected network based on the IIN/BIN prefix.
Unrecognised prefixes return `"Unknown"`; `network` is `null` for invalid cards, since naming the
network of an invalid number is not meaningful.

### Strict TypeScript & CommonJS

`strict: true` is enabled as required; all handler parameters are explicitly typed and `unknown` is
used for unverified request-body fields before narrowing. The project targets `module: commonjs`,
which keeps imports extensionless and ts-jest configuration simple.
