import { Route, Routes } from "react-router";
import { FarmarInfo, FarmerDashboard, Footer, Hero, Login, MyProducts, Navbar, Navbar2, OrderList } from "./components";
import CustomerDashboard from "./components/CustomerProfile/customerProfile";


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
        <Route path="/farmerDashboard" element= {<FarmerDashboard/>} />
        <Route path="/customerDashboard" element= {<CustomerDashboard/>} />
        <Route path="/farmer/myProducts" element= {<MyProducts/>} />
        <Route path="/farmer/orders" element= {<OrderList/>} />
      </Routes>
      <Footer/>
    </div>
  );
};

export default App;
