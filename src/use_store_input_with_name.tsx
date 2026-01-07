import type { Store } from "./use_store";
import { useStoreInput, type StoreInputProps } from "./use_store_input";

type Props<TInputElement, TState> = Omit<
  StoreInputProps<TInputElement, TState>,
  "getter" | "setter"
> &
  Partial<Pick<StoreInputProps<TInputElement, TState>, "getter" | "setter">> & {
    name?: keyof TState;
  };

export function useStoreInputWithName<
  TInputElement extends
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement,
  TState
>(store: Store<TState>, props: Props<TInputElement, TState>) {
  const inputProps = useStoreInput(store, {
    ...props,
    getter: (state) => {
      if (props.getter) {
        return props.getter(state);
      }

      return state[props.name as keyof TState];
    },
    setter: (state, value) => {
      if (props.setter) {
        props.setter(state, value);

        return;
      }

      state[props.name as keyof TState] = value as TState[keyof TState];
    },
  });

  return {
    ...inputProps,
    name: "name" in props ? String(props.name) : undefined,
  };
}
