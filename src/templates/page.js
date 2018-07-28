import React from "react";
import styles from "./page.module.css";
import Link from "gatsby-link";

export default ({ data }) => {
  return (
    <div>
      <h5 className={styles.title}>
        {data.allMarkdownRemark.edges[0].node.frontmatter.tag
          .charAt(0)
          .toUpperCase() +
          data.allMarkdownRemark.edges[0].node.frontmatter.tag.slice(1)}
      </h5>
      <div className={styles.contain}>
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <Link to={node.fields.slug}>
            <div className={styles.card} key={node}>
              <h2>{node.frontmatter.title}</h2>
              <p>{node.excerpt}</p>
              <a href={node.frontmatter.link} className={styles.link}>
                Link
              </a>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const query = graphql`
  query PageQuery($tag: String!) {
    allMarkdownRemark(filter: { frontmatter: { tag: { eq: $tag } } }) {
      edges {
        node {
          frontmatter {
            tag
            title
            link
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
