import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import commonjs from "@rollup/plugin-commonjs";

export default [
    {
        input: "src/index.ts",
        output: [
            {
                dir: "dist/esm",
                format: "esm",
                sourcemap: true,
            },
        ],
        plugins: [typescript()],
        external: ["aws-amplify/adapter-core"],
    },
    {
        input: "src/index.ts",
        output: {
            dir: "dist/cjs",
            format: "cjs",
        },
        plugins: [commonjs(), typescript()],
        external: ["aws-amplify/adapter-core"],
    },
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/types.d.ts",
                format: "es",
            },
        ],
        plugins: [dts()],
        external: ["aws-amplify/adapter-core"],
    },
];
