import React from 'react'
import {Link} from 'react-router-dom';
import './home.css';

const Home = () => {
  const wallet = JSON.parse(window.localStorage.getItem("wallet"));
  return (
		<div className="home-container">
			<Link className="link" to="/create-wallet">
				{wallet ? "DELETE WALLET" : "CREATE WALLET"}
			</Link>
			{wallet && 
			<Link className='link' to='/get-balance'>
				GET BALANCES
			</Link>}
			{wallet &&
			<Link className='link' to='/get-transactions'>
				GET TRANSACTIONS
			</Link>}
			{!wallet ? (
				""
			) : (
				<Link className="link" to="/create-transaction">
					CREATE TRANSACTION
				</Link>
			)}
			<a className="link" href="/faucet">
				FAUCET
			</a>
		</div>
  );
}

export default Home