---
trigger: always_on
---

# React Native Mobile Rules

These rules apply to apps/mobile.

The mobile app is presentation only.

Allowed:
- screens
- components
- navigation
- hooks
- local UI state
- calling packages/api-client
- loading, error, empty, and success states

Not allowed:
- backend business logic
- direct database access
- infrastructure code
- duplicated API fetch logic inside screens

API calls must go through packages/api-client.

Screens should:
1. Read params.
2. Call hooks/services.
3. Handle loading/error/empty states.
4. Render UI.
5. Move complex UI into components.

Keep components small and props-driven.

Avoid large inline logic inside JSX.