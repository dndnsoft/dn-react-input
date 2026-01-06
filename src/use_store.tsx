import { useRef } from "react";
import { produce } from "immer";

export type Store<TState> = ReturnType<typeof useStore<TState>>;

type DispatchOptions = {
  key?: string;
};

export type StoreSubscriber<TState> = (state: TState, key?: string) => void;

export function useStore<TState>(initialState: TState) {
  const stateRef = useRef<TState>(initialState);

  const subscribers = useRef<StoreSubscriber<TState>[]>([]);

  const dispatch = (recipe: Partial<TState> | ((draft: TState) => void), options: DispatchOptions = {}) => {
    if (typeof recipe === "function") {
      stateRef.current = produce(stateRef.current, recipe);
    } else {
      stateRef.current = produce(stateRef.current, (draft) => {
        for (const key in recipe) {
          (draft as any)[key] = recipe[key as keyof TState];
        }
      }
      );
    }

    notify(options.key);
  };

  const subscribe = (subscriber: StoreSubscriber<TState>) => {
    subscribers.current.push(subscriber);

    return () => {
      const index = subscribers.current.indexOf(subscriber);
      if (index !== -1) {
        subscribers.current.splice(index, 1);
      }
    };
  };

  const notify = (key?: string) => {
    for (const listener of subscribers.current) {
      listener(stateRef.current, key);
    }
  };

  return {
    get state() {
      return stateRef.current;
    },
    dispatch,
    subscribe,
  };
}
