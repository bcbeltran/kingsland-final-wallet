import {useState} from 'react'
import {useNavigate} from 'react-router-dom';
import Navbar from './Navbar'
import FormInput from './FormInput';
import './faucet.css';

const Faucet = () => {
	const navigate = useNavigate();
	const wallet = JSON.parse(window.localStorage.getItem("wallet"));
  const [values, setValues] = useState({
		from: "1xK7eymyzVwdRkE3G7XUJFbzwMCpCMsFX",
		to: "",
		value: 100,
		data: "Faucet transaction",
		signingKey:
			"2cc3417983838a6056069b652f8e6e09609baaa8fd5daa794a38061087102bb5",
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
			pattern: `^(?:[13]{1}[a-km-zA-HJ-NP-Z1-9]{26,33}|bc1[a-z0-9]{39,59})$`,
			required: true,
		},
  ];

  const handleSubmit = (e) => {
		e.preventDefault();
		let data = values;

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
			.catch((err) => console.log(err));
  };

  const onChange = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
		<div className="faucet-container">
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