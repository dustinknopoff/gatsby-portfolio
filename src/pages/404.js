import React from "react";
import { Link } from "gatsby";
import Helmet from "react-helmet";
import Layout from "../components/layout";
import { graphql } from "gatsby";
import styled from "styled-components";

export default ({ data }) => {
  return (
    <Layout>
      <Container>
        <Helmet title="Not Found" />
        <h1>Lost?</h1>
        <Table>
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
                    <Strong>{node.name}</Strong>
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
        </Table>
      </Container>
    </Layout>
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

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  flex-direction: column;

  @media screen and (max-height: 736px) {
    margin-top: 20vh;
  }

  @media screen and (max-height: 568px) {
    margin-top: 30vh;
  }

  @media screen and (max-height: 834px) {
    margin-top: 10vh;
  }
`;

const Table = styled.table`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  width: 50vw;

  @media (prefers-color-scheme: dark) {
    background-color: rgba(54, 56, 58, 0.9);
    color: #efefef;
  }

  @media screen and (max-height: 834px) {
    width: 90vw;
  }
`;

const Strong = styled.strong`
  margin: 10px;
  padding: 10px;
  font-size: 16px;
  text-align: center;
`;
