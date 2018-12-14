module.exports = {
  siteMetadata: {
    title: "Dustin Knopoff",
    subtitle: "Computer Science/Design Major at Northeastern University",
    pages: ["python", "shell", "web", "design", "rust"],
    author: "Dustin Knopoff",
    description: "Projects and Information on Dustin Knopoff",
    siteUrl: "https://dustinknopoff.me"
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
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              // Class prefix for <pre> tags containing syntax highlighting;
              // defaults to 'language-' (eg <pre class="language-js">).
              // If your site loads Prism into the browser at runtime,
              // (eg for use with libraries like react-live),
              // you may use this to prevent Prism from re-processing syntax.
              // This is an uncommon use-case though;
              // If you're unsure, it's best to use the default value.
              classPrefix: "language-",
              // This is used to allow setting a language for inline code
              // (i.e. single backticks) by creating a separator.
              // This separator is a string and will do no white-space
              // stripping.
              // A suggested value for English speakers is the non-ascii
              // character '›'.
              inlineCodeMarker: "~",
              // This lets you set up language aliases.  For example,
              // setting this to '{ sh: "bash" }' will let you use
              // the language "sh" which will highlight using the
              // bash highlighter.
              aliases: {
                sh: "bash",
                js: "javascript",
                py: "python",
                rs: "rust"
              },
              showLineNumbers: true
            }
          }
        ]
      }
    },
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Lato`
          },
          {
            family: `Montserrat`
          }
        ]
      }
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-feed`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-catch-links`,
    {
      resolve: `@andrew-codes/gatsby-plugin-elasticlunr-search`,
      options: {
        // Fields to index
        fields: ["title", "tag"],
        // How to resolve each field's value for a supported node type
        resolvers: {
          // For any node of type MarkdownRemark, list how to resolve the fields' values
          MarkdownRemark: {
            title: node => node.frontmatter.title,
            keywords: node => node.frontmatter.tag
          }
        }
      }
    }
  ]
};
