import React from 'react'
import {Link} from 'react-router-dom';
import LocalWallet from './LocalWallet';
import './navbar.css';

const Navbar = () => {
	const wallet = JSON.parse(window.localStorage.getItem("wallet"));
  return (
		<div className="home">
			<Link className="home-link" to="/">
				HOME
			</Link>
			{!wallet && (
				<Link className="home-link" to="/create-wallet">
					CREATE WALLET
				</Link>
			)}
			{!wallet ? (
				""
			) : (
				<Link className="home-link" to="/create-transaction">
					CREATE TRANSACTION
				</Link>
			)}
			<a className="home-link" href="/faucet">
				FAUCET
			</a>
			{wallet && <LocalWallet />}
		</div>
  );
}

export default Navbar