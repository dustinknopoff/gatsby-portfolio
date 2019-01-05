import React, { Fragment } from "react";
import Helmet from "react-helmet";
import Layout from "../components/layout";
import { graphql, Link } from "gatsby";
import styled from "styled-components";
import { Card } from "../components/commonCSS";

export default ({ data }) => {
  console.log(data.allMarkdownRemark);
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
            See the full source code
          </GitHubLink>
        </Container>
        {data.allMarkdownRemark.edges.filter(({ node }) => {
          node.frontmatter.title !== data.markdownRemark.frontmatter.title &&
            node.frontmatter.tag === data.markdownRemark.frontmatter.tag;
        }).length > 0 && (
          <Fragment>
            <h3>Recent Posts</h3>
            <CardWrap>
              {data.allMarkdownRemark.edges.map(({ node }) => {
                if (
                  node.frontmatter.title !==
                    data.markdownRemark.frontmatter.title &&
                  node.frontmatter.tag === data.markdownRemark.frontmatter.tag
                ) {
                  return (
                    <Card about as={Link} to={node.fields.slug} prefetch>
                      <h1>{node.frontmatter.title}</h1>
                      {node.excerpt}
                    </Card>
                  );
                }
              })}
            </CardWrap>
          </Fragment>
        )}
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
        tag
      }
    }
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 6
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

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 20vh;

  @media only screen and (max-width: 425px) {
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
  margin-top: 5vh;

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
  font-size: 5vmin;
  text-align: center;

  @media only screen and (max-width: 425px) {
    font-size: 8vmin;
  }
`;

const GitHubLink = styled.a`
  margin-bottom: 20px;
  padding: 0;
`;

const Article = styled.article`
  font-size: 2vmin;
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

  @media only screen and (max-width: 425px) {
    font-size: 4vmin;
  }
`;

export const CardWrap = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  width: 80vw;

  > * {
    margin-right: 20px;
    min-width: 30vw;
  }
`;
