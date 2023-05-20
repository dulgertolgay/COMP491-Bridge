import styles from "../styles/index.module.scss";

import Image from "next/image";

export default function Home() {
  return (
    <div
      id={styles.main}
      className="flex flex-col items-center justify-between p-24"
    ></div>
  );
}