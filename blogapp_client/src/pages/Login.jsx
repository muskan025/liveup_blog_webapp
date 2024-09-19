import { NavLink, useNavigate } from "react-router-dom"
import { Button, FormName, InputField } from "../common/input/Form"
import { useDispatch} from "react-redux"
import { useForm } from "../hooks/useForm"
import { toast } from "react-toastify"
import { useLoginMutation } from "../reduxToolkit/slices/apiSlice"
import { setUser } from "../reduxToolkit/slices/userSlice"
import { useState } from "react"
import indexStyle from '../styles/index.module.scss'

const Login = () => {

  const initialState = {
    loginId: '',
    password: '',
  };
  

  const { formData, handleChange, resetForm } = useForm(initialState)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [errors,setErrors] = useState('')
   const [login, { isLoading }] = useLoginMutation()



  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await login(formData).unwrap();
      const user = response.data
       if (response.status === 200) {
        dispatch(setUser(response.data))
        const username = response.data.username
        resetForm()
        navigate(`/profile/${username}`, {state:user});
      }
      else {
        setErrors(response.message)
        toast.error(response.message || "Login failed");
      }

    } catch (error) {
        toast.error("Login failed");
    }
  }


  return (

    <section className={`${indexStyle.wrapper}`}>
       <section className={`${indexStyle.form_container} `}>
        <div className={indexStyle.form_sub_container}>
          <FormName name="Login" />
          <form onSubmit={handleSubmit}>
            <p className={indexStyle.error}>{errors}</p>
            <InputField type="text" name="loginId" placeholder="Username / Email Address*" value={formData.username ? formData.username : formData.email} onChange={handleChange} />
            <InputField type="password" name="password" placeholder="Password*" value={formData.password} onChange={handleChange} />
            <Button name={isLoading ? "Logging in..." : "Login Now"} width="100%" />
          </form>
          <p>Don&apos;t have an account? <NavLink to="/sign-up">Create One</NavLink></p>
        </div>
      </section>
      </section>
   )
}

export default Login
