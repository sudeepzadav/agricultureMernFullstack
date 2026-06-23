import { Route, Routes } from "react-router";
import { FarmarInfo, Hero, Login, Navbar, Navbar2 } from "./components";

const App = () => {
  return (
    <div>
      <Navbar />
      <Navbar2 />
      <Routes>
        <Route path="/" element={
          <>
          <Hero />
          <FarmarInfo />
          </>} />
        <Route path="/login" element={<Login type="login" />} />
        <Route path="/signUp" element={<Login type="signUp" />} />
      </Routes>
    </div>
  );
};

export default App;
