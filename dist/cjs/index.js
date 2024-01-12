'use strict';

var adapterCore = require('aws-amplify/adapter-core');

const runWithSvelteAmplifyServerContext = async (cookies, amplifyConfig, operation) => {
    if (!amplifyConfig.Auth)
        throw new Error("amplifyConfig.Auth is undefined.");
    const keyValueStorage = adapterCore.createKeyValueStorageFromCookieStorageAdapter({
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
    const tokenProvider = adapterCore.createUserPoolsTokenProvider(amplifyConfig.Auth, keyValueStorage);
    const credentialsProvider = adapterCore.createAWSCredentialsAndIdentityIdProvider(amplifyConfig.Auth, keyValueStorage);
    return await adapterCore.runWithAmplifyServerContext(amplifyConfig, {
        Auth: { tokenProvider, credentialsProvider },
    }, operation);
};

exports.runWithSvelteAmplifyServerContext = runWithSvelteAmplifyServerContext;
