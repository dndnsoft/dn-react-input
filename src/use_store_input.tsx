import { type HTMLInputTypeAttribute, type Ref } from "react";
import type { Store } from "./use_store";
import { format } from "date-fns";
import { useStoreController } from "./use_store_controller";

export type StoreInputProps<TInputElement, TState> = {
  ref?: Ref<TInputElement>;
  type?: HTMLInputTypeAttribute;
  defaultValue?: string | number | readonly string[] | undefined;
  value?: string | number | readonly string[] | undefined;
  defaultChecked?: boolean | undefined;
  onChange?: (event: React.ChangeEvent<TInputElement>) => void;
} & {
  getter: (state: TState) => unknown;
  setter: (state: TState, value: unknown) => void;
};

export function useStoreInput<
  TInputElement extends
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement,
  TState
>(store: Store<TState>, props: StoreInputProps<TInputElement, TState>) {
  const toInputValue = (value: unknown) => {
    if (value === undefined || value === null) {
      return "";
    }

    if (props.type === "datetime-local") {
      if (value instanceof Date) {
        return format(value, "yyyy-MM-dd'T'HH:mm:ss");
      }

      if (typeof value === "string") {
        return toInputValue(new Date(value));
      }
    }

    return String(value);
  };

  const getDefaultValue = () => {
    if (props.defaultValue !== undefined) {
      return props.defaultValue;
    }

    if (props.type === "checkbox" || props.type === "radio") {
      return undefined;
    }

    return toInputValue(props.getter(store.state));
  };

  const toInputChecked = (value: unknown) => {
    if (props.type === "radio") {
      return value !== undefined && value === props.value;
    }

    return Boolean(value);
  };

  const getDefaultChecked = () => {
    if (props.defaultChecked) {
      return props.defaultChecked;
    }

    if (props.type !== "checkbox" && props.type !== "radio") {
      return undefined;
    }

    return toInputChecked(props.getter(store.state));
  };

  function toStateValue(value: string) {
    const selected = props.getter(store.state);

    if (typeof selected === "number") {
      return Number(value);
    }

    if (selected instanceof Date) {
      return new Date(value);
    }

    return value;
  }

  const inputProps = useStoreController(store, {
    ref: props.ref,
    onSubscribe: (state, element) => {
      if (
        "checked" in element &&
        (props.type === "checkbox" || props.type === "radio")
      ) {
        const checked = toInputChecked(props.getter(state));

        if (element.checked === checked) {
          return;
        }

        element.checked = checked;
      } else {
        const value = toInputValue(props.getter(state));

        if (element.value === value) {
          return;
        }

        element.value = value;
      }

      const event = new Event("input", { bubbles: true });

      element.dispatchEvent(event);
    },
    onDispatch: (state, element) => {
      if ("checked" in element && props.type === "checkbox") {
        props.setter(state, element.checked);
      } else {
        props.setter(state, toStateValue(element.value));
      }
    },
  });

  return {
    ref: inputProps.ref,
    defaultValue: getDefaultValue(),
    defaultChecked: getDefaultChecked(),
    onChange: (event: React.ChangeEvent<TInputElement>) => {
      inputProps.onChange();

      props.onChange?.(event);
    },
  };
}
