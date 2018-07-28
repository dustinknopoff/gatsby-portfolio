import React from "react";
import Card from "../components/card";

import React, { Component } from "react";

export default ({data}) => {
    return (
    <div>
        { data.allMarkdownRemark.map(({node}) => {
            <Card 
                title={node.frontmatter.title} 
                content={node.excerpt} 
                link={node.frontmatter.link}
            />
        })
        };
    </div>
    );
};

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { tag: { eq: "python" } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          fields {
            slug
          }
          frontmatter {
            title
            tag
            link
          }
        }
      }
    }
  }
`;

export default Python;
