import React from "react";
import styles from "./post.module.css";
import Helmet from "react-helmet";
import Layout from "../components/layout";
import { graphql } from "gatsby";

export default ({ data }) => {
  return (
    <Layout>
      <div className={styles.wrapper}>
        <Helmet title={data.markdownRemark.frontmatter.title} />
        <div className={styles.contain}>
          <h2 className={styles.title}>
            {data.markdownRemark.frontmatter.title}
          </h2>
          <article>
            <div
              dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
              className={styles.content}
            />
          </article>
          <a href={data.markdownRemark.frontmatter.link}>Check it out!</a>
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        link
      }
    }
  }
`;
