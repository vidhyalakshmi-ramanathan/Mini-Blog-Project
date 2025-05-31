import Mainpage from './Pages/Mainpage';
import Homepage from './Pages/Homepage';
import Layout from './Mainlayout/Layout';
import PostsPage from './Pages/Postspage';
import Loginpage from './Pages/Loginpage';
import Signuppage from './Pages/Signuppage';
import Createpage from './Pages/Createpage';
import SinglePost from './Pages/SinglePost';
import Editpage from './Pages/Editpage';
import PrivateRoute from './token/PrivateRoute';
import { SnackbarProvider } from './Components/SnackbarContext';
import {
  Route,Routes,
} from 'react-router-dom';

function App() {
    return(
    <SnackbarProvider>
      <Routes>
        <Route path='/' element={<Layout  />}>
          <Route index element={<Mainpage />} />
          <Route path='/posts' element={<PostsPage />} />
          <Route path='/signup' element={<Signuppage />} />
          <Route path='/login' element={<Loginpage />} />
          <Route path='/singlepost/:id' element={<SinglePost  />}/>
          <Route element={<PrivateRoute/>}>
            <Route path='/homepage' element={<Homepage />}/>
            <Route path='/createpage' element={<Createpage />}/>
            <Route path='/edit/:id' element={<Editpage />}/>
          </Route>
        </Route>
      </Routes>
    </SnackbarProvider>
)
}
export default App;

