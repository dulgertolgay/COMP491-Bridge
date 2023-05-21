import styles from "../styles/index.module.scss";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

import BaseButton from "../components/baseButton";
import TransactionCard from "@/components/transactionCard";

const Home = () => {
  const {
    balance,
    account,
    network,
    connectWallet,
    sendTransactionAvaxToZate,
    sendTransactionZateToAvax,
    changeNetwork,
    resetBalance,
  } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [originNetwork, setOriginNetwork] = useState("avax");
  const [destinationNetwork, setDestinationNetwork] = useState("zate");
  const [selectedCrypto, setSelectedCrypto] = useState("zate");
  const [amount, setAmount] = useState(10);

  const buttonDisabled =
    (originNetwork === "zate" && network !== "zate") || balance < amount;

  const handleClick = async () => {
    if (account) {
      setLoading(true);
      if (originNetwork === "avax") {
        await sendTransactionAvaxToZate(amount);
      } else {
        await sendTransactionZateToAvax(amount);
      }
      setLoading(false);
    } else {
      connectWallet();
    }
  };

  const switchNetwork = () => {
    if (originNetwork === "avax") {
      setOriginNetwork("zate");
      setDestinationNetwork("avax");
      resetBalance();
    } else {
      setOriginNetwork("avax");
      setDestinationNetwork("zate");
      changeNetwork();
    }
  };

  const handleTransactionData = (key, val) => {
    switch (key) {
      case "originNetwork":
        setOriginNetwork(val);
        break;
      case "destinationNetwork":
        setDestinationNetwork(val);
        break;
      case "selectedCrypto":
        setSelectedCrypto(val);
        break;
      default:
        setAmount(val);
    }
  };

  return (
    <div id={styles.main} className="flex jc-c p-24">
      <div className={`${styles.cardModified} base-card`}>
        <p className="card-title bold">BRIDGE</p>
        <p className="card-desc">Send your assets</p>
        <TransactionCard
          balance={balance}
          originNetwork={originNetwork}
          destinationNetwork={destinationNetwork}
          selectedCrypto={selectedCrypto}
          amount={amount}
          onDataChange={handleTransactionData}
          switchNetwork={switchNetwork}
        />
        <BaseButton
          variant="primary"
          width="100%"
          clickAction={handleClick}
          loading={loading}
          disabled={buttonDisabled}
        >
          {account ? "Send" : "Connect to Wallet"}
        </BaseButton>
        {originNetwork === "zate" && network !== "zate" ? (
          <span className={`${styles.errorText} s2`}>
            Switch to ZATE network
          </span>
        ) : (
          balance < amount && (
            <span className={`${styles.errorText} s2`}>
              There is not enough balance in your wallet
            </span>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
