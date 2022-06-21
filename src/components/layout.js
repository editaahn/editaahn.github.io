import React from 'react';
import { Link } from 'gatsby';
import { ThemeToggler } from 'gatsby-plugin-dark-mode';
import { scale } from '../utils/typography';

import Footer from './footer';
import './global.css';
import { ColorModeIcon } from '../components/icons';
import { GithubIcon } from '../components/icons';
import { EmailIcon } from '../components/icons';

const Layout = ({ title, social, email, children }) => {
  const header = (
    <ThemeToggler>
      {({ toggleTheme, theme }) => {
        const isDarkMode = theme === "dark";
        if (theme == null) {
          return null;
        }

        return (
          <>
            <button
              aria-label="theme-switch"
              className="leading-none p-1"
              onClick={() => toggleTheme(isDarkMode ? "light" : "dark")}
            >
              <ColorModeIcon isDarkMode={isDarkMode} />
            </button>

            <h2
              style={{
                ...scale(0.7),
                marginBottom: 0,
                marginTop: 0,
              }}
            >
              <Link
                style={{
                  boxShadow: `none`,
                  color: `inherit`,
                }}
                to={`/`}
              >
                {title}
              </Link>
            </h2>

            <div style={{
              display: 'flex',
              marginTop: 10
            }}>
              <span>
                by Rita Ahn
              </span>
              <>
                <Link to={social?.github} target="_blank" style={{ boxShadow: 'none', margin: '0 10px 0 10px' }}>
                  <GithubIcon fill={isDarkMode ? '#fff' : '#000'} />
                </Link>
                <a href={'mailto:' + email} target="_blank" style={{ boxShadow: 'none' }}>
                  <EmailIcon fill={isDarkMode ? '#fff' : '#000'} />
                </a>
              </>
            </div>
          </>
        );
      }}
    </ThemeToggler>
  );

  return (
    <div
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--textNormal)",
        transition: "color 0.2s ease-out, background 0.2s ease-out",
        minHeight: "100vh",
      }}
    >
      <div className="sidebar">
        <div
          className="md:h-screen p-3 flex flex-col justify-center items-center"
          style={{ minHeight: 200 }}
        >
          {header}
        </div>
      </div>

      <div className="main-content relative">
        <main>{children}</main>
        <Footer />
      </div>
    </div >
  );
};

export default Layout;
