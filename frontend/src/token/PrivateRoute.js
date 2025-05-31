import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {useToken} from './useToken';

const PrivateRoute = () => {
  const currentPath = useLocation()
  const {token} = useToken();
  const privateRoutes = ['/homepage','/createpage','/editpage']
  const isProtected = privateRoutes.includes(currentPath.pathname)
  if(isProtected && !token){
    return <Navigate to='/login' replace={true} />
  }
  return <Outlet />;
};

export default PrivateRoute;
