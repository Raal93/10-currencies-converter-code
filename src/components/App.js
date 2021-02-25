import "./App.css";
import React, { Component } from "react";
import Select from "./Select.js";

const APIKey = process.env.REACT_APP_API_KEY;

class App extends Component {
  APIurlpart1 =
    "https://currency-converter5.p.rapidapi.com/currency/convert?format=json&from=";
  APIurlpart2 = "&to=";
  APIurlpart3 = "&amount=1";

  state = {
    firstInputCurrency: "PLN",
    secondInputCurrency: "EUR",
    firstInputValue: "",
    secondInputValue: "",

    currencyRate: "",
  };

  componentDidMount() {
    // console.log(process.env.REACT_APP_API_KEY);
    fetch(
      "https://currency-converter5.p.rapidapi.com/currency/convert?format=json&from=PLN&to=EUR&amount=1",
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": APIKey,
          "x-rapidapi-host": "currency-converter5.p.rapidapi.com",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        this.setState({
          currencyRate: data.rates.EUR.rate,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleFirstInputChange = (event) => {
    const valueSecond =
      Math.round(event.target.value * this.state.currencyRate * 100) / 100;
    this.setState({
      firstInputValue: event.target.value,
      secondInputValue: valueSecond,
    });
  };

  handleSecondInputChange = (event) => {
    const valueFirst =
      Math.round((event.target.value / this.state.currencyRate) * 100) / 100;
    this.setState({
      firstInputValue: valueFirst,
      secondInputValue: event.target.value,
    });
  };

  handleOptionChange = (event) => {
    let firstCurrency;
    let secondCurrency;
    let currencyRateTmp;

    if (event.target.id === "1") {
      // console.log("znalazło id 1");
      firstCurrency = event.target.value;
      secondCurrency = this.state.secondInputCurrency;
      this.setState({
        firstInputCurrency: event.target.value,
      });
    } else if (event.target.id === "2") {
      // console.log("znalazło id 2");
      firstCurrency = this.state.firstInputCurrency;
      secondCurrency = event.target.value;
      this.setState({
        secondInputCurrency: event.target.value,
      });
    }

    //build API request
    const APIurlCurrencyRate =
      this.APIurlpart1 +
      firstCurrency +
      this.APIurlpart2 +
      secondCurrency +
      this.APIurlpart3;

    // console.log(APIurlCurrencyRate);
    fetch(APIurlCurrencyRate, {
      method: "GET",
      headers: {
        "x-rapidapi-key": APIKey,
        "x-rapidapi-host": "currency-converter5.p.rapidapi.com",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        this.setState({
          currencyRate: data.rates[this.state.secondInputCurrency].rate,
        });
        currencyRateTmp = data.rates[this.state.secondInputCurrency].rate;
      })
      .then(() => {
        this.setState({
          secondInputValue:
            Math.round(this.state.firstInputValue * currencyRateTmp * 100) /
            100,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    return (
      <div>
        <div className="input_label_wraper">
          <span className="current_exchange_rate">
            Current exchange rate: {this.state.currencyRate}
          </span>
          <label>
            <Input
              value={this.state.firstInputValue}
              onChange={this.handleFirstInputChange}
            />
            <Select
              value={this.state.firstInputCurrency}
              onChange={this.handleOptionChange}
              id={"1"}
            />
          </label>
        </div>
        <div className="input_label_wraper">
          <label>
            <Input
              value={this.state.secondInputValue}
              onChange={this.handleSecondInputChange}
            />
            <Select
              value={this.state.secondInputCurrency}
              onChange={this.handleOptionChange}
              id={"2"}
            />
          </label>
        </div>
      </div>
    );
  }
}

const Input = (props) => {
  return <input value={props.value} onChange={props.onChange} />;
};

export default App;
