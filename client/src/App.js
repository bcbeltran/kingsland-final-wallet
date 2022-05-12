import "./App.css";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Footer from "./components/Footer";
import Home from "./components/Home";
import CreateWallet from "./components/CreateWallet";
import CreateTransaction from "./components/CreateTransaction";
import Faucet from "./components/Faucet";
import ErrorPage from "./components/ErrorPage";
import LocalWallet from "./components/LocalWallet";

function App() {
	return (
    <Router>
    <div className="app">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/create-wallet' element={<CreateWallet />} />
        <Route path='/create-transaction' element={<CreateTransaction />} />
        <Route path='/faucet' element={<Faucet />} />
        <Route path='*' element={<ErrorPage/>} />
      </Routes>
    <Footer />
    </div>
    </Router>
	);
}

export default App;
