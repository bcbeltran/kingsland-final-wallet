import {useState} from 'react'
import {useNavigate} from 'react-router-dom';
import Navbar from './Navbar'
import FormInput from './FormInput';
import './faucet.css';
const crypto = require('crypto');

const Faucet = () => {
	const navigate = useNavigate();
  const [values, setValues] = useState({
		from: "1xK7eymyzVwdRkE3G7XUJFbzwMCpCMsFX",
		to: "",
		value: 100,
		data: "Faucet transaction",
  });
  const [txData, setTxData] = useState({
		message: "",
		txDataHash: "",
  });

  const inputs = [
		{
			id: 1,
			name: "to",
			type: "string",
			placeholder: "To",
			errorMessage: "Must be a valid address.",
			label: "To",
			pattern: `[a-f0-9]{40}(:.+)?$`,
			required: true,
		},
  ];

  const handleSubmit = (e) => {
		e.preventDefault();
		let data = {
			...values,
			fee: 0,
			dateCreated: new Date().toISOString(),
			senderPubKey: '00000000',
		};

		let transactionJsonData = JSON.stringify(data);
		transactionJsonData.split(" ").join();
		var txHash = crypto
			.createHash("sha256")
			.update(transactionJsonData)
			.digest();

		data = {
			...data,
			transactionDataHash: txHash.toString("hex"),
			senderSignature: ['00000000', '00000000'],
		};

		fetch("http://localhost:3001/transaction/broadcast", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				let { message, txDataHash } = data;
				setTxData({ message, txDataHash });
				navigate("/faucet");
			})
			.catch((err) => {
				setTxData({message: 'Transaction Failed', txDataHash: err.toString()});
				return;
			});
  };

  const onChange = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
		<div className='faucet-container'>
			<Navbar />
			{txData.message === "Transaction Failed" ? (
				<div className="tx-data-fail">
					{txData.message}
					<br></br>
					{txData.txDataHash}
				</div>
			) : txData.message !== "" ? (
				<div className="tx-data">
					{txData.message}
					<br></br>
					100 Burbcoin were sent to: {values.to}
					<br></br>
					Tx Hash: {txData.txDataHash}
				</div>
			) : (
				""
			)}
			<form onSubmit={handleSubmit}>
				<h1>Faucet</h1>
				{inputs.map((input) => (
					<FormInput
						key={input.id}
						{...input}
						value={values[input.name]}
						onChange={onChange}
					/>
				))}
				<div
					className="g-recaptcha"
					data-sitekey="6Lesit0fAAAAAPkLuXFWLEeFQnTyPTDLu0lbJzjT"
				></div>
				<button>Submit</button>
			</form>
		</div>
  );
}

export default Faucet