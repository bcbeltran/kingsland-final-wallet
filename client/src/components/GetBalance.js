import React, { useState } from "react";
import "./getBalance.css";
import Navbar from "./Navbar";

const GetBalance = () => {
	let wallet = JSON.parse(window.localStorage.getItem("wallet"));
	let address = wallet.publicAddress;

	let [balanceData, setBalanceData] = useState({
		safe: "",
		confirmed: "",
		pending: "",
	});
	let [txData, setTxData] = useState({
		message: "",
		data: "",
	});

	fetch(`http://localhost:3001/address/${address}/balance`, {
		method: "GET",
		headers: { "Content-Type": "application/json" }
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			let { safeBalance, confirmedBalance, pendingBalance } = data;
			setBalanceData({
				safe: safeBalance,
				confirmed: confirmedBalance,
				pending: pendingBalance,
			});
		})
		.catch((err) => {
			setTxData({
				message: "Transaction Failed",
				data: err.toString(),
			});
		});

	return (
        <div className="balance-box">
		<div className="balance-container">
			<Navbar />
			{txData.message === "Transaction Failed" ? (
				<div>
					<h1>{txData.message}</h1>
					<h3>{txData.data}</h3>
				</div>
			) : (
				<div>
					<h3>Balances For Address: {address}</h3>
					<hr />
					<ul>
						Safe balance includes transactions with 6 or more
						confirmations.
						<li>
							<h3>
								Safe Balance: <span>{balanceData.safe}</span>{" "}
								Burbcoin
							</h3>
						</li>
						Confirmed balance includes transactions with 1-6
						confirmations.
						<li>
							<h3>
								Confirmed Balance:{" "}
								<span>{balanceData.confirmed}</span> Burbcoin
							</h3>
						</li>
						Pending balance includes transactions with 0
						confirmations.
						<li>
							<h3>
								Pending Balance:{" "}
								<span>{balanceData.pending}</span> Burbcoin
							</h3>
						</li>
					</ul>
				</div>
			)}
		</div>

        </div>
	);
};

export default GetBalance;
