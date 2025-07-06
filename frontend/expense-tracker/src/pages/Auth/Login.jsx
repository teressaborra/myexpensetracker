import React,{useState} from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { useNavigate,Link  }from "react-router-dom";
import {validateEmail,validatePassword} from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import {API_PATHS} from "../../utils/apiPaths";
// Go up two levels (from Auth to pages to src) and into context
import { UserContext } from "../../context/userContext";
import { useContext } from "react";


const Login = () => {
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[error,setError]=useState(null);

const { updateUser } = useContext(UserContext);



  const navigate=useNavigate();


  //handle Login form submit
  const handleLogin=async(e)=>{
    e.preventDefault();
    console.log(email);
    console.log(password);

    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }
    if (!validatePassword(password)) {
  setError(
    `Please enter a valid password with:
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character
- Minimum length of 8 characters`
  );
  return;
}
    setError("")

      //Login Api call

    try{
      const response= await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,
        password,
      });
      const{token,user} =response.data;
      if(token){
        localStorage.setItem("token",token);
        updateUser(user);
        navigate("/dashboard");
      }}
      catch(error){
        if(error.response && error.response.data.message){
          setError(error.response.data.message);
        }else{
          setError("Something went wrong. Please try again later");
        }
      }

    }
  return (
    <AuthLayout>
      <div className="flex flex-col justify-center h-full w-full max-w-md mt-16">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-1 mb-6">
          Please enter your credentials to access your account.
        </p>
        {/* Place your login form inputs here */}
        <form onSubmit={handleLogin}>
          <Input 
          value={email}
          onChange={({target}) => setEmail(target.value)}
          label="Email Address"
          placeholder="john@example.com"
          type="text"
          />

           <Input 
          value={password}
          onChange={({target}) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 Characters"
          type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button type="submit" className="btn-primary">
          LOGIN 
          </button>
          <p className="text-[13px] text-slate-800 mt-3">Dont have an account?{""}
            <Link className="font-medium text-primary underline" to="/signup">SignUp</Link>
          </p>
          </form>    
            </div>
    </AuthLayout>
  );
};

export default Login;
