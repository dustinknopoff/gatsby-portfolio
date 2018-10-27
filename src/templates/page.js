import React from "react";
import styles from "./page.module.css";
import { Link } from "gatsby";
import Helmet from "react-helmet";
import Layout from "../components/layout";
import { graphql } from "gatsby";

export default ({ data }) => {
  return (
    <Layout>
      <div>
        <Helmet
          title={
            data.allMarkdownRemark.edges[0].node.frontmatter.tag
              .charAt(0)
              .toUpperCase() +
            data.allMarkdownRemark.edges[0].node.frontmatter.tag.slice(1)
          }
        />
        <h5 className={styles.title}>
          {data.allMarkdownRemark.edges[0].node.frontmatter.tag
            .charAt(0)
            .toUpperCase() +
            data.allMarkdownRemark.edges[0].node.frontmatter.tag.slice(1)}
        </h5>
        <div className={styles.contain}>
          {data.allMarkdownRemark.edges.map(({ node }) => (
            <Link to={node.fields.slug} className={styles.link}>
              <div className={styles.card} key={node}>
                <h2>{node.frontmatter.title}</h2>
                <p>{node.excerpt}</p>
                <a href={node.frontmatter.link}>Link</a>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query PageQuery($tag: String!) {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { tag: { eq: $tag } } }
    ) {
      edges {
        node {
          frontmatter {
            tag
            title
            link
            date
          }
          excerpt
          fields {
            slug
          }
        }
      }
    }
  }
`;
