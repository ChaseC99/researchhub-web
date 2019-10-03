import React from "react";
import { StyleSheet, css } from "aphrodite";
import TextareaAutosize from "react-autosize-textarea";

// Config
import colors from "../../config/themes/colors";

const FormTextArea = (props) => {
  let {
    id,
    label,
    placeholder,
    required,
    containerStyle,
    labelStyle,
    inputStyle,
    onChange,
  } = props;

  return (
    <div
      id={id}
      className={css(styles.inputContainer, containerStyle && containerStyle)}
    >
      <div
        className={css(
          styles.inputLabel,
          labelStyle && labelStyle,
          styles.text,
          !label && styles.hide
        )}
      >
        {label && label}
        {required && <div className={css(styles.asterick)}>*</div>}
      </div>
      <TextareaAutosize
        className={css(styles.input, styles.text)}
        required={required && required}
        placeholder={placeholder && placeholder}
        style={inputStyle && inputStyle}
        onChange={(e) => onChange && onChange(id, e.target.value)}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    // height: 75,
    width: 600,
    display: "flex",
    flexDirection: "column",
    alignItems: "space-between",
    marginTop: 20,
    marginBottom: 20,
    position: "relative",
  },
  inputLabel: {
    height: 19,
    fontWeight: "500",
    marginBottom: 10,
    color: "#232038",
    display: "flex",
    justifyContent: "flex-start",
  },
  input: {
    minHeight: 130,
    width: 570,
    display: "flex",
    alignItems: "center",
    border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
    padding: 15,
    fontWeight: "400",
    borderRadius: 2,
    color: "#232038",
    highlight: "none",
    outline: "none",
    ":focus": {
      borderColor: "#D2D2E6",
    },
  },
  asterick: {
    color: colors.BLUE(1),
  },
  placeholder: {
    color: "#8e8d9a",
    fontWeight: 400,
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 16,
  },
});

export default FormTextArea;