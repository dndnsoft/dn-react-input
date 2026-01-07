import { useEffect, useId, useRef, type Ref } from "react";
import type { Store } from "./use_store";
import { useSubscribe } from "./use_subscribe";

export type StoreControllerProps<TController, TState> = {
  ref?: Ref<TController>;
  onSubscribe: (state: TState, element: TController) => void;
  onDispatch: (state: TState, element: TController) => void;
};

export function useStoreController<TController, TState>(
  store: Store<TState>,
  props: StoreControllerProps<TController, TState>
) {
  const ref = useRef<TController>(null);

  const dispatchKey = useId();

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    if (typeof props.ref === "function") {
      props.ref(element as TController);
    } else if (props.ref) {
      props.ref.current = element as TController;
    }
  }, []);

  useSubscribe(store, (state, key) => {
    if (key === dispatchKey) {
      return;
    }

    if (!ref.current) return;

    props.onSubscribe(state, ref.current);
  });

  const onChange = () => {
    store.dispatch(
      (state) => {
        const element = ref.current;

        if (!element) return;

        props.onDispatch(state, element);
      },
      {
        key: dispatchKey,
      }
    );
  };

  return {
    dispatchKey,
    ref,
    onChange,
  };
}
