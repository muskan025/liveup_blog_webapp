import { useSelector } from 'react-redux';
import { Navigate, Outlet} from 'react-router-dom';

const PrivateRoute = () => {
  const { isAuth } = useSelector((state) => state.userData);
 
 
  return   isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;