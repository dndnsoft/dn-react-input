import { useFormStore } from "dn-react-input";

export default function App() {
    const store = useFormStore({
        email: "",
        password: "",
    });

    const submit = async () => {
        const { email, password } = store.state;

        alert(`Email: ${email}\nPassword: ${password}`);
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
            <button type="submit">Submit</button>
        </form>
    );
}
