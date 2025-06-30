import { useState } from "react";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("form submitted");
        console.log("email: ", email);
        console.log("password: ", password);

        try {
            const res = await fetch(`http://localhost:8000/users`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password })
            });

            // send user to homepage

        } catch {
            console.log("")
        }

        setEmail('');
        setPassword('');
    }

    return (
        <div className="Register-form">
            <h2>Register</h2>
            <form onSubmit={ handleSubmit }>     
                <div className="input-field">
                    <label>email</label>
                    <input 
                        type="email"
                        placeholder="placeholder"
                        value={ email }
                        onChange={(e) => setEmail(e.target.value)}
                        required={ true }
                    />
                </div>

                <div className="input-field">
                    <label>password</label>
                    <input 
                        type="password"
                        value={ password }
                        onChange={(e) => setPassword(e.target.value)}
                        required={ true }
                    />
                </div>
                
                <button>Submit</button>
                <a href="/login">Login</a>
            </form>
        </div>
    )
}


export default Register;