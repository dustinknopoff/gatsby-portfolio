import React from "react";
import { Link } from "gatsby";
import Helmet from "react-helmet";
import Layout from "../components/layout";
import { graphql } from "gatsby";
import { Card } from "../components/commonCSS";
import styled from "styled-components";

export default ({ data }) => {
  return (
    <Layout>
      <div style={{ paddingBottom: "20vh", paddingTop: "20vh" }}>
        <Helmet
          title={
            data.allMarkdownRemark.edges[0].node.frontmatter.tag
              .charAt(0)
              .toUpperCase() +
            data.allMarkdownRemark.edges[0].node.frontmatter.tag.slice(1)
          }
        />
        <PageTitle>
          {data.allMarkdownRemark.edges[0].node.frontmatter.tag
            .charAt(0)
            .toUpperCase() +
            data.allMarkdownRemark.edges[0].node.frontmatter.tag.slice(1)}
        </PageTitle>
        <Container>
          {data.allMarkdownRemark.edges.map(({ node }) => (
            <Link to={node.fields.slug} style={{ borderBottom: "none" }}>
              <Card page key={node}>
                <CardTitle>{node.frontmatter.title}</CardTitle>
                <CardContent>{node.excerpt}</CardContent>
              </Card>
            </Link>
          ))}
        </Container>
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

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 10vh;

  @media only screen and (max-width: 425px) {
    flex-direction: column;
    margin-left: 0;
  }
`;

const CardTitle = styled.h2`
  padding-left: 30px;
  padding-top: 20px;
  width: 30%;

  @media only screen and (max-width: 870px) {
    width: 100%;
  }
`;

const CardContent = styled.p`
  padding: 10px;
  padding-left: 30px !important;
  padding-right: 30px !important;
  align-self: center;
  max-width: 500px;
`;

const PageTitle = styled.h5`
  font-size: 6vmin;
  text-align: center;
  margin-right: 5vw;
  color: #636363;
  font-family: "Courier New", Courier, monospace;

  @media (prefers-color-scheme: dark) {
    color: #8e8e8e;
  }

  @media only screen and (max-width: 425px) {
    color: #a0a0a0;
    position: relative;
    text-align: left;
    font-size: 12vmin;
    margin-left: 10vw;
  }
`;

const CardLink = styled.a`
  margin-right: 20px;

  @media only screen and (max-width: 425px) {
    margin-right: 0;
    margin-bottom: 20px;
`;
