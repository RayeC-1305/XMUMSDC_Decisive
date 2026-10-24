---
name: Public preview mutation verification
description: Why local browser tests alone do not establish that preview forms work.
---

Verify important write flows in a browser using the actual public preview URL, including its explicit port, as well as isolated local tests.

**Why:** Local HR journey tests passed while campaign creation in the user's preview was blocked by the different browser Origin. Read-only requests without an Origin header also missed this problem.

**How to apply:** Include a public-preview creation/update smoke check and an HTTP regression covering its browser Origin. Use synthetic test data, close test links afterwards, and keep unrelated origins blocked rather than weakening the policy globally.
