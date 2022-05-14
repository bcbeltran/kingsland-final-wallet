import React, { useState } from "react";
import "./getBalance.css";
import Navbar from "./Navbar";
import "./getTransactions.css";

const GetTransactions = () => {
	let wallet = JSON.parse(window.localStorage.getItem("wallet"));
	let address = wallet.publicAddress;

	let [transactionData, setTransactionData] = useState({
		address: "",
		transactions: [],
	});
	let [errorData, setErrorData] = useState({
		message: "",
		data: "",
	});

	fetch(`http://localhost:3001/address/${address}/transactions`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			let { address, transactions } = data;
			setTransactionData({
				address: address,
				transactions: transactions,
			});
		})
		.catch((err) => {
			setErrorData({
				message: "Transaction Failed",
				data: err.toString(),
			});
		});

	return (
		<div className="everything">
			<Navbar />
			<div className="transaction-box">
				<h3>Transactions For Address: {address}</h3>
				<hr />
			</div>
			<div>
				{errorData.message === "Transaction Failed" ? (
					<div className="transaction-box">
						<h1>{errorData.message}</h1>
						<h3>{errorData.data}</h3>
					</div>
				) : (
					<div>
						{transactionData.transactions.length === 0 ? (
                            <div>
							<h3 className="h3">
								You have <span>0</span> transactions.
							</h3>
                            </div>
						) : (
							transactionData.transactions.map((transaction) => {
								return (
									<div className="transaction-container">
										<p>
											Transaction ID:{" "}
											{transaction.transactionId}
										</p>
										<p>From: {transaction.from}</p>
										<p>To: {transaction.to}</p>
										<p>Value: {transaction.value}</p>
										<p>Fee: {transaction.fee}</p>
										<p>
											Date Created:{" "}
											{transaction.dateCreated}
										</p>
										<p>Data: {transaction.data}</p>
										<p>
											Transaction Hash:{" "}
											{transaction.transactionDataHash}
										</p>
										<p>
											Sender Public Key:{" "}
											{transaction.senderPubKey}
										</p>
										<p>
											Sender Signature:{" "}
											{transaction.senderSignature.join(
												", "
											)}
										</p>
									</div>
								);
							})
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default GetTransactions;
