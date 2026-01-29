import { useState } from 'react';
import { createUser } from '../services/userServices'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

function CreateAccount() {
    //states
    const [formData, setFormData] = useState({
        email: "",
        username:"",
        password: ""
    });

    const [message, setMessage] = useState("");

    //navigation
    const nav = useNavigate();

    //get the user from context
    const { user } = useAuth();

    //if the user is already signed in
    if(user){
        return <p>Please logout before creating a new account!</p>
    }

    //functions
    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();

        try{
            //call the api service to create a user
            await createUser(formData);
            //reset the form data
            setFormData({
                email: "",
                username:"",
                password: ""    
            })
            //set the message
            setMessage("Account created! Please log in.")

        }catch(error){
            if (error.response && error.response.data) {
                setMessage(error.response.data);
            } else {
                setMessage("Server Unreachable");
            }
        }
    };

    return (
        <form onSubmit={handleCreateUser}>
           <div>
                <label>Email</label>
                <input 
                    type="email"
                    name="email"
                    placeholder="optional"
                    value={formData.email} 
                    onChange={handleFormChange}
                />
            </div>
            <div>
                <label>Username</label>
                <input 
                    type="text"
                    name="username"
                    placeholder="*required"
                    value={formData.username} 
                    onChange={handleFormChange}
                    required 
                />
            </div>
            <div>
                <label>Password</label>
                <input 
                    type="text"
                    name="password"
                    placeholder="*required"
                    value={formData.password} 
                    onChange={handleFormChange} 
                    required
                />
            </div>
            <div>
                <button type="submit">Create Account</button>
                <p>{message}</p>
                <p>Already Have an Account?</p>
                {/* go to the login account page */}
                <button onClick={() => nav('/', {replace: true})}>Login</button>
            </div>
        </form>
    );
}

export default CreateAccount;