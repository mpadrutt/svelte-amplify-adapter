import {
    createKeyValueStorageFromCookieStorageAdapter,
    createUserPoolsTokenProvider,
    createAWSCredentialsAndIdentityIdProvider,
    runWithAmplifyServerContext,
    type AmplifyServer,
} from "aws-amplify/adapter-core";
import type { Cookies } from "@sveltejs/kit";
import type { ResourcesConfig } from "aws-amplify";

const runWithSvelteAmplifyServerContext = async <Result>(
    cookies: Cookies,
    amplifyConfig: ResourcesConfig,
    operation: (
        contextSpec: AmplifyServer.ContextSpec,
    ) => Result | Promise<Result>,
): Promise<Result> => {
    if (!amplifyConfig.Auth) throw new Error("amplifyConfig.Auth is undefined.");

    const keyValueStorage = createKeyValueStorageFromCookieStorageAdapter({
        get(name: string) {
            const value = cookies.get(encodeURIComponent(name));
            return { name, value };
        },
        getAll() {
            const cookieList = cookies.getAll();
            cookieList.forEach(
                (cookie) => (cookie.name = decodeURIComponent(cookie.name)),
            );
            return cookieList;
        },
        set(name: string, value: string) {
            cookies.set(encodeURIComponent(name), value, { path: "/" });
        },
        delete(name: string) {
            cookies.delete(encodeURIComponent(name), { path: "/" });
        },
    });

    const tokenProvider = createUserPoolsTokenProvider(
        amplifyConfig.Auth,
        keyValueStorage,
    );

    const credentialsProvider = createAWSCredentialsAndIdentityIdProvider(
        amplifyConfig.Auth,
        keyValueStorage,
    );

    return await runWithAmplifyServerContext(
        amplifyConfig,
        {
            Auth: { tokenProvider, credentialsProvider },
        },
        operation,
    );
};

export { runWithSvelteAmplifyServerContext };
