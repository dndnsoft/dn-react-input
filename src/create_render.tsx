import { useSelector } from "./use_selector";
import React, { type ReactNode } from "react";
import type { Store } from "./use_store";

export type CreateRender<TState> = (
    selector: (state: TState) => ReactNode,
    compare?: (a: TState, b: TState) => boolean
) => ReactNode;

export function createRender<TState>(
    store: Store<TState>
): CreateRender<TState> {
    return function createRender(selector, compare) {
        function Component() {
            const result = useSelector(store, (state) => state, compare);

            const content = selector(result);

            return <>{content}</>;
        }

        return <Component />;
    };
}
