import { useFormStore } from "react-store-input";

export default function App() {
  const store = useFormStore({
    email: "",
    password: "",
    rememberMe: false,
  });

  const submit = async () => {
    const { email, password } = store.state;

    console.log(email, password);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <store.input name="email" type="email" />
      <store.input name="password" type="password" />
      <store.select
        name="rememberMe"
        toInputValue={(value) => (value ? "true" : "false")}
        toStateValue={(value) => value === "true"}
      >
        <option value="true">Remember Me</option>
        <option value="false">Don't Remember Me</option>
      </store.select>
      <button type="submit">Submit</button>
    </form>
  );
}
