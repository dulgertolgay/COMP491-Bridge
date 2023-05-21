import styles from "../styles/components/baseButton.module.scss";

import LoadingButton from "@mui/lab/LoadingButton";

const BaseButton = (props) => {
  const { children, width, variant, clickAction, loading, disabled } = props;
  return (
    <div className={`${styles.wrapper} ${disabled && styles.disabled}`}>
      <LoadingButton
        variant="outlined"
        className={`${styles.baseButton} ${variant} flex ai-c jc-c`}
        style={{ width: width ? width : "fit-content" }}
        onClick={clickAction}
        loading={loading}
        disabled={disabled}
      >
        {children}
      </LoadingButton>
    </div>
  );
};

export default BaseButton;
