import {
  useCallback,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
} from "react";
import type { Store } from "./use_store";
import React from "react";
import { useStoreInputWithName } from "./use_store_input_with_name";

export type StoreComponentProps<TInputElement, TState> = Omit<
  DetailedHTMLProps<InputHTMLAttributes<TInputElement>, TInputElement>,
  "name"
> & {
  name?: keyof TState;
  getter?: (state: TState) => unknown;
  setter?: (state: TState, value: unknown) => void;
};

export function useStoreComponent<TState>(store: Store<TState>) {
  const input: React.FC<StoreComponentProps<HTMLInputElement, TState>> =
    useCallback(function Component(props) {
      return <Input store={store} {...props} />;
    }, []);

  const select: React.FC<StoreComponentProps<HTMLSelectElement, TState>> =
    useCallback(function Component(props) {
      return <Select store={store} {...props} />;
    }, []);

  const textarea: React.FC<StoreComponentProps<HTMLTextAreaElement, TState>> =
    useCallback(function Component(props) {
      return <Textarea store={store} {...props} />;
    }, []);

  return {
    input,
    select,
    textarea,
  };
}

export type StoreComponentPropsWithStore<
  TElement extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  TState
> = StoreComponentProps<TElement, TState> & { store: Store<TState> };

export function Input<TState>({
  store,
  ...props
}: StoreComponentPropsWithStore<HTMLInputElement, TState>) {
  const storeProps = useStoreInputWithName(store, props);

  return <input {...props} {...storeProps} />;
}

export function Select<TState>({
  store,
  ...props
}: StoreComponentPropsWithStore<HTMLSelectElement, TState>) {
  const storeProps = useStoreInputWithName(store, props);

  return <select {...props} {...storeProps} />;
}

export function Textarea<TState>({
  store,
  ...props
}: StoreComponentPropsWithStore<HTMLTextAreaElement, TState>) {
  const storeProps = useStoreInputWithName(store, props);

  return <textarea {...props} {...storeProps} />;
}
