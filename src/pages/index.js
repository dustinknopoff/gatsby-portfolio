import React from "react";
import styles from "./index.module.css";
import Layout from "../components/layout";
import { Link, graphql } from "gatsby";

export default ({ data }) => (
  <Layout>
    <div className={styles.main}>
      <img
        src="https://res.cloudinary.com/dknopoff/image/upload/f_auto/v1523893789/portfolio/profile.jpg"
        alt="profile-img"
      />
      <p>
        Hi! My name is Dustin. I'm a Computer Science and Design major at
        Northeastern University. I love to fiddle with projects and ideas. Come
        check them out!
      </p>
      <Link
        to={data.allMarkdownRemark.edges[0].node.fields.slug}
        className={styles.recent}
      >
        <h4>Most Recent Post</h4>
        <h6>{data.allMarkdownRemark.edges[0].node.frontmatter.title}</h6>
        <p>{data.allMarkdownRemark.edges[0].node.frontmatter.excerpt}</p>
      </Link>
    </div>
  </Layout>
);

export const query = graphql`
  query RecentQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 1
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
