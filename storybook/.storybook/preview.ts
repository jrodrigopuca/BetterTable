import type { Preview } from "@storybook/react";
import "better-table/styles.css";
import "./storybook.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "padded",
    docs: {
      toc: true,
    },
  },
};

export default preview;
