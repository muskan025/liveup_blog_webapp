import { Link } from "react-router-dom"
import error from "../assets/error.png"
import Header from "../common/header/Header"
import Footer from "../common/footer/Footer"
import { Button } from "../common/input/Form"
import indexStyle from "../styles/index.module.css"

const Error = () => {
  return (
    <>
    <Header/>
      <section className={`${indexStyle.error_page} ${indexStyle.wrapper}`}>
     <img src={error} alt=""  />
     <p>Oops! This page can’t be found</p>
     <Link to="/"><Button name="Go Back Home">Go Back Home</Button></Link>
     </section>
     <Footer/>
    </>
  )
}

export default Error
