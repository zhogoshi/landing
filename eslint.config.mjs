import next from "@next/eslint-plugin-next";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
  plugins: { "@next/next": next },
  rules: {
    ...next.configs.recommended.rules,
  },
});
