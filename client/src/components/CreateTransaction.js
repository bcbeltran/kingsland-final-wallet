import {useState} from 'react'
import {useNavigate} from 'react-router-dom';
import Navbar from './Navbar'
import FormInput from './FormInput';
import './createTransaction.css';

const CreateTransaction = () => {
	const wallet = JSON.parse(window.localStorage.getItem("wallet"));
	const navigate = useNavigate();
  const [values, setValues] = useState({
		from: "",
        to: '',
        value: undefined,
        data: '',
		signingKey: '',
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
			pattern: `^(?:[13]{1}[a-km-zA-HJ-NP-Z1-9]{26,33}|bc1[a-z0-9]{39,59})$`,
			required: true,
		},
		{
			id: 2,
			name: "to",
			type: "string",
			placeholder: "To",
			errorMessage: "Must be a valid address.",
			label: "To",
			pattern: `^(?:[13]{1}[a-km-zA-HJ-NP-Z1-9]{26,33}|bc1[a-z0-9]{39,59})$`,
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
		let data = values;

		data.signingKey = wallet.privateKey;

		fetch('http://localhost:3001/transaction/broadcast', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		}).then(res => {
			return res.json();
		}).then(data => {
			let {message, txDataHash} = data;
			setTxData({message, txDataHash});
			navigate('/create-transaction');
		})
		.catch(err => {
			setTxData({message: "Transaction Failed", txDataHash: ""})
		});
  };

  const onChange = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
		<div>
			<Navbar />
			{txData.txDataHash === "" ? (
				""
			) : (
				<div className="tx-data">
					{txData.message}
					<br></br>
					Tx Hash: {txData.txDataHash}
				</div>
			)}
			{txData.message === "Transaction Failed" ? (
				<div className="tx-data-fail">
					{txData.message}
				</div>
			) : (
				""
			)}
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