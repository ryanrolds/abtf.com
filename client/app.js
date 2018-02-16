import React from "react";
import ReactDOM from "react-dom";

class Fact extends React.Component {
  render() {
    return <div id="fact">
      <div className="text">{this.props.fact.text}</div>
    </div>;
  }
}

class Application extends React.Component {
  constructor(props) {
    super(props);
 
    let fact = this.props.initialFact; 
    this.state = {fact};
  }

  getNewFact() {
    fetch("/api/v1/fact/random").then((res) => {
      return res.json().then((body) => {
        if (!body || body.status !== "ok") {
          let err = new Error(body.status || "Unknown error: " + res.statusCode);
          this.showError(err);
        }

        this.setState({fact: body.result});
      });
    }).catch((err) => {
      this.showError(err);      
    });
  }

  showError(err) {
    // TODO 
  }

  render() {
    return <div id="application">
      <Fact fact={this.state.fact}/>
      <div onClick={this.getNewFact.bind(this)}>Next</div>
    </div>; 
  }
}

// Render application and use the preloaded fact.
ReactDOM.render(<Application initialFact={fact}/>,
  document.getElementById("root"));
