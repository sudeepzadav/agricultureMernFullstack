import { Route, Routes } from "react-router";
import { CustomerProfile, FarmarInfo, FarmerDashboard, Hero, Login, MyProducts, Navbar, Navbar2 } from "./components";


const App = () => {
  return (
    <div>
      <Navbar />
      <Navbar2 />
      <Routes>
        <Route path="/" element={
          <>
          <Hero />
          </>} />
        <Route path="/login" element={<Login type="login" />} />
        <Route path="/signUp" element={<Login type="signUp" />} />
        <Route path="/contact" element= {<FarmarInfo/>} />
        <Route path="/profile" element= {<CustomerProfile/>} />
        <Route path="/farmer/dashboard" element= {<FarmerDashboard/>} />
        <Route path="/farmer/myProducts" element= {<MyProducts/>} />
      </Routes>
    </div>
  );
};

export default App;
