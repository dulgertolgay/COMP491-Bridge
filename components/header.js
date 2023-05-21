import styles from "../styles/components/header.module.scss";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Link from "next/link";
import BaseButton from "./baseButton";

const Header = () => {
  const { account, connectWallet } = useContext(AppContext);
  return (
    <Navbar id={styles.header} bg="light" expand="lg" className="jc-sb">
      <Container>
        <Link href="/" className={styles.brand}>
          Bridge
        </Link>
        {account ? (
          <BaseButton variant="primary" width="250px">
            Connected
          </BaseButton>
        ) : (
          <BaseButton
            variant="primary"
            width="250px"
            clickAction={connectWallet}
          >
            Connect to Wallet
          </BaseButton>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
