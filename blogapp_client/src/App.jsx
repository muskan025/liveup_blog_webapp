
import { Outlet, useLocation} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './common/footer/Footer'
import Header from './common/header/Header'
import { useEffect } from 'react';
import indexStyle from './styles/index.module.scss'

 
function App() {

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Header />
      <ToastContainer 
      position="bottom-left"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      className={indexStyle.toast_container}
      />
     <main className={indexStyle.main_content_wrapper}>
     <Outlet />
     </main>
      <Footer />
      
     </>
  )
}

export default App
