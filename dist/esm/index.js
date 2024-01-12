import { createKeyValueStorageFromCookieStorageAdapter, createUserPoolsTokenProvider, createAWSCredentialsAndIdentityIdProvider, runWithAmplifyServerContext } from 'aws-amplify/adapter-core';

const runWithSvelteAmplifyServerContext = async (cookies, amplifyConfig, operation) => {
    if (!amplifyConfig.Auth)
        throw new Error("amplifyConfig.Auth is undefined.");
    const keyValueStorage = createKeyValueStorageFromCookieStorageAdapter({
        get(name) {
            const value = cookies.get(encodeURIComponent(name));
            return { name, value };
        },
        getAll() {
            const cookieList = cookies.getAll();
            cookieList.forEach((cookie) => (cookie.name = decodeURIComponent(cookie.name)));
            return cookieList;
        },
        set(name, value) {
            cookies.set(encodeURIComponent(name), value, { path: "/" });
        },
        delete(name) {
            cookies.delete(encodeURIComponent(name), { path: "/" });
        },
    });
    const tokenProvider = createUserPoolsTokenProvider(amplifyConfig.Auth, keyValueStorage);
    const credentialsProvider = createAWSCredentialsAndIdentityIdProvider(amplifyConfig.Auth, keyValueStorage);
    return await runWithAmplifyServerContext(amplifyConfig, {
        Auth: { tokenProvider, credentialsProvider },
    }, operation);
};

export { runWithSvelteAmplifyServerContext };
