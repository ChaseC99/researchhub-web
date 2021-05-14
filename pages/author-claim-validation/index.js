import { authenticateToken } from "./api/authorClaimValidateToken";
import { css, StyleSheet } from "aphrodite";
import { getPageBody } from "./util";
import React, { useEffect, useMemo, useState } from "react";
import { VALIDATION_STATE } from "./constants";

export default function AuthorClaimValidation() {
  const [validationState, setValidationState] = useState(
    VALIDATION_STATE.LOADING
  );

  const pageBody = useMemo(() => getPageBody(validationState), [
    getPageBody,
    validationState,
  ]);

  const onValidationError = useCallback(() => {});

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search || "");
    const token = urlParams.get("token");
    if (isNullOrUndefined(token) || token.length < 1) {
      setValidationState(VALIDATION_STATE.REQUEST_NOT_FOUND);
    } else if (validationState === VALIDATION_STATE.LOADING) {
      authenticateToken({
        onError,
        onSuccess: () => setValidationState(VALIDATION_STATE.VALIDATED),
        token,
      });
    }
  }, [setValidationState, validationState]);

  return <div className={css(styles.authorClaimValidation)}>{pageBody}</div>;
}

const styles = StyleSheet.create({
  authorClaimValidation: {
    height: "100%",
    padding: 16,
    width: "100%",
  },
});
