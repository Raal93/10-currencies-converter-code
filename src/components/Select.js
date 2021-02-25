import React, { Component } from "react";

const APIKey = process.env.REACT_APP_API_KEY;

class Select extends Component {
  state = {
    avalibleCurrencies: "",
  };

  componentDidMount() {
    fetch("https://currency-converter5.p.rapidapi.com/currency/list", {
      method: "GET",
      headers: {
        "x-rapidapi-key": APIKey,
        "x-rapidapi-host": "currency-converter5.p.rapidapi.com",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          avalibleCurrencies: data.currencies,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  generateCurrenciesList = () => {
    let obj = this.state.avalibleCurrencies;

    return Object.keys(obj).map((key, index) => {
      return (
        <option value={key} key={index}>
          {obj[key]}
        </option>
      );
    });
  };

  render() {
    return (
      <select
        value={this.props.value}
        onChange={this.props.onChange}
        id={this.props.id}
      >
        {this.generateCurrenciesList()}
      </select>
    );
  }
}

export default Select;
