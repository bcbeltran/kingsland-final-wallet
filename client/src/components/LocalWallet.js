import React from 'react'
import './localWallet.css';

const LocalWallet = () => {
    const wallet = JSON.parse(window.localStorage.getItem("wallet"));
	const walletText = "Copy Address: " + wallet.publicAddress.slice(0, 10) + "...";

    const handleCopy = () => {
        navigator.clipboard.writeText(wallet.publicAddress);
        alert('Copied address!');
    }

    return (
		<div className="local-wallet" onClick={handleCopy}>
			{walletText}
        </div>
	);
}

export default LocalWallet