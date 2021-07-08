import { useState, useEffect, useRef, Fragment } from "react";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { get } from "lodash";
import { breakpoints } from "~/config/themes/screen";
import { pickFiltersForApp } from "~/config/utils";

const Search = ({ navbarRef }) => {
  const SMALL_PLACEHOLDER_WIDTH = 200;
  const RETURN_KEY = 13;
  const SMALLEST_ALLOWED_INPUT = 180;
  const DEFAULT_EXPANDED_SEARCH_HEIGHT = 66;
  const QUERY_PARAM = "q";

  const router = useRouter();
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const [query, setQuery] = useState(get(router, `query.${QUERY_PARAM}`) || "");
  const [isSmallScreenSearch, setIsSmallScreenSearch] = useState(false);
  const [isExpandedSearchOpen, setIsExpandedSearchOpen] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("Search");
  const [currentPath, setCurrentPath] = useState(router.pathname);

  useEffect(() => {
    router.events.on("routeChangeComplete", (url) => {
      setCurrentPath(window.location.pathname);
    });

    window.addEventListener("resize", setSmallScreenLayoutIfNeeded, true);

    return () => {
      window.removeEventListener("resize", setSmallScreenLayoutIfNeeded, true);
    };
  }, []);

  useEffect(() => {
    prepareSearchLayout();

    const isUserOnSearchPage = currentPath.includes("/search");

    if (isUserOnSearchPage) {
      setQuery(router.query[QUERY_PARAM]);
    } else {
      setQuery("");
    }
  }, [currentPath]);

  const prepareSearchLayout = () => {
    setSmallScreenLayoutIfNeeded();

    const isUserOnSearchPage = currentPath.includes("/search");

    if (shouldShowSmallScreenSearch()) {
      setIsSmallScreenSearch(true);

      if (isUserOnSearchPage) {
        setIsExpandedSearchOpen(true);
        focusInput();
      } else {
        setIsExpandedSearchOpen(false);
      }
    }
  };

  const focusInput = () => {
    const el = get(searchInputRef, "current");

    if (el) {
      const val = el.value;

      // Focus at end of input
      el.value = "";
      el.value = val;
      el.focus();
    }
  };

  const shouldShowSmallScreenSearch = () => {
    const inputWidth = searchInputRef.current.offsetWidth;

    if (window.innerWidth <= breakpoints.small.int) {
      return true;
    } else if (inputWidth <= SMALLEST_ALLOWED_INPUT) {
      return true;
    } else {
      return false;
    }
  };

  // IN non-mobile resolutions (over 760px) we allow
  // the input field to render naturally. If it is smaller than
  // SMALLEST_ALLOWED_INPUT, we also consider it to be "small screen"
  const setSmallScreenLayoutIfNeeded = () => {
    const inputWidth = searchInputRef.current.offsetWidth;

    if (shouldShowSmallScreenSearch()) {
      setIsSmallScreenSearch(true);
    } else {
      setIsSmallScreenSearch(false);
    }
  };

  const toggleExpandedSearch = (isOpen) => {
    if (isExpandedSearchOpen) {
      setIsExpandedSearchOpen(false);
    } else {
      setIsExpandedSearchOpen(true);
      focusInput();
    }
  };

  const handleSearchBtnClick = () => {
    if (isSmallScreenSearch) {
      if (isExpandedSearchOpen) {
        doSearch();
      } else {
        toggleExpandedSearch();
      }
    } else {
      doSearch();
    }
  };

  const doSearch = () => {
    const isUserOnSearchPage = currentPath.includes("/search");
    const currentSearchType = isUserOnSearchPage ? router.query.type : "paper";

    const filterParams = pickFiltersForApp({
      searchType: currentSearchType,
      query: router.query,
    });

    const queryParams = {
      ...filterParams,
      [QUERY_PARAM]: query,
      type: currentSearchType,
    };

    router.push({
      pathname: "/search/[type]",
      query: queryParams,
    });
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === RETURN_KEY) {
      doSearch();
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const searchContainerProps = {
    ref: searchContainerRef,
    className: css(
      styles.search,
      isSmallScreenSearch && styles.searchSmallScreen,
      isExpandedSearchOpen && styles.searchExpanded
    ),
  };

  // Since expanded search is absolute, we want to dynamically
  // set the height to be based on Navbar element.
  if (isExpandedSearchOpen) {
    const navHeight = get(navbarRef, "current.offsetHeight");
    searchContainerProps.style = {
      height: navHeight || DEFAULT_EXPANDED_SEARCH_HEIGHT,
    };
  }

  return (
    <div {...searchContainerProps}>
      {isExpandedSearchOpen && (
        <Fragment>
          <span className={css(styles.backIcon)} onClick={toggleExpandedSearch}>
            {icons.longArrowLeft}
          </span>
        </Fragment>
      )}

      <input
        className={css(
          styles.searchInput,
          isSmallScreenSearch && styles.searchInputSmallScreen,
          isExpandedSearchOpen && styles.searchInputExpanded
        )}
        placeholder={placeholderText}
        onKeyDown={handleKeyPress}
        onChange={handleInputChange}
        value={query}
        ref={searchInputRef}
      />

      <span
        className={css(
          styles.searchIcon,
          isSmallScreenSearch && styles.searchIconSmallScreen,
          isExpandedSearchOpen && styles.searchIconExpanded
        )}
        onClick={handleSearchBtnClick}
      >
        {icons.search}
      </span>
    </div>
  );
};

const styles = StyleSheet.create({
  search: {
    width: "100%",
    maxWidth: 600,
    borderRadius: 2,
    boxSizing: "border-box",
    background: "white",
    border: `1px solid rgba(151, 151, 151, 0.2)`,
    display: "flex",
    alignItems: "center",
    position: "relative",
    ":hover": {
      borderColor: colors.BLUE(),
    },
  },
  searchSmallScreen: {
    width: "auto",
    border: 0,
    flex: 1,
    alignItems: "flex-end",
    flexDirection: "column",
    ":hover": {
      borderColor: 0,
    },
  },
  searchExpanded: {
    border: "unset",
    position: "absolute",
    width: "100%",
    zIndex: 10,
    maxWidth: "unset",
    paddingLeft: 20,
    left: 0,
    marginTop: 1,
    flexDirection: "row",
    boxShadow: `inset 0px 0px 0px 1px ${colors.BLUE()}`,
  },
  backIcon: {
    color: colors.BLUE(),
    fontSize: 28,
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
    cursor: "pointer",
    flexDirection: "column",
    height: "100%",
  },
  searchIcon: {
    position: "absolute",
    cursor: "pointer",
    opacity: 0.4,
    zIndex: 2,
    top: 5,
    right: 6,
    borderRadius: 6,
    padding: "4px 7px",
    ":hover": {
      background: "rgb(146 145 145 / 50%)",
    },
  },
  searchIconSmallScreen: {
    position: "static",
    fontSize: 16,
    opacity: 1,
    marginRight: 20,
    ":hover": {
      background: 0,
    },
    [`@media only screen and (min-width: ${breakpoints.small.int + 1}px)`]: {
      fontSize: 20,
      marginRight: 10,
      opacity: 0.4,
    },
  },
  searchIconExpanded: {
    fontSize: 24,
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
    paddingBottom: 0,
    flexDirection: "column",
    height: "100%",
    position: "static",
    background: 0,
    [`@media only screen and (min-width: ${breakpoints.small.int + 1}px)`]: {
      fontSize: 24,
      marginRight: 20,
      opacity: 1,
    },
  },
  searchInput: {
    padding: 10,
    boxSizing: "border-box",
    height: "100%",
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: 16,
    position: "relative",
    cursor: "pointer",
    ":hover": {
      boxShadow: `0px 0px 1px 1px ${colors.BLUE()}`,
    },
    ":focus": {
      boxShadow: `0px 0px 1px 1px ${colors.BLUE()}`,
      ":hover": {
        boxShadow: `0px 0px 1px 1px ${colors.BLUE()}`,
        cursor: "text",
      },
    },
    "::placeholder": {
      opacity: 0.6,
    },
  },
  searchInputSmallScreen: {
    padding: 0,
    height: 0,
    visibility: "hidden",
    ":focus": {
      boxShadow: "none",
      ":hover": {
        boxShadow: "none",
      },
    },
  },
  searchInputExpanded: {
    padding: 10,
    height: "100%",
    fontSize: 18,
    paddingLeft: 20,
    visibility: "visible",
    ":focus": {
      boxShadow: "none",
      ":hover": {
        boxShadow: "none",
      },
    },
    ":hover": {
      boxShadow: "none",
    },
  },
});

Search.propTypes = {
  navbarRef: PropTypes.object,
};

export default Search;
