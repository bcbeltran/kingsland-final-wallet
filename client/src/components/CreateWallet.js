import Navbar from './Navbar';
import {useNavigate} from 'react-router-dom';
import './createWallet.css';
const CoinKey = require('coinkey');


const CreateWallet = () => {
	const wallet = JSON.parse(window.localStorage.getItem('wallet'));
	const navigate = useNavigate();

		const handleCreateWallet = () => {
			var wallet = new CoinKey.createRandom();

			const newWallet = {
				privateKey: wallet.privateKey.toString('hex'),
				publicAddress: wallet.publicAddress
			}
			window.localStorage.setItem('wallet', JSON.stringify(newWallet));
			alert(`This is your new wallet. WRITE DOWN YOUR PRIVATE KEY AND NEVER SHARE IT!!!!!
			Private key: ${newWallet.privateKey}
			Public address: ${newWallet.publicAddress}`);
			navigate('/');

		};

		const handleDeleteWallet = () => {
			window.localStorage.removeItem('wallet');
			alert('Wallet has been removed from local storage.');
			navigate('/');
		}

		return (
			<div>
				<Navbar />
			{wallet
			?
			(
			<div className='wallet'>
			<h2>You have created a wallet: </h2>
			<h4>Public Address: {wallet.publicAddress}</h4>
			<button onClick={handleDeleteWallet}>Delete Wallet?</button>
			</div>
			) 
			:
			(
			<div className='wallet'>
				<h1>Create Wallet</h1>
				<button onClick={handleCreateWallet}>Create Wallet</button>
			</div>
			
			)
			
			}
			</div>
		);
}

export default CreateWallet