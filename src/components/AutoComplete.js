import React, { Component } from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";

function getIndicesOf(searchStr, str, caseSensitive) {
  var searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
    return [];
  }
  var startIndex = 0,
    index,
    indices = [];
  if (!caseSensitive) {
    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}

export class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array),
  };
  static defaultProperty = {
    suggestions: [],
  };
  constructor(props) {
    super(props);
    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: "",
      listRef: [],
      focusIndex: null,
    };
    // let listRef = [];
    // let focusIndex = null;
  }

  onChange = (e) => {
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;

    let filteredSuggestions = suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    let arr = [];
    // filteredSuggestions = getIndicesOf(userInput.toLowerCase(),)
    filteredSuggestions = filteredSuggestions.forEach((element) => {
      // const position1 = element.toLowerCase().indexOf(userInput.toLowerCase());
      // const position2 = element
      //   .toLowerCase()
      //   .lastIndexOf(userInput.toLowerCase());
      // console.log(position2);
      // let a =
      //   element.substr(0, position1) +
      //   "<b>" +
      //   element.substr(position1, userInput.length) +
      //   "</b>" +
      //   element.substr(position2 + 1, element.length);
      // console.log(a);
      // arr.push({
      //   first: element.substr(0, position1),
      //   second: element.substr(position1, userInput.length),
      //   third: element.substr(position2 + 1, element.length),
      // });
      // console.log(getIndicesOf(userInput.toLowerCase(), element));
      arr.push({
        userInput: userInput,
        element: element,
        indices: getIndicesOf(userInput.toLowerCase(), element),
      });
    });
    filteredSuggestions = arr;

    this.setState({
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value,
    });
  };

  onClick = (e) => {
    e.preventDefault();
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText,
    });
  };
  onKeyDown = (e) => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    if (e.key === "Tab" || e.keyCode === 9) {
      // e.preventDefault();
      // console.log("Key detected", e.key, e.keyCode);
      // this.setState({ focusIndex: this.state.focusIndex + 1 });
      // this.state.listRef.forEach((i, index) => {
      //   if (index === this.state.focusIndex) {
      //     i.focus();
      //   }
      // });
    } else {
      this.setState({ focusIndex: null });
    }

    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion],
      });
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    } else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,

      state: {
        filteredSuggestions,
        showSuggestions,
        userInput,
        listRef,
        focusIndex,
      },
    } = this;
    let suggestionsListComponent;
    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              var str = "";
              let a = suggestion.element;
              let k = 0;
              // console.log(suggestion.indices);
              for (var i = 0; i < suggestion.element.length; i++) {
                // console.log(suggestion.indices);
                if (i === suggestion.indices[k]) {
                  // console.log("It came here");
                  str = str + "<strong>";

                  for (let m = 0; m < suggestion.userInput.length; m++) {
                    str = str + a[i];
                    i++;
                  }
                  str = str + "</strong>";
                  i--;
                  k++;
                } else {
                  str = str + a[i];
                }
              }
              // console.log(str);
              // suggestion.indices.map((i, index) => {

              //   str = a.splice(i, 0, "<b>");
              //   str = str.splice(i + suggestion.userInput.length, 0, "<b/>");
              //   console.log(str);
              // });
              return (
                <a
                  href="/"
                  key={index}
                  onClick={onClick}
                  ref={(link) => listRef.push(link)}
                >
                  <div dangerouslySetInnerHTML={{ __html: str }} />
                </a>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>No suggestions</em>
          </div>
        );
      }
    }

    return (
      <React.Fragment>
        <input
          type="search"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
        />
        {suggestionsListComponent}
      </React.Fragment>
    );
  }
}

export default Autocomplete;
