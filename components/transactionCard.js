import styles from "../styles/components/transactionCard.module.scss";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

const TransactionCard = (props) => {
  const {
    originNetwork,
    destinationNetwork,
    selectedCrypto,
    amount,
    onDataChange,
    switchNetwork,
  } = props;

  const networks = [
    {
      val: "avax",
      name: "Fuji (C-Chain)",
    },
    {
      val: "zate",
      name: "ZATE",
    },
  ];

  const handleDataChange = (e, key) => {
    const val = e.target.value;
    onDataChange(key, val);
  };

  return (
    <div className={styles.transactionCard}>
      <div className={`${styles.head} flex ai-c`}>
        <span className="s1">From</span>
        <FormControl
          size="small"
          className={styles.customInput}
          style={{ marginRight: "30px" }}
        >
          <Select
            value={originNetwork}
            onChange={(e) => handleDataChange(e, "originNetwork")}
            defaultValue="avax"
          >
            {networks.map((network) => (
              <MenuItem value={network.val}>
                <img
                  src={`/cryptoIcons/${network.val}.svg`}
                  width={24}
                  height={24}
                  style={{ marginRight: "5px" }}
                />
                <span className="s1 medium">{network.name}</span>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <img
          src="/switch-icon.svg"
          className={styles.switchIcon}
          width={20}
          height={20}
          onClick={switchNetwork}
        />
        <span className="s1">To</span>
        <FormControl size="small" className={styles.customInput}>
          <Select
            value={destinationNetwork}
            onChange={(e) => handleDataChange(e, "destinationNetwork")}
            defaultValue="zate"
          >
            {networks.map((network) => (
              <MenuItem value={network.val}>
                <img
                  src={`/cryptoIcons/${network.val}.svg`}
                  width={24}
                  height={24}
                  style={{ marginRight: "5px" }}
                />
                <span className="s1 medium">{network.name}</span>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className={`${styles.innerCard} flex ai-c`}>
        <FormControl size="small" className={styles.customInput}>
          <Select
            value={selectedCrypto}
            onChange={(e) => handleDataChange(e, "selectedCrypto")}
            defaultValue="zate"
          >
            <MenuItem value={"zate"}>
              <img
                src={`/cryptoIcons/eth.svg`}
                width={20}
                height={20}
                style={{ marginRight: "5px" }}
              />
              <span className="medium">ZATE</span>
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          value={amount}
          onChange={(e) => handleDataChange(e, "amount")}
        />
      </div>
    </div>
  );
};

export default TransactionCard;
