import React, { Component } from "react";
import { Link } from "gatsby";
import styles from "./layout.module.css";
import Helmet from "react-helmet";
import "prismjs/themes/prism-tomorrow.css";
import { StaticQuery, graphql } from "gatsby";
import Obfuscate from "react-obfuscate";
import { Mail, GitHub, Linkedin, Rss } from "react-feather";

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
        allMarkdownRemark {
          edges {
            node {
              frontmatter {
                tag
              }
            }
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
            and icons from <a href="https://feathericons.com">feather</a>
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
              <Mail />
            </Obfuscate>
            <a href="https://github.com/dustinknopoff">
              <GitHub />
            </a>
            <a href="https://www.linkedin.com/in/dustinknopoff">
              <Linkedin />
            </a>
            <Link to="rss.xml">
              <Rss />
            </Link>
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
