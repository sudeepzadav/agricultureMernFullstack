import { Route, Routes } from "react-router";
import {
  Cart,
  ContactForm,
  CustomerProfile,
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
import MyProducts from "./components/farmarInfo/myProducts";
import CustomerDashboard from "./components/CustomerProfile/customerDashboard";

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
        <Route
          path="/contact"
          element={
            <>
              <FarmarInfo />
              <ContactForm />
            </>
          }
        />
        <Route path="/login" element={<Login type="login" />} />
        <Route path="/signUp" element={<Login type="signUp" />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/farmerDashboard" element={<FarmerDashboard />} />
        <Route path="/customerDashboard" element={<CustomerDashboard />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
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
