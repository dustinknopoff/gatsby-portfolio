import React from "react";
import { Link } from "gatsby";
import styles from "./layout.module.css";
import Helmet from "react-helmet";
import "prismjs/themes/prism-tomorrow.css";
import { StaticQuery, graphql } from "gatsby";
import Obfuscate from "react-obfuscate";

export default ({ children }) => (
  <StaticQuery
    query={graphql`
      query AboutQuery {
        site {
          siteMetadata {
            title
            subtitle
            pages
          }
        }
      }
    `}
    render={data => (
      <div>
        <Helmet>
          <link
            rel="shortcut icon"
            type="image/png"
            href="https://res.cloudinary.com/dknopoff/image/upload/f_auto/v1534895152/portfolio/logo.ico"
          />
          <title>Dustin Knopoff</title>
          <meta
            name="keywords"
            content="design, programming, student, exploration"
            description="Dustin Knopoff's portfolio of projects"
          />
        </Helmet>
        <header className={styles.top}>
          <span className={styles.credits}>
            Made with <a href="https://www.gatsbyjs.org/">GatsbyJS</a> {", "}
            Image by{" "}
            <a href="https://unsplash.com/photos/SMJC_JJm7W4">rawpixel</a>
            {", "}
            and icons from{" "}
            <a href="https://fontawesome.com/license">fontawesome</a>
          </span>
          <nav>
            <ul>
              {data.site.siteMetadata.pages.map(elem => {
                return (
                  <Link
                    to={`/${elem}`}
                    activeClassName={styles.active}
                    key={elem}
                  >
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
            <Obfuscate email="dustinknopoff@gmail.com">
              <img
                alt="envelope icon"
                src="https://res.cloudinary.com/dknopoff/image/upload/c_scale,f_auto,h_30/v1534990677/portfolio/envelope-solid.svg"
              />
            </Obfuscate>
            <a href="https://github.com/dustinknopoff">
              <img
                alt="github icon"
                src="https://res.cloudinary.com/dknopoff/image/upload/c_scale,f_auto,h_30/v1534991267/portfolio/github-brands.svg"
              />
            </a>
            <a href="https://www.linkedin.com/in/dustinknopoff">
              <img
                alt="linkedin icon"
                src="https://res.cloudinary.com/dknopoff/image/upload/c_scale,f_auto,h_30/v1534991397/portfolio/linkedin-brands.svg"
              />
            </a>
          </div>
        </header>
        {children}
        <Link to="/">
          <footer>
            <img
              alt="logo"
              src="https://res.cloudinary.com/dknopoff/image/upload/f_auto/v1520699504/portfolio/DKLogo.png"
              alt="Logo"
            />
            <h1>{data.site.siteMetadata.title}</h1>
            <h4>{data.site.siteMetadata.subtitle}</h4>
          </footer>
        </Link>
      </div>
    )}
  />
);
