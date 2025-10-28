import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Team() {
  const { siteConfig } = useDocusaurusContext();

  const teamMembers = [
    {
      name: 'Richard',
      role: '',
      bio: '',
      telegram: 'https://t.me/richard2015',
      twitter: 'https://x.com/richardzliang',
      github: 'https://github.com/richardliang',
      image: '/img/team/richard.jpg'
    },
    {
      name: 'Sachin',
      role: '',
      bio: '',
      telegram: 'https://t.me/Sachin0x',
      twitter: 'https://x.com/0xSachinK',
      github: 'https://github.com/0xSachinK',
      image: '/img/team/sachin.jpg'
    },
    {
      name: 'Ben',
      role: '',
      bio: '',
      twitter: 'https://x.com/unhappyben',
      github: 'https://github.com/unhappyben',
      telegram: 'https://t.me/unhappyben',
      image: '/img/team/ben.jpg'
    },
    {
      name: 'Andrew',
      role: '',
      bio: '',
      twitter: 'https://x.com/davyjones0x',
      github: 'https://github.com/ADWilkinson',
      image: '/img/team/andrew.jpg'
    },
    {
      name: 'Kean',
      role: '',
      bio: '',
      twitter: 'https://x.com/KeanZkp2p',
      github: '',
      telegram: 'https://t.me/ZKP2P_0x',
      image: '/img/team/kean.jpg'
    }
  ];

  return (
    <Layout
      title="Team"
      description="Meet the team behind ZKP2P - building the permissionless fiat ↔ crypto ramp">
      <main className="team-page">
        <div className="container">
          <div className="hero-section">
            <h1>Meet Our Team</h1>
            <p className="hero-description">
              We're a team of engineers, researchers, and product builders passionate about
              making crypto accessible to everyone through zero-knowledge technology.
            </p>
          </div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member-card">
                <div className="member-avatar">
                  {member.image && (
                    <img
                      src={member.image}
                      alt={`${member.name} profile picture`}
                      className="member-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  )}
                  <div className={`avatar-placeholder ${member.image ? 'fallback' : ''}`}>
                    {member.name.charAt(0)}
                  </div>
                </div>
                <div className="member-info">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-bio">{member.bio}</p>
                  <div className="member-social">
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                    {member.telegram && (
                      <a href={member.telegram} target="_blank" rel="noopener noreferrer" className="social-link">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="90 90 330 330"
                          fill="currentColor"
                        >
                          <path d="M109.5 250.5l283.4-117.7c11.2-4.7 21.7 2.7 18.1 19.7l-48.2 226.7c-2.9 13.5-11.2 16.8-22.7 10.5l-63-46.6-30.4 29.3c-3.4 3.4-6.2 6.2-12.7 6.2l4.5-63.3 115-104.1c5-4.5-1.1-7-7.8-2.5l-142 89.2-61.2-19.1c-13.3-4.1-13.5-13.3 2.8-19.7z" />
                        </svg>
                      </a>
                    )}
                    {member.github && member.github.trim() !== '' && (
                      <a href={member.github} target="_blank" rel="noopener noreferrer" className="social-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
} 
