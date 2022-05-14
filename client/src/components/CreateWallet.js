import Navbar from './Navbar';
import {useNavigate} from 'react-router-dom';
import './createWallet.css';

const RIPEMD160 = require('ripemd160');
const { randomBytes } = require('crypto');
const secp256k1 = require('secp256k1');


const CreateWallet = () => {
	const wallet = JSON.parse(window.localStorage.getItem('wallet'));
	const navigate = useNavigate();

		const handleCreateWallet = () => {
			let privateKey;
			do {
				privateKey = randomBytes(32)
			} while (!secp256k1.privateKeyVerify(privateKey));

			const publicKey = secp256k1.publicKeyCreate(privateKey);

			var publicAddress = new RIPEMD160("ripemd160")
				.update(publicKey.toString('hex'))
				.digest("hex");

			const newWallet = {
				privateKey,
				publicKey,
				senderPubKey: Buffer.from(publicKey).toString('hex'),
				publicAddress: publicAddress,
			};

			window.localStorage.setItem("wallet", JSON.stringify(newWallet));
		
			alert(`This is your new wallet. WRITE DOWN YOUR PRIVATE KEY AND NEVER SHARE IT!!!!!
			Private key: ${newWallet.privateKey.toString('hex')}
			Public key: ${Buffer.from(newWallet.publicKey).toString('hex')}
			Public address: ${newWallet.publicAddress}`);
			navigate("/");
		};

		const handleDeleteWallet = () => {
			window.localStorage.removeItem('wallet');
			alert('Wallet has been removed from local storage.');
			navigate('/');
		};

		return (
			<div className='wallet'>
				<Navbar />
			{wallet
			?
			(
			<>
			<h2>You have created a wallet: </h2>
			<h4>Public Address: {wallet.publicAddress}</h4>
			<button onClick={handleDeleteWallet}>Delete Wallet?</button>
			</>
			) 
			:
			(
			<>
				<h1>Create Wallet</h1>
				<button onClick={handleCreateWallet}>Create Wallet</button>
			</>
			
			)
			
			}
			</div>
		);
}

export default CreateWallet