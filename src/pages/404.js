import React from "react";
import styles from "./404.module.css";
import Link from "gatsby-link";
import Helmet from "react-helmet";

export default ({ data }) => {
  return (
    <div className={styles.main}>
      <Helmet title="Not Found" />
      <h1 className={styles.title}>Lost?</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Tag</th>
          </tr>
        </thead>
        <tbody>
          {data.allFile.edges.map(({ node }, index) => (
            <tr key={index}>
              <Link to={node.relativePath.replace(".md", "")}>
                <td>
                  <strong>{node.name}</strong>
                </td>
              </Link>
              <td>
                <Link to={node.childMarkdownRemark.frontmatter.tag}>
                  {node.childMarkdownRemark.frontmatter.tag}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const query = graphql`
  query FourQuery {
    allFile {
      edges {
        node {
          name
          relativePath
          childMarkdownRemark {
            frontmatter {
              tag
            }
          }
        }
      }
    }
  }
`;
