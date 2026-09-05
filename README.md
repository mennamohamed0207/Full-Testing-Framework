# This is Full Testing project 
- Fully automating things from the website https://sauce-demo.myshopify.com/

- Fully automate apis from https://restful-booker.herokuapp.com/apidoc/index.html

Steps that i will make 
## Stage A — Core
- Playwright
- pytest
- Page Objects
- Fixtures
- Parametrization
- API testing
## Stage B — Engineering
- Test data architecture
- Authentication/session management
- Test isolation
- Parallel execution
- Logging
- Failure diagnostics
```
This is one of the areas I particularly want you to build.

When a test fails, your framework should automatically give you useful evidence.

For example:

artifacts/
    failed_test/
        screenshot.png
        trace.zip
        video.webm
        logs.txt
        response.json
```
Flaky-test investigation
## Stage C — Infrastructure
- Docker
- Docker Compose
- CI/CD
- Artifacts
- Environment management
## Stage D — Advanced
- Test strategy
- Performance testing
- Framework testing
- Architecture/design decisions
- Optimization
- Security considerations


# Potential Structure

```
sdet-playwright-framework/
│
├── tests/
│   ├── ui/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   └── checkout/
│   │
│   ├── api/
│   │   ├── bookings/
│   │   └── users/
│   │
│   └── integration/
│
├── pages/
│   ├── LoginPage.ts
│   ├── ProductsPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
│
├── api/
│   ├── BookingClient.ts
│   └── UserClient.ts
│
├── fixtures/
│   ├── auth.fixture.ts
│   ├── api.fixture.ts
│   └── test.fixture.ts
│
├── data/
│   ├── users.ts
│   ├── products.ts
│   └── bookings.ts
│
├── utils/
│
├── config/
│
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md
```