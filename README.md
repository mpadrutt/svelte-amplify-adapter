# Svelte-Amplify-Adapter

This is a simple adapter to enable SSR in SvelteKit 2 and aws-amplify 6.

## Getting started

```bash
npm install "svelte-amplify-adapter"
```

```ts
import { parseAmplifyConfig } from "aws-amplify/utils";
import { getCurrentUser } from "aws-amplify/auth/server";
import awsConfig from "./awsConfig";
import type { ServerLoad } from "@sveltejs/kit";

import { runWithSvelteAmplifyServerContext } from "svelte-amplify-adapter";

export const load: ServerLoad = async ({ cookies }) => {
  const amplifyConfig = parseAmplifyConfig(awsConfig);

  return await runWithSvelteAmplifyServerContext(
    cookies,
    amplifyConfig,
    async (contextSpec) => {
      try {
        const user = await getCurrentUser(contextSpec);
        return { user };
      } catch (e) {
        return { user: undefined };
      }
    },
  );
};
```
