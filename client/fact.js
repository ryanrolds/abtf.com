import React from "react";
import ReactDOM from "react-dom";
import './fact.scss';

class Fact extends React.Component {
  render() {
    console.log(this.props.fact);
    return <div id="fact">
      <div className="header">
        <div className="rank">Rank: ?</div>
        <div className="views">Views: {this.props.fact.views}</div>
      </div>
      <div className="text">
        <h1>{this.props.fact.text}</h1>
      </div>
      <div className="footer">
        <div className="like">Like</div>
        <div className="share">Share</div>
      </div>
    </div>;
  }
}

export default Fact;
