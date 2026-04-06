import next from "eslint-config-next";

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  {
    ignores: [".next/**/*", "node_modules/**/*"],
  },
  ...next,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      "react/no-unescaped-entities": "warn",
    },
  },
];

export default config;
