---
id: build-new-provider
title: Build a Payment Integration
---

## Overview

ZKP2P is an open and permissionless protocol. Provider templates are JSON configs used in the ZKP2P PeerAuth extension and Peer mobile app to facilitate fast and cheap onchain onboarding. This guide explains how to build a payment integration by authoring a zkTLS provider template to generate a proof of payment.

If you have any questions, reach out on [Discord](https://discord.com/invite/zkp2p).

## Package Usage (npm)

The `@zkp2p/providers` package is data-only. Consumers import JSON templates directly via deep import paths or use the manifest.

Install:

```bash
npm install @zkp2p/providers
# or
yarn add @zkp2p/providers
```

CommonJS:

```js
const zelle = require('@zkp2p/providers/citi/transfer_zelle.json');
console.log(zelle.actionType);
```

ESM (import assertions):

```js
import zelle from '@zkp2p/providers/citi/transfer_zelle.json' assert { type: 'json' };
console.log(zelle.actionType);
```

Manifest:

```js
const manifest = require('@zkp2p/providers/providers.json');
for (const p of manifest.providers) console.log(p.id, p.files);
```

Notes:
- No runtime code is shipped; only JSON and docs.
- Deep imports like `@zkp2p/providers/<provider>/<file>.json` are stable entry points.
- Bundlers (Webpack/Vite) support JSON imports by default.

## Developer Quickstart

Note: The npm package is data-only. The local dev server described here is for development/testing and is not included in the published package.

To get started building a new provider:

1. Clone the [providers repo](https://github.com/zkp2p/providers).
2. Run `yarn install` and `yarn start`. The app is hosted at [http://localhost:8080](http://localhost:8080).
3. Install the [PeerAuth extension](https://chromewebstore.google.com/detail/peerauth-authenticate-and/ijpgccednehjpeclfcllnjjcmiohdjih) in your browser.
4. Create a new directory and JSON file and add the necessary provider data for your integration.
5. Test your integration by going to [developer.zkp2p.xyz](https://developer.zkp2p.xyz/).
6. Click Open Settings and set Base URL to `http://localhost:8080/`. Any changes to your JSON will now be reflected in the extension and developer app.
7. Update the inputs with the path to your integration: `localhost:8080/{platform_name}/{provider_name}.json`.
8. Click Authenticate to extract metadata.
9. If successful, proceed to Prove a specific transaction.

### Optional: add a Claude Code or Codex skill

The create-zkp2p-provider skill can guide request capture and template authoring. See the [zkills repo](https://github.com/zkp2p/zkills) for full docs.

1. Install Chrome DevTools MCP (required for network capture), then restart your client:
   - Codex: `codex mcp add chrome-devtools -- npx chrome-devtools-mcp@latest`
   - Claude Code: `claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest`
2. Install the skill:
   - Codex: run `codex` then `$skill-installer https://github.com/zkp2p/zkills/tree/main/src/codex/create-zkp2p-provider`
   - Claude Code: clone the repo and run `./scripts/install-claude.sh`

Once installed, invoke the skill when you need help mapping network requests to template selectors.

## 1. Build a zkTLS Provider Template

### Getting Started
1. Inspect network tab in Dev Tools after logging into your payment website. Or turn on Intercepted Requests in ZKP2P sidebar
2. Find a request that contains amount, timestamp/date, recipient ID at a minimum. Look for additional params such as status (to see if payment finalized), currency (if platform supports more than 1 currency)
3. A tip is to look for where the transactions page is. Sometimes the transactions are expandable so you can log those too
4. Based on the request, populate the template

### Configuration Structure

```json
{
  "actionType": "transfer_venmo",
  "authLink": "https://account.venmo.com/?feed=mine",
  "url": "https://account.venmo.com/api/stories?feedType=me&externalId={{SENDER_ID}}",
  "method": "GET",
  "skipRequestHeaders": [],
  "body": "",
  "metadata": {
    "platform": "venmo",
    "urlRegex": "https://account.venmo.com/api/stories\\?feedType=me&externalId=\\S+",
    "method": "GET",
    "shouldSkipCloseTab": false,
    "transactionsExtraction": {
      "transactionJsonPathListSelector": "$.stories"
    }
  },
  "paramNames": ["SENDER_ID"],
  "paramSelectors": [{
    "type": "jsonPath",
    "value": "$.stories[{{INDEX}}].title.sender.id",
    "source": "responseBody"
  }],
  "secretHeaders": ["Cookie"],
  "responseMatches": [{
    "type": "regex",
    "value": "\"amount\":\"-\\$(?<amount>[^\"]+)\""
  }],
  "responseRedactions": [{
    "jsonPath": "$.stories[{{INDEX}}].amount",
    "xPath": ""
  }],
  "mobile": {
    "includeAdditionalCookieDomains": [],
    "useExternalAction": true,
    "external": {
      "actionLink": "venmo://paycharge?txn=pay&recipients={{RECEIVER_ID}}&note=cash&amount={{AMOUNT}}",
      "appStoreLink": "https://apps.apple.com/us/app/venmo/id351727428",
      "playStoreLink": "https://play.google.com/store/apps/details?id=com.venmo"
    }
  }
}
```

### Field Descriptions

#### Basic Configuration

##### `actionType` (required)
- **Type**: `string`
- **Description**: Identifier for the action type (e.g., "transfer_venmo", "receive_payment")
- **Example**: `"transfer_venmo"`

##### `authLink` (required)
- **Type**: `string`
- **Description**: URL for user authentication/login page
- **Example**: `"https://venmo.com/login"`

##### `url` (required)
- **Type**: `string`
- **Description**: API endpoint URL for the main request
- **Example**: `"https://api.venmo.com/v1/payments"`

##### `method` (required)
- **Type**: `string`
- **Description**: HTTP method for the request
- **Values**: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`
- **Example**: `"POST"`

##### `skipRequestHeaders` (optional)
- **Type**: `string[]`
- **Description**: Headers to exclude from the notarized request
- **Example**: `["User-Agent", "Accept-Language"]`

##### `body` (optional)
- **Type**: `string`
- **Description**: Request body template (for POST/PUT requests)
- **Example**: `"{\"amount\": \"{{AMOUNT}}\", \"recipient\": \"{{RECIPIENT}}\"}"`

#### Metadata Configuration

##### `metadata` (required)
- **Type**: `object`
- **Description**: Configuration for request matching and transaction extraction

```json
"metadata": {
  "shouldReplayRequestInPage": false,
  "shouldSkipCloseTab": false,
  "platform": "venmo",
  "urlRegex": "https://api\\.venmo\\.com/v1/payments/\\d+",
  "method": "GET",
  "fallbackUrlRegex": "https://api\\.venmo\\.com/v1/transactions",
  "fallbackMethod": "GET",
  "preprocessRegex": "window\\.__data\\s*=\\s*({.*?});",
  "userInput": {
    "promptText": "Select a transfer below to proceed with authentication",
    "transactionXpath": "//section[@id='feed-pending-module']//div[contains(@class,'q1hbnk3w') and contains(@class,'q1hbnk5w')]"
  },
  "transactionsExtraction": {
    "transactionJsonPathListSelector": "$.data.transactions",
    "transactionJsonPathSelectors": {
      "recipient": "$.target.username",
      "amount": "$.amount",
      "date": "$.created_time",
      "paymentId": "$.id",
      "currency": "$.currency"
    },
    "transactionXPathListSelector": "",
    "transactionXPathSelectors": {}
  },
  "proofMetadataSelectors": [
    {
      "type": "jsonPath",
      "value": "$.data.user.id"
    }
  ]
}
```

###### Metadata Fields

- **`shouldSkipCloseTab`** (optional): When set to `true`, prevents the extension from automatically closing the authentication tab after successful authentication
- **`shouldReplayRequestInPage`** (optional): When set to `true`, replays the request in the page context instead of making it from the extension

##### `userInput` (optional)
- **Type**: `object`
- **Description**: Prompts the user to click a transaction element before interception. Useful for SPAs or feeds where a detail request is made after a click.

Example:
```json
"userInput": {
  "promptText": "Select a transfer below to proceed with authentication",
  "transactionXpath": "//section[@id='feed-pending-module']//div[contains(@class,'q1hbnk3w') and contains(@class,'q1hbnk5w')]"
}
```

Fields:
- `promptText`: Short instruction shown in-page by the extension.
- `transactionXpath`: XPath that selects the clickable transaction nodes. The clicked item determines `{{INDEX}}` for selectors and extraction.

Notes:
- Pair with `shouldReplayRequestInPage: true` for apps that require page context (e.g., N26).
- Prefer stable attributes/ids over volatile CSS class names when possible.

#### Parameter Extraction

##### `paramNames` (required)
- **Type**: `string[]`
- **Description**: Names of parameters to extract
- **Example**: `["transactionId", "amount", "recipient"]`

##### `paramSelectors` (required)
- **Type**: `ParamSelector[]`
- **Description**: Selectors for extracting parameter values

```typescript
interface ParamSelector {
  type: 'jsonPath' | 'regex' | 'xPath';
  value: string;
  source?: 'url' | 'responseBody' | 'responseHeaders' | 'requestHeaders' | 'requestBody';
}
```

##### Parameter Source Options

The `source` field in `paramSelectors` specifies where to extract the parameter from.

- **`responseBody`** (default): Extract from the response body
- **`url`**: Extract from the request URL
- **`responseHeaders`**: Extract from response headers
- **`requestHeaders`**: Extract from request headers
- **`requestBody`**: Extract from the request body (for POST/PUT requests)

Example:
```json
{
  "paramNames": ["userId", "transactionId", "amount"],
  "paramSelectors": [
    {
      "type": "regex",
      "value": "userId=([^&]+)",
      "source": "url"
    },
    {
      "type": "jsonPath",
      "value": "$.data.transactions[{{INDEX}}].id",
      "source": "responseBody"
    },
    {
      "type": "xPath",
      "value": "normalize-space(//div[@class='tx-amount'][{{INDEX}} + 1])",
      "source": "responseBody"
    },
    {
      "type": "regex",
      "value": "X-Transaction-Amount: ([0-9.]+)",
      "source": "responseHeaders"
    }
  ]
}
```

#### Security Configuration

##### `secretHeaders` (optional)
- **Type**: `string[]`
- **Description**: Headers containing sensitive data (e.g., auth tokens)
- **Example**: `["Authorization", "Cookie"]`

#### Response Verification

##### `responseMatches` (required)
- **Type**: `ResponseMatch[]`
- **Description**: Patterns to verify in the response

```json
"responseMatches": [
  {
    "type": "jsonPath",
    "value": "$.data.transactions[{{INDEX}}].id",
    "hash": false
  },
  {
    "type": "regex",
    "value": "\"status\":\\s*\"completed\"",
    "hash": true
  }
]
```

##### `responseRedactions` (optional)
- **Type**: `ResponseRedaction[]`
- **Description**: Data to redact from the response for privacy

```json
"responseRedactions": [
  {
    "jsonPath": "$.data.user.email"
  },
  {
    "xPath": "//span[@class='ssn']"
  }
]
```

#### Mobile SDK Configuration

##### `mobile` (optional)
- **Type**: `object`
- **Description**: Special configurations for the ZKP2P mobile SDK

```json
"mobile": {
  "includeAdditionalCookieDomains": [],
  "actionLink": "venmo://paycharge?txn=pay&recipients={{RECEIVER_ID}}&note=cash&amount={{AMOUNT}}",
  "isExternalLink": true,
  "appStoreLink": "https://apps.apple.com/us/app/venmo/id351727428",
  "playStoreLink": "https://play.google.com/store/apps/details?id=com.venmo"
}
```

**Fields:**
- `includeAdditionalCookieDomains`: Array of additional cookie domains to include
- `actionLink`: Deep link URL for the mobile app with placeholders for dynamic values
- `isExternalLink`: Boolean indicating if the action link is external
- `appStoreLink`: iOS App Store URL for the app
- `playStoreLink`: Google Play Store URL for the app

### Transaction Extraction

#### Using JSONPath (for JSON responses)
```json
{
  "transactionsExtraction": {
    "transactionJsonPathListSelector": "$.data.transactions",
    "transactionJsonPathSelectors": {
      "recipient": "$.target.username",
      "amount": "$.amount",
      "date": "$.created_time",
      "paymentId": "$.id",
      "currency": "$.currency"
    }
  }
}
```

#### Using XPath (for HTML responses)
```json
{
  "transactionsExtraction": {
    "transactionXPathListSelector": "//table[@id='transactions']//tr[contains(@class,'row')]",
    "transactionXPathSelectors": {
      "amount": "normalize-space(.//td[contains(@class,'amount')])",
      "recipient": "normalize-space(.//td[contains(@class,'recipient')])",
      "date": "normalize-space(.//td[contains(@class,'date')])",
      "paymentId": "normalize-space(.//@data-payment-id)"
    }
  }
}
```

### Best Practices

1. **URL Regex Patterns**
   - Escape special characters: `\\.` for dots
   - Use specific patterns to avoid false matches
   - Test regex patterns thoroughly

2. **Parameter Extraction**
   - Use JSONPath for structured JSON data
   - Use XPath for HTML responses
   - For regex usage in `paramSelectors`/`responseMatches`, always specify capture groups `()`
   - Specify `source` when extracting from non-default locations

3. **Security**
   - List all sensitive headers in `secretHeaders`
   - Use `responseRedactions` to remove PII
   - Never expose authentication tokens in `responseMatches`

4. **Error Handling**
   - Provide fallback URLs when primary endpoints might fail
   - Use preprocessing regex for embedded JSON data
   - Test extraction selectors with various response formats

5. **Performance**
   - Minimize the number of `responseMatches` for faster verification
   - Use specific JSONPath expressions instead of wildcards
   - Consider response size when designing redactions

### Common Issues

- **Authenticate does not open desired auth link**: Check the Base URL you have set in the extension. Ensure you are running the server which is hosted in port 8080
- **Authenticated into your payment platform but not redirected back to developer.zkp2p.xyz**: There is an issue with the urlRegex for metadata extraction. Double check your regex is correct
- **Metadata returned to app, but Prove fails**: There is an issue with the response redactions or headers for the server call. Check your response redactions parameters and server headers
- **Parameters not extracted correctly**: Check the `source` field in your `paramSelectors`. By default, parameters are extracted from responseBody
- **CSRF or one-time tokens fail on replay**: Re-trigger the request in-page to refresh tokens before capture
- **List vs detail endpoints**: The list request may differ from the proof endpoint for a single transaction; capture both
- **Missing/obfuscated response bodies**: Try a different request or navigate to another page that loads the same data
- **Wrong selector type**: HTML responses require XPath selectors; JSON responses use JSONPath
- **Unstable recipient IDs**: Prefer stable internal IDs or add additional proofs if handles can change


## Contributing

We want to make this the largest open source repository of provider templates for global payment platforms. Please open a PR in the [providers repository](https://github.com/zkp2p/providers) when you have created and tested your template!
