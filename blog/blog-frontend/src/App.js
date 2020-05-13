import React from 'react';
import { Route } from 'react-router-dom';
import PostListPage from './pages/PostListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WirtePage from './pages/WirtePage';
import PostPage from './pages/PostPage';



const App = () => {
  return (
    <>
      <Route component={PostListPage} path={['/@:username', '/']} exact />
      <Route component={LoginPage} path='/login' />
      <Route component={RegisterPage} path='/register' />
      <Route component={WirtePage} path='/write' /> 
      <Route component={PostPage} path='/@:username/:postId' />
    </>
  );
};

export default App;