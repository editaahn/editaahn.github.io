// Gatsby supports TypeScript natively!
import React from "react";
import { PageProps, Link, graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { rhythm } from "../utils/typography";

type PageContext = {
  currentPage: number;
  totalPageCount: number;
  filter?: Record<string, unknown>;
};
type Data = {
  site: {
    siteMetadata: {
      title: string;
      social: Record<string, string>;
      email: string;
    };
  };
  allMarkdownRemark: {
    edges: {
      node: {
        excerpt: string;
        frontmatter: {
          title: string;
          date: string;
          description: string;
        };
        fields: {
          slug: string;
        };
      };
    }[];
  };
};

const BlogIndex = ({
  data,
  location,
  pageContext,
}: PageProps<Data, PageContext>) => {
  const { title: siteTitle, social, email } = data.site.siteMetadata;
  const posts = data.allMarkdownRemark.edges;
  const { currentPage, totalPageCount } = pageContext;

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPageCount;
  const prevPage = currentPage - 1 === 1 ? "/" : `/${currentPage - 1}`;
  const nextPage = `/${currentPage + 1}`;

  return (
    <Layout location={location} title={siteTitle} social={social} email={email}>
      <SEO title="All posts" />
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug;
        return (
          <article key={node.fields.slug}>
            <header>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <small>{node.frontmatter.date}</small>
            </header>
            <section>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
            </section>
          </article>
        );
      })}

      <nav>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {!isFirst && (
              <Link to={prevPage} rel="prev">
                ← Previous Page
              </Link>
            )}
          </li>
          <li>
            {!isLast && (
              <Link to={nextPage} rel="next">
                Next Page →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query blogPageQuery($skip: Int!, $limit: Int!, $filter: MarkdownRemarkFilterInput) {
    site {
      siteMetadata {
        title
        social {
          github
        }
        email
      }
    }
    allMarkdownRemark(
      filter: $filter
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`;
