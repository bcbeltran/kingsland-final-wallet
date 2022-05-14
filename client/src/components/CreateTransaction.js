import {useState} from 'react'
import {useNavigate} from 'react-router-dom';
import Navbar from './Navbar'
import FormInput from './FormInput';
import './createTransaction.css';
const RIPEMD160 = require("ripemd160");
const secp256k1 = require('secp256k1');
const Buffer = require('buffer/').Buffer;
const crypto = require('crypto');

const CreateTransaction = () => {
	const wallet = JSON.parse(window.localStorage.getItem("wallet"));
	const navigate = useNavigate();
  const [values, setValues] = useState({
		from: "",
        to: '',
        value: undefined,
        data: '',
  });
  const [txData, setTxData] = useState({
	  message: '',
	  txDataHash: ''
  });

  const inputs = [
		{
			id: 1,
			name: "from",
			type: "string",
			placeholder: "From",
			errorMessage: "Must be a valid address.",
			label: "From",
			pattern: `^[a-f0-9]{40}(:.+)?$`,
			required: true,
		},
		{
			id: 2,
			name: "to",
			type: "string",
			placeholder: "To",
			errorMessage: "Must be a valid address.",
			label: "To",
			pattern: `^[a-f0-9]{40}(:.+)?$`,
			required: true,
		},
		{
			id: 3,
			name: "value",
			type: "int",
			placeholder: "Value",
			errorMessage: "Must be a valid integer.",
			label: "Value",
			pattern: "^[0-9]+$",
			required: true,
		},
		{
			id: 4,
			name: "data",
			type: "string",
			placeholder: "Data",
			errorMessage: "Must be a string, in JSON format or empty.",
			label: "Data",
		},
  ];

  const handleSubmit = (e) => {
		e.preventDefault();

		let data = {
			...values,
			fee: 10,
			dateCreated: new Date().toISOString(),
			senderPubKey: wallet.senderPubKey,
		};
		
		let transactionJsonData = JSON.stringify(data);
		transactionJsonData.split(' ').join();

		
		let publicKey = [];
		
		for(let i in wallet.publicKey) {
			publicKey.push(wallet.publicKey[i]);
		}
		
		const comparePublicKey = secp256k1.publicKeyCreate(new Uint8Array(wallet.privateKey.data));

		var comparePublicAddress = new RIPEMD160("ripemd160")
			.update(comparePublicKey.toString("hex"))
			.digest("hex");

		if(comparePublicAddress !== data.from) {
			setTxData({
				message: "Transaction Failed",
				txDataHash: "You can only send transactions from a wallet that you own.",
			});
			return txData;
		}

		var txHash = crypto.createHash("sha256").update(transactionJsonData).digest();
		let msg = Buffer.from(txHash);
		var sigObj = secp256k1.ecdsaSign(msg, new Uint8Array(wallet.privateKey.data));
		let r = Buffer.from(sigObj.signature.slice(0, 32)).toString('hex');
		let s = Buffer.from(sigObj.signature.slice(32)).toString('hex');
		var isValid = secp256k1.ecdsaVerify(sigObj.signature, msg, new Uint8Array(publicKey));

		if(!isValid) {
			setTxData({
				message: "Transaction Failed",
				txDataHash: "The signature for this transaction is invalid.",
			});
			return txData;
		}

		data = {
			...data,
			transactionDataHash: txHash.toString('hex'),
			senderSignature: [r, s]
		};

		console.log(data);

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
				navigate("/create-transaction");
			})
			.catch((err) => {
				setTxData({ message: "Transaction Failed", txDataHash: err.toString() });
			});
  };

  const onChange = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
		<div className='create-transaction-container'>
			<Navbar />
			{txData.message === "Transaction Failed" ? (
				<div className="tx-data-fail">
					{txData.message}
					<br></br>
					{txData.txDataHash}
				</div>
			) : txData.message !==  '' ? (
				<div className="tx-data">
					{txData.message}
					<br></br>
					Tx Hash: {txData.txDataHash}
				</div>
			) : ('')}
			<form onSubmit={handleSubmit}>
				<h1>Create Transaction</h1>
				{inputs.map((input) => (
					<FormInput
						key={input.id}
						{...input}
						value={values[input.name]}
						onChange={onChange}
					/>
				))}
				<button>Submit Transaction</button>
			</form>
		</div>
  );
}

export default CreateTransaction