import { createRender, type CreateRender } from "./create_render";
import { useStore, type Store } from "./use_store";
import { useStoreInput } from "./use_store_input";

export type FormStore<TState> = Store<TState> &
    ReturnType<typeof useStoreInput<TState>> & {
        render: CreateRender<TState>;
    };

export function useFormStore<TState>(initialState: TState): FormStore<TState> {
    const store = useStore<TState>(initialState);

    const storeInput = useStoreInput<TState>(store);

    return {
        get state() {
            return store.state;
        },
        dispatch: store.dispatch,
        subscribe: store.subscribe,
        render: createRender<TState>(store),
        ...storeInput,
    };
}
