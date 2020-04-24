import { StyleSheet, css } from "aphrodite";

const EmptyState = (props) => {
  let { text, subtext, icon } = props;
  return (
    <div className={css(styles.emptyContainer)}>
      <div className={css(styles.icon)}>
        {icon ? icon : <i className="fad fa-file-alt" />}
      </div>
      {text && text}
      <div className={css(styles.subtext)}>{subtext && subtext}</div>
    </div>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    fontSize: 20,
    fontWeight: 500,
    width: "100%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "@media only screen and (max-width: 415px)": {
      fontSize: 16,
    },
  },
  icon: {
    fontSize: 50,
    color: "rgb(78, 83, 255)",
    height: 50,
    marginBottom: 25,
  },
  subtext: {
    fontSize: 16,
    color: "rgba(36, 31, 58, 0.8)",
    fontWeight: 400,
    marginTop: 10,
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
});

export default EmptyState;