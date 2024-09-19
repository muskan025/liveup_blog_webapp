import { NavLink, useNavigate } from "react-router-dom";
import { Button, FormName, InputField } from "../common/input/Form";
import { useForm } from "../hooks/useForm";
import { toast } from "react-toastify";
import { validateEmail, validatePassword, validateUsername } from "../utils/authValidation";
import { useRegisterMutation } from "../reduxToolkit/slices/apiSlice";
import indexStyle from '../styles/index.module.scss';

const SignUp = () => {
  const initialState = {
    name: '',
    username: '',
    email: '',
    password: '',
  };

  const { formData, handleChange, resetForm, errors, setErrors } = useForm(initialState);
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation()

  function validateForm() {
    let newErrors = {};

    const isUsernameValid = validateUsername(formData.username).error;
    const isEmailValid = validateEmail(formData.email).error;
    const isPasswordValid = validatePassword(formData.password).error;

    if (!formData.name) newErrors.name = "Name is required";
    if (isUsernameValid) newErrors.username = isUsernameValid;
    if (isEmailValid) newErrors.email = isEmailValid;
    if (isPasswordValid) newErrors.password = isPasswordValid;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) {

       const userDetails = {...formData, username:formData.username?.toLowerCase()}
 
      try {
        const response = await register(userDetails).unwrap();

        if (response.status === 201) {
          toast.success("Welcome to LiveUp!");
          resetForm();
          navigate('/login');
        }
        else {
          toast.error(response.message || "Something went wrong");
        }

      }
      catch (error) {
        toast.error("Registration failed");
      }
    }
  }

 

  return (
    <section className={`${indexStyle.wrapper}`}>
      <section className={indexStyle.form_container}>
        <div className={indexStyle.form_sub_container}>
          <FormName name="Sign Up" />
          <form onSubmit={handleSubmit}>
            <InputField type="text" name="name" placeholder="Name*" value={formData.name} onChange={handleChange} error={errors?.name} />
            <InputField type="text" name="username" placeholder="Username*" value={formData.username.toLowerCase()} onChange={handleChange} error={errors?.username} />
            <InputField type="email" name="email" placeholder="Email Address*" value={formData.email} onChange={handleChange} error={errors?.email} />
            <InputField type="password" name="password" placeholder="Password*" value={formData.password} onChange={handleChange} error={errors?.password} />
            <Button name={isLoading ? "Signing up..." : "Sign Up Now"} width="100%" />
          </form>
          <p>Already have an account? <NavLink to="/login">Login</NavLink></p>
        </div>
      </section>
    </section>
  );
};

export default SignUp;