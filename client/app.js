import React from "react";
import ReactDOM from "react-dom";
import Fact from './fact.js';
import './app.scss';

class Application extends React.Component {
  constructor(props) {
    super(props);
 
    let fact = this.props.initialFact; 
    this.state = {
      fact: fact,
      history: [],
      index: -1
    };
  }

  prevFact() {
    this.setState((prevState, props) => {
      prevState.index--;
      return {
        fact: prevState.history[prevState.index],
        index: prevState.index
      }
    }); 
  }

  nextFact() {
    this.getNewFact().then((fact) => {
      this.setState((prevState, props) => {
        prevState.history.push(fact.id);
        prevState.index++
        return {
          fact: fact,
          history: prevState.history, 
          index: prevState.index
        };
      });
    }).catch((err) => {
      this.showError(err);
    });
  }

  getFact(id) {
    return fetch("/api/v1/fact/" + id).then(this.processBody);
  }

  getNewFact() {
    return fetch("/api/v1/fact/random").then(this.processBody)
  }

  processBody(res) {
    return res.json().then((body) => {
      if (!body || body.status !== "ok") {
        let err = new Error(body.status || "Unknown error: " + res.statusCode);
        this.showError(err);
      }

      let fact = body.result;
      return fact;
    });
  }

  showError(err) {
    // TODO 
  }

  render() {
    return <div id="app">
      <div id="header">
        <h2>Amazing, But True, Facts</h2>
      </div>
      <Fact fact={this.state.fact}/>
      <div id="footer"> 
        <div id="next" onClick={this.nextFact.bind(this)}>Next</div>
        <div id="prev" className={this.state.history.length < 2 ? 'inactive' : ''} onClick={this.prevFact.bind(this)}>Prev</div>
      </div>
    </div>; 
  }
}

// Render application and use the preloaded fact.
ReactDOM.render(<Application initialFact={fact}/>,
  document.getElementById("root"));
