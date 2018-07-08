module.exports = {
  siteMetadata: {
    title: "Dustin Knopoff",
    subtitle: "Computer Science/Design Major at Northeastern University"
  },
  plugins: [
    `gatsby-plugin-glamor`,
    `gatsby-plugin-netlify-cms`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        name: `pages`
      }
    }
  ]
};
