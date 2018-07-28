import React from "react";
import Link from "gatsby-link";
import styles from "./index-l.module.css";
import Helmet from "react-helmet";

export default ({ data, children }) => (
  <div>
    <Helmet>
      <link
        rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.0.10/css/all.css"
        integrity="sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg"
        crossorigin="anonymous"
      />
      <script src="https://identity.netlify.com/v1/netlify-identity-widget.js" />
      <link
        href="https://fonts.googleapis.com/css?family=Lato|Montserrat"
        rel="stylesheet"
      />
    </Helmet>
    <header className={styles.top}>
      <span className={styles.credits}>
        Made with <a href="https://www.gatsbyjs.org/">GatsbyJS</a>
        &nbsp;and&nbsp;
        <a href="https://www.netlifycms.org/">NetlifyCMS</a>
        <div>
          Image by{" "}
          <a href="https://unsplash.com/photos/SMJC_JJm7W4">rawpixel</a>
        </div>
      </span>
      <nav>
        <ul>
          <Link to="/python">Python</Link>
          <Link to="/bash">Bash</Link>
          <Link to="/js">JavaScript</Link>
          <Link to="/design">Concepts & Mockups</Link>
        </ul>
      </nav>
      <div className={styles.icons}>
        <a href="mailto:dustinknopoff@gmail.com">
          <i className="fa fa-envelope fa-2x" />
        </a>
        <a href="https://github.com/dustinknopoff">
          <i className="fab fa-github fa-2x" />
        </a>
        <a href="https://www.linkedin.com/in/dustinknopoff">
          <i className="fab fa-linkedin fa-2x" />
        </a>
      </div>
    </header>
    {children()}
    <Link to="/">
      <footer>
        <img
          src="https://res.cloudinary.com/dknopoff/image/upload/v1520699504/portfolio/DKLogo.png"
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
      }
    }
  }
`;
