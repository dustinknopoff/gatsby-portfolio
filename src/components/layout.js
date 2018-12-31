import React from "react";
import { Link } from "gatsby";
import styles from "./layout.module.css";
import Helmet from "react-helmet";
import "prismjs/themes/prism-tomorrow.css";
import { StaticQuery, graphql } from "gatsby";
import Obfuscate from "react-obfuscate";
import { Mail, GitHub, Linkedin, Rss } from "react-feather";
import styled from "styled-components";

export default ({ children }) => (
  <StaticQuery
    query={graphql`
      query AboutQuery {
        site {
          siteMetadata {
            title
            subtitle
          }
        }
        allDirectory {
          edges {
            node {
              base
            }
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
          <link href="https://micro.blog/dustinknopoff" rel="me" />
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
        <Header>
          <Credits>
            Made with{" "}
            <a href="https://www.gatsbyjs.org/" name="gatsby-link">
              GatsbyJS
            </a>{" "}
            {", "}
            Image by{" "}
            <a
              href="https://unsplash.com/photos/SMJC_JJm7W4"
              name="bg-image-link"
            >
              rawpixel
            </a>
            {", "}
            and icons from{" "}
            <a href="https://feathericons.com" name="icon-src-link">
              feather
            </a>
          </Credits>
          <nav>
            <NavList>
              {data.allDirectory.edges.map(({ node }) => {
                if (node.base != `content`) {
                  return (
                    <StyledLink
                      as={Link}
                      to={`/${node.base}`}
                      activeClassName={styles.active}
                      key={node.base}
                    >
                      {node.base}
                    </StyledLink>
                  );
                }
              })}
            </NavList>
          </nav>
          <Icons>
            <Link to="/">
              <MobLogo
                src="https://res.cloudinary.com/dknopoff/image/upload/f_auto/v1534895152/portfolio/logo.png"
                alt="Logo"
                className={styles.moblogo}
              />
            </Link>
            <Obfuscate email="dustinknopoff@gmail.com" name="email">
              <Mail />
            </Obfuscate>
            <a href="https://github.com/dustinknopoff" name="github">
              <GitHub />
            </a>
            <a href="https://www.linkedin.com/in/dustinknopoff" name="linkedin">
              <Linkedin />
            </a>
            <Link to="rss.xml" name="rss-feed">
              <Rss />
            </Link>
          </Icons>
        </Header>
        {children}
        <Link to="/">
          <Footer>
            <FooterImage
              alt="logo"
              src="https://res.cloudinary.com/dknopoff/image/upload/f_auto/v1520699504/portfolio/DKLogo.png"
              alt="Logo"
            />
            <h1>{data.site.siteMetadata.title}</h1>
            <h4>{data.site.siteMetadata.subtitle}</h4>
          </Footer>
        </Link>
      </div>
    )}
  />
);

const StyledLink = styled.a`
  color: inherit;
  margin-right: 20px;
  margin-left: 20px;
  padding: 0;
  text-decoration: none;
  color: #3b3b3b;

  &:hover {
    border-bottom: 1px solid #595959;
    color: #595959;
  }

  &:active {
    font-weight: 600;
    font-family: "Courier New", Courier, monospace;
  }

  @media (prefers-color-scheme: dark) {
    color: #efefef;
    &:hover {
      border-bottom: 1px solid #efefef;
      color: #efefef;
    }
  }
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: baseline;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  padding-bottom: 10px;
  background-color: rgba(255, 255, 255, 0.7);

  &:hover {
    background: rgba(255, 255, 255, 0.7);
    border-bottom: none;
  }

  @media only screen and (max-width: 650px) {
    flex-direction: row;
    justify-content: baseline;
    align-items: center;
    width: 100%;
    height: 20vh;
    background-color: rgba(255, 255, 255, 0.7);
    left: 0;
    right: 0;
    margin: 0;
  }

  @media (prefers-color-scheme: dark) {
    background-color: rgba(54, 56, 58, 0.7);
    color: #efefef;

    &:hover {
      background: rgba(54, 56, 58, 0.7);
      border-bottom: none;
    }
  }
`;

const Credits = styled.span`
  font-size: 1.2vmin;
  color: #3b3b3b;
  margin-top: 2vh;
  width: 15vw;

  @media only screen and (max-width: 650px) {
    margin-top: 10px;
    margin-left: 10px;
    width: 20vw;
    font-size: 3vmin;
  }

  @media (prefers-color-scheme: dark) {
    color: #efefef;
  }
`;

const Footer = styled.footer`
  display: flex;
  align-items: baseline;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    360deg,
    #c4c4c4 0%,
    rgba(196, 196, 196, 0.839779) 16.02%,
    rgba(196, 196, 196, 0) 100%
  );
  > * {
    margin-right: 15px;
  }

  @media only screen and (max-width: 650px) {
    visibility: hidden;
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(
      360deg,
      #36383a 0%,
      rgba(94, 95, 96, 0.839779) 16.02%,
      rgba(94, 95, 96, 0) 100%
    );
  }
`;

const FooterImage = styled.img`
  padding-left: 30px;
  margin-right: 30px;
  width: 80px;
  border-radius: 0;
`;

const Icons = styled.div`
  padding-top: 2vh;
  > * {
    margin-right: 10px;
  }

  @media only screen and (max-width: 650px) {
    width: 30vw;
  }
`;

const NavList = styled.ul`
  @media only screen and (max-width: 650px) {
    display: flex;
    flex-direction: column;
    color: #efefef;
    > * {
      padding: 0 !important;
    }
  }
`;

const MobLogo = styled.img`
  visibility: hidden;
  width: 30px;
  @media only screen and (max-width: 650px) {
    visibility: visible;
  }
`;
