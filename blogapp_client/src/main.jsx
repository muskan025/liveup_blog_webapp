import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import Error from './pages/Error.jsx'
import { store } from './reduxToolkit/store.js'
import { Provider } from 'react-redux'
import PrivateRoute from './components/PrivateRoute.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { SkeletonTheme } from 'react-loading-skeleton'
import { lazy, Suspense } from 'react'
import SkeletonLoader from './components/Skeletons/SkeletonLoader.jsx'

const Home = lazy(() => import('./pages/Home.jsx'));
const AboutUs = lazy(() => import('./pages/AboutUs.jsx'));
const ExploreBlogs = lazy(() => import('./pages/ExploreBlogs.jsx'));
const CreateBlog = lazy(() => import('./pages/CreateBlog.jsx'));
const SingleBlog = lazy(() => import('./pages/SingleBlog.jsx'));
const ViewerProfile = lazy(() => import('./pages/ViewerProfile.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const SignUp = lazy(() => import('./pages/SignUp.jsx'));

let persistor = persistStore(store)
 
const router = createBrowserRouter([
  { 
    element: <App />,  
    errorElement: <Error />,
    children: [
      {  
        path: '/',
        element: <Suspense fallback={<SkeletonLoader/> }><Home /></Suspense>
      },
      {
        path: '/about-us',
        element: <Suspense fallback={<SkeletonLoader />}><AboutUs /></Suspense>
      }, 
      {
        path: '/explore-blogs',
        element: <Suspense fallback={<SkeletonLoader />}><ExploreBlogs /></Suspense>
      },
      {
        path: '/blog/:blogId',
        element: <Suspense fallback={<SkeletonLoader />}><SingleBlog /></Suspense>
      },
      { 
        element: <PrivateRoute />,
        children: [
          {
            path: '/create-blog/:username',
            element: <Suspense fallback={<SkeletonLoader />}><CreateBlog /></Suspense>
          },
        ]
      }, 
      {
        path: '/profile/:username',
        element: <Suspense fallback={<SkeletonLoader />}><ViewerProfile /></Suspense>
      },
      {
        path: '/sign-up',
        element: <Suspense fallback={<SkeletonLoader />}><SignUp /></Suspense>
      },
      {
        path: '/login',
        element: <Suspense fallback={<SkeletonLoader />}><Login /></Suspense>
      },
    ]
  }
], { 
  scrollRestoration: 'top',
})

const root = createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SkeletonTheme baseColor="#313131" highlightColor="#525252">
        <RouterProvider router={router} />
      </SkeletonTheme>
    </PersistGate>
  </Provider> 
)
