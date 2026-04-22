import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/UserLayout";
import Home from "./pages/user/Home";
import { About } from "./pages/user/About";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout />}>
        <Route path="/" element={<Home/>}/>
        <Route path="/user/about" element={<About/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
