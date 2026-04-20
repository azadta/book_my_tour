import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/UserLayout";
import Home from "./pages/user/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout />}>
        <Route path="/" element={<Home/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
