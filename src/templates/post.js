import React from "react";
import styles from "./post.module.css";

export default ({ data }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.contain}>
        <h2 className={styles.title}>
          {data.markdownRemark.frontmatter.title}
        </h2>
        <div
          dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
          className={styles.content}
        />
        <a href={data.markdownRemark.frontmatter.link}>Check it out!</a>
      </div>
    </div>
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
