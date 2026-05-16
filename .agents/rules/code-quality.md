---
trigger: always_on
---

# Code Quality Rules

Write readable, maintainable TypeScript.

Follow SOLID principles.

Rules:
- Use meaningful names.
- Keep functions small.
- Keep files focused.
- Avoid `any`.
- Prefer explicit types for public APIs.
- Use dependency injection.
- Depend on interfaces, not concrete classes.
- Avoid duplicated logic.
- Avoid deep nesting.
- Prefer early returns.
- Validate inputs at boundaries.
- Handle errors clearly.
- Never hardcode secrets.
- Do not add unnecessary abstractions.

Testing:
- Add or update tests when changing business logic.
- Domain tests should not require database, network, API server, or React Native.
- Use-case tests should mock ports/interfaces.