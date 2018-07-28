module.exports = {
  siteMetadata: {
    title: "Dustin Knopoff",
    subtitle: "Computer Science/Design Major at Northeastern University",
    pages: ["python", "bash", "javascript", "design"]
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        name: `projects`
      }
    },
    `gatsby-plugin-glamor`,
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-remark`,
    `gatsby-plugin-typescript`
  ]
};
