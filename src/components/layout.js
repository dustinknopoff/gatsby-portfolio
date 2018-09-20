import React from "react";
import { Link } from "gatsby";
import styles from "./layout.module.css";
import Helmet from "react-helmet";
import "prismjs/themes/prism-tomorrow.css";
import { graphql } from "gatsby";

export default ({ data, children }) => (
  <div>
    <Helmet>
      <link
        rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.0.10/css/all.css"
        integrity="sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg"
        crossorigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Lato|Montserrat"
        rel="stylesheet"
      />
      <link
        rel="shortcut icon"
        type="image/png"
        href="https://res.cloudinary.com/dknopoff/image/upload/f_auto/v1534895152/portfolio/logo.ico"
      />
      <title>Dustin Knopoff</title>
      <meta
        name="keywords"
        content="design, programming, student, exploration"
      />
    </Helmet>
    <header className={styles.top}>
      <span className={styles.credits}>
        Made with <a href="https://www.gatsbyjs.org/">GatsbyJS</a>
        <br />
        Image by <a href="https://unsplash.com/photos/SMJC_JJm7W4">rawpixel</a>
        <br />
        and icons from <a href="https://fontawesome.com/license">fontawesome</a>
      </span>
      <nav>
        <ul>
          {data.site.siteMetadata.pages.map(elem => {
            return (
              <Link to={`/${elem}`} activeClassName={styles.active} key={elem}>
                {elem}
              </Link>
            );
          })}
        </ul>
      </nav>
      <div className={styles.icons}>
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dknopoff/image/upload/f_auto/v1534895152/portfolio/logo.png"
            alt="Logo"
            className={styles.moblogo}
          />
        </Link>
        <a href="mailto:dustinknopoff@gmail.com">
          <img src="https://res.cloudinary.com/dknopoff/image/upload/c_scale,f_auto,h_30/v1534990677/portfolio/envelope-solid.svg" />
        </a>
        <a href="https://github.com/dustinknopoff">
          <img src="https://res.cloudinary.com/dknopoff/image/upload/c_scale,f_auto,h_30/v1534991267/portfolio/github-brands.svg" />
        </a>
        <a href="https://www.linkedin.com/in/dustinknopoff">
          <img src="https://res.cloudinary.com/dknopoff/image/upload/c_scale,f_auto,h_30/v1534991397/portfolio/linkedin-brands.svg" />
        </a>
      </div>
    </header>
    {children}
    <Link to="/">
      <footer>
        <img
          src="https://res.cloudinary.com/dknopoff/image/upload/f_auto/v1520699504/portfolio/DKLogo.png"
          alt="Logo"
        />
        <h1>{data.site.siteMetadata.title}</h1>
        <h4>{data.site.siteMetadata.subtitle}</h4>
      </footer>
    </Link>
  </div>
);

export const query = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        title
        subtitle
        pages
      }
    }
  }
`;
