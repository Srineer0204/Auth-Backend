import { useState,useEffect } from 'react';
import { loginUser, getProfile,logoutUser } from "../services/authServices";
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email,setEmail] = useState("");
    const[password,setPassword] = useState("");
    const [user,setUser] = useState(null);
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    
    const navigate = useNavigate();
    useEffect(() => {
        handleGetProfile();
    }, []);
    
    const handleLogin = async(e) => {
        e.preventDefault();
        try {
          const response = await loginUser({
            email,
            password
          });
          
          console.log(response.data);
          alert("Login successfull");
          await handleGetProfile();
          setIsAuthenticated(true);
          navigate("/dashboard");
        } catch(error) {
          console.log(error);
          alert("Login failed");
        }
    };
    
    const handleGetProfile = async () => {
    
       try {
    
        const response = await getProfile();
    
         console.log(response.data);
         setUser(response.data.user);
         setIsAuthenticated(true);
         alert("Profile fetched");
        } catch(error) {
    
         console.log(error);
    
         alert("Not authorized");
        }
    };
    
    const handleLogout = async () => {
      try {
        const response = await logoutUser();
        console.log(response.data);
        alert("Logged Out successfully");
        setUser(null);
        setIsAuthenticated(false);
      } catch(error) {
        console.log(error);
        alert("logout Failed");
      }
    };

    return (
    <div className='main'style={{
      padding: "20px"
    }}>

      <h1>Login</h1>

      <form onSubmit = {handleLogin}>
        
        <input 
        type='email'
        placeholder='Enter email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button type='submit'>Login</button>

      </form>
      <br />
      {
  user && (
    <div>

      <h2>User Info</h2>

      <p>Email: {user.email}</p>

      <p>ID: {user.id}</p>

    </div>
  )
}
      <button onClick={handleGetProfile}>Get Profile</button><br /><br />
      <button onClick={handleLogout}>Logout</button>
      <h2>{isAuthenticated ? <i>Logged In</i> : <i>Logged Out</i>}</h2>
    </div>
  );
}