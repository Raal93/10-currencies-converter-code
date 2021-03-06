import "./App.css";
import React, { Component } from "react";
import Select from "./Select.js";

const APIKey = process.env.REACT_APP_API_KEY;

class App extends Component {
  state = {
    avalibleCurrencies: { PLN: "Zloty", EUR: "Euro" },

    firstInputCurrency: "EUR",
    secondInputCurrency: "PLN",
    firstInputValue: "",
    secondInputValue: "",

    currencyRate: "",
    error: "",
  };

  componentDidMount() {
    this.getApiCurrenciesList();
    setTimeout(() => this.initialApiRequest(), 1000);
  }

  getApiCurrenciesList = () => {
    fetch("https://currency-converter5.p.rapidapi.com/currency/list", {
      method: "GET",
      headers: {
        "x-rapidapi-key": APIKey,
        "x-rapidapi-host": "currency-converter5.p.rapidapi.com",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (typeof data.currencies === "undefined") {
          this.setState({
            error:
              "Oops, the program encountered a problem retrieving the currency list. The program will try again in a moment.",
          });
          setTimeout(() => this.getApiCurrenciesList(), 1000);
        } else {
          this.setState({
            avalibleCurrencies: data.currencies,
            error: "",
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  initialApiRequest = () => {
    fetch(
      "https://currency-converter5.p.rapidapi.com/currency/convert?format=json&from=EUR&to=PLN&amount=1",
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
        if (typeof data.rates === "undefined") {
          this.setState({
            error:
              "Oops, the program has encountered a problem getting the initial content. Try again in a moment.",
          });
        } else {
          this.setState({
            currencyRate: data.rates.PLN.rate,
            error: "",
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  getApiCurrencyRate = (firstCurrency, secondCurrency) => {
    const APIurl = this.createApiRequest(firstCurrency, secondCurrency);

    fetch(APIurl, {
      method: "GET",
      headers: {
        "x-rapidapi-key": APIKey,
        "x-rapidapi-host": "currency-converter5.p.rapidapi.com",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (typeof data.rates === "undefined") {
          this.setState({
            error:
              "Oops, the program encountered a problem retrieving the exchange rate. Try again in a moment.",
          });
        } else {
          const newCurrencyRate =
            data.rates[this.state.secondInputCurrency].rate;
          const newValue =
            Math.round(this.state.firstInputValue * newCurrencyRate * 100) /
            100;
          this.setState({
            secondInputValue: newValue,
            currencyRate: newCurrencyRate,
            error: "",
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  handleInputChange = (value, rate, isFirst) => {
    const actualRate = isFirst ? rate : 1 / rate;
    const otherValue = Math.round(value * actualRate * 100) / 100;

    if (isFirst) {
      this.setState({
        firstInputValue: value,
        secondInputValue: otherValue,
      });
    } else {
      this.setState({
        firstInputValue: otherValue,
        secondInputValue: value,
      });
    }
  };

  createApiRequest = (firstCurrency, secondCurrency) => {
    const APIurlpart1 =
      "https://currency-converter5.p.rapidapi.com/currency/convert?format=json&from=";
    const APIurlpart2 = "&to=";
    const APIurlpart3 = "&amount=1";

    return (
      APIurlpart1 + firstCurrency + APIurlpart2 + secondCurrency + APIurlpart3
    );
  };

  handleOptionChange = (name, value, isFirst) => {
    let firstCurrency = isFirst ? value : this.state.firstInputCurrency;
    let secondCurrency = isFirst ? this.state.secondInputCurrency : value;

    this.setState({
      [name]: value,
    });

    this.getApiCurrencyRate(firstCurrency, secondCurrency);
  };

  errorDisplay = () => {
    // console.log(this.state.error);

    if (this.state.error === "") {
      return null;
    } else {
      return <span className="error_msg">{this.state.error}</span>;
    }
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
              onChange={(event) =>
                this.handleInputChange(
                  event.target.value,
                  this.state.currencyRate,
                  true
                )
              }
            />
            <Select
              value={this.state.firstInputCurrency}
              name="firstInputCurrency"
              onChange={(event) =>
                this.handleOptionChange(
                  event.target.name,
                  event.target.value,
                  true
                )
              }
              avalibleCurrencies={this.state.avalibleCurrencies}
            />
          </label>
        </div>
        <div className="input_label_wraper">
          <label>
            <Input
              value={this.state.secondInputValue}
              onChange={(event) =>
                this.handleInputChange(
                  event.target.value,
                  this.state.currencyRate,
                  false
                )
              }
            />
            <Select
              value={this.state.secondInputCurrency}
              name="secondInputCurrency"
              onChange={(event) =>
                this.handleOptionChange(
                  event.target.name,
                  event.target.value,
                  false
                )
              }
              avalibleCurrencies={this.state.avalibleCurrencies}
            />
          </label>
        </div>
        {this.errorDisplay()}
      </div>
    );
  }
}

const Input = (props) => {
  return <input value={props.value} onChange={props.onChange} />;
};

export default App;
