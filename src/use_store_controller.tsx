import { useId } from "react";
import type { Store } from "./use_store";
import { useSubscribe } from "./use_subscribe";

export type StoreControllerProps<TState> = {
  onSubscribe: (state: TState) => void;
  onDispatch: (state: TState) => void;
};

export function useStoreController<TState>(
  store: Store<TState>,
  props: StoreControllerProps<TState>
) {
  const dispatchKey = useId();

  useSubscribe(store, (state, key) => {
    if (key === dispatchKey) {
      return;
    }

    props.onSubscribe(state);
  });

  const dispatch = () => {
    store.dispatch(
      (state) => {
        props.onDispatch(state);
      },
      {
        key: dispatchKey,
      }
    );
  };

  return {
    dispatch,
  };
}
