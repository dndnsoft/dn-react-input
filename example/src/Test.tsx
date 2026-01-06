import {
  Input,
  type Store,
  useFormStore,
  useSelector,
} from "dn-react-input";
import { useEffect } from "react";

type FormState = {
  render: number;
  role: string;
  email: string;
  password: string;
  passwordConfirm: string;
  agree: boolean;
  description: string;
  date: string;
  time: string;
  favoriteColor?: string;
  createdAt: Date;
  week: string;
  month: string;
  search: string;
  range: number;
  name: string[];
};

export default function App() {
  const store = useFormStore<FormState>({
    render: 0,
    role: "user",
    email: "ohjinsu98@icloud.com",
    password: "",
    passwordConfirm: "",
    agree: false,
    description: "",
    date: "2024-01-01",
    time: "12:00",
    favoriteColor: "#ff0000",
    createdAt: new Date(),
    week: "2024-W01",
    month: "2024-01",
    search: "",
    range: 50,
    name: ["oh", "jinsu"],
  });

  const submit = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: store.state.email,
        password: store.state.password,
      }),
    });

    if (!res.ok) {
      store.dispatch({
        description: "로그인에 실패했습니다.",
        agree: false,
      });
    }
  };

  useEffect(() => {
    store.dispatch((state) => {
      state.render += 1;
    });
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        submit();
      }}
    >
      <store.input type="email" name="email" />
      <store.input type="password" name="password" />
      <store.input type="password" name="passwordConfirm" />
      <store.select name="role">
        <option value="">선택하세요</option>
        <option value="admin">관리자</option>
        <option value="user">이용자</option>
      </store.select>
      <store.input
        type="text"
        name="name"
        placeholder="lastName"
      />
      <store.input
        type="text"
        name="name"
        placeholder="firstName"
      />
      <Input store={store} name="render" />
      <store.input type="checkbox" name="agree" />
      <store.input type="radio" name="role" value="admin" />
      <store.input type="radio" name="role" value="user" />
      <store.input type="date" name="date" />
      <store.input type="time" name="time" />
      <store.input type="datetime-local" name="createdAt" />
      <store.input type="number" name="render" />
      <store.input type="color" name="favoriteColor" />
      <store.input type="week" name="week" />
      <store.input type="month" name="month" />
      <store.input type="search" name="search" />
      <store.input type="range" name="range" />
      <store.textarea name="description" />
      <ToggleSwitch store={store} />
      <button type="submit">Submit</button>
      <StatePreview store={store} />
    </form>
  );
}

function StatePreview({ store }: { store: Store<FormState> }) {
  const state = useSelector(store, (state) => state);

  return <pre>{JSON.stringify(state, null, 2)}</pre>;
}

function ToggleSwitch({ store }: { store: Store<FormState> }) {
  const agree = useSelector(store, (state) => state.agree);

  return (
    <button
      type="button"
      onClick={() => {
        store.dispatch((state) => {
          state.agree = !state.agree;
        });
      }}
    >
      {agree ? "ON" : "OFF"}
    </button>
  );
}
