module.exports = {
  siteMetadata: {
    title: "Dustin Knopoff",
    subtitle: "Computer Science/Design Major at Northeastern University"
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
    `gatsby-plugin-netlify-cms`,
    `gatsby-plugin-react-helmet`
  ]
};
