import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";

/**
 * Custom render function allows us to wrap our tests with global context
 * providers and data stores.
 * Boilerplate copied from:
 * https://testing-library.com/docs/react-testing-library/setup/#custom-render
 */
const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return <MantineProvider>{children}</MantineProvider>;
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
