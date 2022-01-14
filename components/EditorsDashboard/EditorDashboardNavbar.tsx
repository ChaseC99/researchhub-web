import { css, StyleSheet } from "aphrodite";
import { ID } from "~/config/types/root_types";
import { ReactElement, SyntheticEvent, useState } from "react";
import { useEffectFetchSuggestedHubs } from "../Paper/Upload/api/useEffectGetSuggestedHubs";
import { useRouter } from "next/router";
import FormSelect from "../Form/FormSelect";
import icons from "~/config/themes/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltDown,
  faLongArrowAltUp,
} from "@fortawesome/pro-solid-svg-icons";

export type EditorDashFilters = {
  selectedHub: any;
  timeframe: any;
  orderBy: any;
};

type Props = { currentFilters: EditorDashFilters; onFilterChange: Function };

const INPUT_STYLE = {
  fontWeight: 500,
  minHeight: "unset",
  backgroundColor: "#FFF",
  display: "flex",
  justifyContent: "space-between",
};

export const filterOptions = [
  {
    value: "past_month",
    label: "Past Month",
  },
  {
    value: null,
    label: "All Time",
    disableScope: true,
  },
  {
    value: "today",
    label: "Today",
  },
  {
    value: "past_week",
    label: "Past Week",
  },
  {
    value: "past_year",
    label: "Past Year",
    disableScope: true,
  },
];

const ascStyle = {
  display: "flex",
  justifyContent: "space-between",
};

const marginStyle = {
  marginLeft: 8,
};
export const upDownOptions = [
  {
    value: "desc",
    label: (
      <div style={ascStyle}>
        Descending{" "}
        <span style={marginStyle}>
          {<FontAwesomeIcon icon={faLongArrowAltDown} />}{" "}
        </span>
      </div>
    ),
  },
  {
    value: "asc",
    label: (
      <div style={ascStyle}>
        Ascending{" "}
        <span style={marginStyle}>
          {<FontAwesomeIcon icon={faLongArrowAltUp} />}
        </span>
      </div>
    ),
    disableScope: true,
  },
];

export default function EditorDashboardNavbar({
  currentFilters,
  onFilterChange,
}: Props): ReactElement<"div"> {
  const router = useRouter();
  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);

  useEffectFetchSuggestedHubs({ setSuggestedHubs });

  const { orderBy: currentOrderBy } = currentFilters;
  const isCurrentlyDesc = currentOrderBy === "desc";

  return (
    <div className={css(styles.editorDashboardNavbar)}>
      <div className={css(styles.header)}>{"Editor Dashboard"}</div>
      <div className={css(styles.navButtons)}>
        <FormSelect
          containerStyle={styles.hubDropdown}
          inputStyle={INPUT_STYLE}
          id="hubs"
          label=""
          onChange={(_id: ID, selectedHub: any): void =>
            onFilterChange({ ...currentFilters, selectedHub })
          }
          options={suggestedHubs}
          placeholder="Search Hubs"
          value={currentFilters?.selectedHub ?? null}
        />
        <FormSelect
          containerStyle={styles.dropdown}
          inputStyle={INPUT_STYLE}
          onChange={(_id: ID, timeframe: any): void =>
            onFilterChange({ ...currentFilters, timeframe })
          }
          options={filterOptions}
          value={currentFilters?.timeframe ?? null}
        />

        <FormSelect
          containerStyle={styles.dropdown}
          inputStyle={INPUT_STYLE}
          onChange={(_id: ID, orderBy: any): void =>
            onFilterChange({ ...currentFilters, orderBy })
          }
          options={upDownOptions}
          value={currentFilters?.orderBy ?? null}
        />
        {/* <div
          className={css(styles.orderByIcon)}
          onClick={(event: SyntheticEvent): void => {
            event.preventDefault();
            onFilterChange({
              ...currentFilters,
              orderBy: isCurrentlyDesc ? "asc" : "desc",
            });
          }}
          role="bottom"
        >
          {isCurrentlyDesc ? icons.chevronDown : icons.chevronUp}
        </div> */}
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  editorDashboardNavbar: {
    backgroundColor: "#FFF",
    // flexDirection: "column",
    justifyContent: 'space-between',
    display: "flex",
    width: "100%",
    marginBottom: 32,

    "@media only screen and (max-width: 767px)": {
      flexDirection: 'column',
    }
  },
  dropdown: {
    width: 170,
    minHeight: "unset",
    fontSize: 14,
    marginRight: 10,
    "@media only screen and (max-width: 1343px)": {
      height: "unset",
    },
    "@media only screen and (max-width: 1149px)": {
      width: 150,
      fontSize: 13,
    },
    "@media only screen and (max-width: 779px)": {
      width: "100%",
      marginTop: 8,
    },
  },
  hubDropdown: {
    width: 200,
    minHeight: "unset",
    fontSize: 14,
    marginRight: 10,
    "@media only screen and (max-width: 1343px)": {
      height: "unset",
    },
    "@media only screen and (max-width: 1149px)": {
      width: 150,
      fontSize: 13,
    },
    "@media only screen and (max-width: 779px)": {
      width: "100%",
      marginTop: 8,
    },
  },
  header: {
    alignItems: "center",
    display: "flex",
    fontFamily: "Roboto",
    fontSize: "30px",
    fontWeight: 500,
  },
  navButtons: {
    alignItems: "center",
    display: "flex",
    height: 60,
    justifyContent: "flex-start",
  },
  orderByIcon: {
    fontSize: 16,
    cursor: "pointer",
  },
});
