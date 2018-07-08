import React from "react";
import styles from "./index.module.css";

export default () => (
  <div className={styles.main}>
    <img
      src="https://res.cloudinary.com/dknopoff/image/upload/r_0/v1523893789/profile.jpg"
      alt="profile-img"
    />
    <p>
      Hi! My name is Dustin. I'm a Computer Science and Design major at
      Northeastern University. I love to fiddle with projects and ideas. Come
      check them out!
    </p>
  </div>
);
