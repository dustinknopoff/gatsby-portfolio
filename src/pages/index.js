import React from "react";
import Layout from "../components/layout";
import { Link, graphql } from "gatsby";
import styled from "styled-components";
import { Card } from "../components/commonCSS";

export default ({ data }) => (
  <Layout>
    <Container>
      <Img
        src="https://res.cloudinary.com/dknopoff/image/upload/f_auto/v1523893789/portfolio/profile.jpg"
        alt="profile-img"
      />
      <Card about>
        Hi! My name is Dustin. I'm a Computer Science and Design major at
        Northeastern University. I love to fiddle with projects and ideas. Come
        check them out!
      </Card>
      <Card
        recent
        as={Link}
        to={data.allMarkdownRemark.edges[0].node.fields.slug}
      >
        <Headings as="h4">Most Recent Post</Headings>
        <Headings as="h6">
          {data.allMarkdownRemark.edges[0].node.frontmatter.title}
        </Headings>
      </Card>
    </Container>
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

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  flex-direction: column;

  @media only screen and (max-width: 650px) {
    margin-top: 15vh;
  }
`;

const Img = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

const Headings = styled.div`
  padding: 0;
  margin: 0;
  padding-bottom: 10px;

  @media (prefers-color-scheme: dark) {
    color: #efefef;
  }
`;
