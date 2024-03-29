import { AmplifyServer } from 'aws-amplify/adapter-core';
import { Cookies } from '@sveltejs/kit';
import { ResourcesConfig } from 'aws-amplify';

declare const runWithSvelteAmplifyServerContext: <Result>(cookies: Cookies, amplifyConfig: ResourcesConfig, operation: (contextSpec: AmplifyServer.ContextSpec) => Result | Promise<Result>) => Promise<Result>;

export { runWithSvelteAmplifyServerContext };
