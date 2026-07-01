import { Route, Routes } from "react-router";
import {
  Cart,
  FarmarInfo,
  FarmerDashboard,
  FarmerSetting,
  Footer,
  Hero,
  Login,
  Navbar,
  Navbar2,
  OrderList,
  VerifyEmail,
} from "./components";
import CustomerDashboard from "./components/CustomerProfile/customerProfile";
import MyProducts from "./components/farmarInfo/myProducts";

const App = () => {
  return (
    <div>
      <Navbar />
      <Navbar2 />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
            </>
          }
        />
        <Route path="/login" element={<Login type="login" />} />
        <Route path="/signUp" element={<Login type="signUp" />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/contact" element={<FarmarInfo />} />
        <Route path="/farmerDashboard" element={<FarmerDashboard />} />
        <Route path="/customerDashboard" element={<CustomerDashboard />} />
        <Route path="/farmer/myProducts" element={<MyProducts />} />
        <Route path="/farmer/orders" element={<OrderList />} />
        <Route path="/farmer/farmerSetting" element={<FarmerSetting />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;