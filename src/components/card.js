import React from "react";
import styles from "./card.modules.css";

// export default () => (
//   <div className={styles.card}>
//     <h2>Title</h2>
//     <p>Content</p>
//     <a href="" className="link">
//       Link
//     </a>
//   </div>
// );

import React, { Component } from "react";

class Card extends Component {
  render() {
    return (
      <div className={styles.card}>
        <h2>{this.props.title}</h2>
        <p>{this.props.content}</p>
        <a href={this.props.link} className="link">
          Link
        </a>
      </div>
    );
  }
}

export default Card;
