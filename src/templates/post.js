import React from "react";
import Helmet from "react-helmet";
import Layout from "../components/layout";
import { graphql } from "gatsby";
import styled from "styled-components";

export default ({ data }) => {
  return (
    <Layout>
      <Wrapper>
        <Helmet title={data.markdownRemark.frontmatter.title} />
        <Container>
          <PostTitle>{data.markdownRemark.frontmatter.title}</PostTitle>
          <Article
            dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
          />
          <GitHubLink href={data.markdownRemark.frontmatter.link}>
            To see the full source code, click here.
          </GitHubLink>
        </Container>
      </Wrapper>
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

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10vh;

  @media only screen and (max-width: 425px) {
    margin-top: 30vh;
    margin-left: -5vw;
  }
`;

const Container = styled.div`
  background: rgba(255, 255, 255, 1);
  width: 60vw;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 15vh;
  margin-top: 10vh;

  > * {
    padding-left: 2vw;
    padding-right: 2vw;
  }

  @media only screen and (max-width: 1064px) {
    width: 80vw;
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(54, 56, 58, 1);
    color: #efefef;
  }
`;

const PostTitle = styled.h2`
  font-size: 48px;
  text-align: center;
`;

const GitHubLink = styled.a`
  margin-bottom: 20px;
  padding: 0;
`;

const Article = styled.article`
  font-size: 18px;
  padding: 15px;
  align-self: center;
  overflow-wrap: break-word;
  hyphens: auto;
  word-wrap: break-word;
  line-height: 1.5;
  text-align: left;
  width: 90%;

  > p > a {
    color: #0d328f;
  }

  > p > img {
    width: 40vw;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  @media only screen and (max-width: 1064px) {
    width: 70vw;
    overflow-wrap: break-word;
    hyphens: auto;
    word-wrap: break-word;
  }

  @media (prefers-color-scheme: dark) {
    > p > a {
      color: #4286f4;
    }
  }
`;
