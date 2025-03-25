import '../../styles/Landing.css';
import { Route, Routes } from 'react-router-dom';
import { Auth } from './auth';

export const Landing = () => {
  return (
    <Routes>
      <Route path={"/auth/*"} element={<Auth/>}/>
    </Routes>
  );
};
