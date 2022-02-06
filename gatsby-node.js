const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

const POST_PER_PAGE = 5;

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const blogPost = path.resolve(`./src/templates/blog-post.js`);
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          pageInfo {
            pageCount
          }
          group(field: frontmatter___categories) {
            fieldValue
            edges {
              node {
                fields {
                  slug
                }
                frontmatter {
                  title
                }
              }
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    throw result.errors;
  }

  const { group: postGroups, pageInfo: { pageCount } } = result.data.allMarkdownRemark;

  // Create main list page
  Array.from({ length: pageCount }).forEach((_, i) => {
    createPage({
      path: i === 0 ? '/' : `/${i + 1}`,
      component: path.resolve("./src/templates/blog-list.tsx"),
      context: {
        limit: POST_PER_PAGE,
        skip: i * POST_PER_PAGE,
        totalPageCount: pageCount,
        currentPage: i + 1,
      },
    });
  });

  postGroups.forEach(({ edges: posts, fieldValue: category }) => {
    // Create blog posts pages
    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node;
      const next = index === 0 ? null : posts[index - 1].node;

      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      });
    });

    // Create category list pages
    const totalPageCount = Math.ceil(posts.length / POST_PER_PAGE);

    Array.from({ length: totalPageCount }).forEach((_, i) => {
      createPage({
        path: ['', category, i === 0 ? '' : i + 1].join('/'),
        component: path.resolve("./src/templates/blog-list.tsx"),
        context: {
          limit: POST_PER_PAGE,
          skip: i * POST_PER_PAGE,
          filter: { frontmatter: { categories: { in: [category] } } },
          totalPageCount,
          currentPage: i + 1,
        },
      });
    });

  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
