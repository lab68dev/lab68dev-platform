import next from "eslint-config-next";

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  {
    ignores: [".next/**/*", "node_modules/**/*"],
  },
  ...next,
];

export default config;
