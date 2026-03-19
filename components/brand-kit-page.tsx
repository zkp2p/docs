'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react';

import styles from '@/components/brand-kit-page.module.css';

function useCopyToClipboard() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  async function copy(text: string, itemId: string) {
    try {
      await navigator.clipboard.writeText(text);

      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
      }

      setCopiedItem(itemId);
      resetTimeoutRef.current = window.setTimeout(() => {
        setCopiedItem((current) => (current === itemId ? null : current));
        resetTimeoutRef.current = null;
      }, 2000);
    } catch {
      return;
    }
  }

  return { copy, copiedItem };
}

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Brand Kit</h1>
        <p className={styles.heroSubtitle}>
          Everything you need to represent Peer correctly. Download logos, access color
          codes, and follow our brand guidelines.
        </p>
      </div>
    </section>
  );
}

type LogoCardProps = {
  copiedItem: string | null;
  copy: (text: string, itemId: string) => Promise<void>;
  description: string;
  imageSrc: string;
  isDark: boolean;
  name: string;
  pngPath?: string;
  svgPath?: string;
};

function LogoCard({
  name,
  description,
  imageSrc,
  svgPath,
  pngPath,
  isDark,
  copy,
  copiedItem,
}: LogoCardProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const itemId = `svg-${name}`;

  async function handleCopySvg() {
    if (!svgPath) return;

    if (svgContent) {
      await copy(svgContent, itemId);
      return;
    }

    try {
      const response = await fetch(svgPath);

      if (!response.ok) {
        return;
      }

      const text = await response.text();
      setSvgContent(text);
      await copy(text, itemId);
    } catch {
      return;
    }
  }

  return (
    <div className={`${styles.logoCard} ${isDark ? styles.logoCardDark : styles.logoCardLight}`}>
      <div className={styles.logoPreview}>
        <img src={imageSrc} alt={`${name} logo`} loading="lazy" />
      </div>
      <div className={styles.logoInfo}>
        <h3 className={styles.logoName}>{name}</h3>
        <p className={styles.logoDescription}>{description}</p>
      </div>
      <div className={styles.logoActions}>
        {svgPath ? (
          <button className={styles.copyButton} onClick={handleCopySvg} aria-label={`Copy ${name} SVG code`}>
            {copiedItem === itemId ? 'Copied!' : 'Copy SVG'}
          </button>
        ) : null}
        <div className={styles.downloadLinks}>
          {svgPath ? (
            <a href={svgPath} download className={styles.downloadLink}>
              SVG
            </a>
          ) : null}
          {pngPath ? (
            <a href={pngPath} download className={styles.downloadLink}>
              PNG
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function LogoGuidelines() {
  const logoDos = [
    'Use gradient version wherever possible',
    'Give logo space to breathe',
    'Position in corners for balance',
  ];

  const logoDonts = [
    "Don't change the logo lockup",
    "Don't blur the logo",
    "Don't rotate (except 90°)",
    "Don't change the logotype",
    "Don't apply effects",
    "Don't squash/stretch",
    "Don't encroach on clear space",
    "Don't use unapproved colours",
  ];

  return (
    <div className={styles.guidelinesInline}>
      <h3 className={styles.subsectionTitle}>Usage Guidelines</h3>
      <div className={styles.guidelinesGridInline}>
        <div className={styles.guidelineBlock}>
          <h4 className={styles.guidelineTitle}>Do&apos;s</h4>
          <ul className={styles.guidelineList}>
            {logoDos.map((item) => (
              <li key={item} className={styles.guidelineItemDo}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20,6 9,17 4,12" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.guidelineBlock}>
          <h4 className={styles.guidelineTitle}>Don&apos;ts</h4>
          <ul className={styles.guidelineList}>
            {logoDonts.map((item) => (
              <li key={item} className={styles.guidelineItemDont}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.sizeSpecsContainerInline}>
        <h4 className={styles.guidelineTitle}>Minimum Size &amp; Clear Space</h4>
        <div className={styles.sizeSpecsGrid}>
          <div className={styles.sizeSpec}>
            <span className={styles.sizeSpecLabel}>Screen</span>
            <span className={styles.sizeSpecValue}>22px minimum height</span>
          </div>
          <div className={styles.sizeSpec}>
            <span className={styles.sizeSpecLabel}>Print</span>
            <span className={styles.sizeSpecValue}>0.24 inches minimum</span>
          </div>
          <div className={styles.sizeSpec}>
            <span className={styles.sizeSpecLabel}>Clear Space</span>
            <span className={styles.sizeSpecValue}>Equal to logo height on all sides</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoSection({
  copy,
  copiedItem,
}: {
  copiedItem: string | null;
  copy: (text: string, itemId: string) => Promise<void>;
}) {
  const logos = [
    {
      name: 'Gradient / Colour',
      description: 'Primary logo for dark backgrounds. Use wherever possible.',
      imageSrc: '/img/brand-kit/logos/peer-logo-colour.svg',
      svgPath: '/img/brand-kit/logos/peer-logo-colour.svg',
      pngPath: '/img/brand-kit/logos/peer-logo-colour.png',
      isDark: true,
    },
    {
      name: 'White',
      description: 'For dark backgrounds when gradient is not suitable.',
      imageSrc: '/img/brand-kit/logos/peer-logo-white.svg',
      svgPath: '/img/brand-kit/logos/peer-logo-white.svg',
      pngPath: '/img/brand-kit/logos/peer-logo-white.png',
      isDark: true,
    },
    {
      name: 'Black',
      description: 'For light backgrounds only.',
      imageSrc: '/img/brand-kit/logos/peer-logo-black.svg',
      svgPath: '/img/brand-kit/logos/peer-logo-black.svg',
      pngPath: '/img/brand-kit/logos/peer-logo-black.png',
      isDark: false,
    },
    {
      name: 'Profile Mark',
      description: 'For social media avatars and app icons.',
      imageSrc: '/img/brand-kit/logos/peer-profile.png',
      pngPath: '/img/brand-kit/logos/peer-profile.png',
      isDark: true,
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionNumber}>01</span>
        <h2 className={styles.sectionTitle}>Logos</h2>
      </div>
      <div className={styles.logoGrid}>
        {logos.map((logo) => (
          <LogoCard key={logo.name} {...logo} copy={copy} copiedItem={copiedItem} />
        ))}
      </div>
      <div className={styles.downloadAllContainer}>
        <a href="/brand-kit/peer-logos.zip" download className={styles.downloadAllButton}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download All Logos (ZIP)
        </a>
      </div>
      <LogoGuidelines />
    </section>
  );
}

function generateColorSvg({
  hex,
  isGradient,
  gradientFrom,
  gradientTo,
}: {
  gradientFrom?: string;
  gradientTo?: string;
  hex?: string;
  isGradient?: boolean;
}) {
  if (isGradient && gradientFrom && gradientTo) {
    return `<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ignition" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${gradientFrom}"/>
      <stop offset="100%" stop-color="${gradientTo}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#ignition)"/>
</svg>`;
  }

  return `<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="${hex ?? '#000000'}"/>
</svg>`;
}

type ColorSwatchProps = {
  copiedItem: string | null;
  copy: (text: string, itemId: string) => Promise<void>;
  gradientFrom?: string;
  gradientTo?: string;
  hex?: string;
  isGradient?: boolean;
  name: string;
};

function ColorSwatch({
  name,
  hex,
  isGradient,
  gradientFrom,
  gradientTo,
  copy,
  copiedItem,
}: ColorSwatchProps) {
  const itemId = `color-${name}`;
  const displayValue = isGradient ? `${gradientFrom} → ${gradientTo}` : hex;
  const copyValue = isGradient
    ? `linear-gradient(90deg, ${gradientFrom} 0%, ${gradientTo} 100%)`
    : hex ?? '';

  const swatchStyle = isGradient
    ? { background: `linear-gradient(90deg, ${gradientFrom} 0%, ${gradientTo} 100%)` }
    : { background: hex };

  const needsBorder = hex === '#FFFFFF' || hex === '#EEEEEE';

  function handleDownload() {
    const svgContent = generateColorSvg({ hex, isGradient, gradientFrom, gradientTo });
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `peer-color-${name.toLowerCase().replace(/\s+/g, '-')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.colorSwatchCard}>
      <button
        className={styles.colorSwatchClickable}
        onClick={() => void copy(copyValue, itemId)}
        aria-label={`Copy ${name} color code`}
      >
        <div
          className={`${styles.colorSwatch} ${needsBorder ? styles.colorSwatchBordered : ''}`}
          style={swatchStyle}
        />
        <div className={styles.colorInfo}>
          <span className={styles.colorName}>{name}</span>
          <span className={styles.colorHex}>{copiedItem === itemId ? 'Copied!' : displayValue}</span>
        </div>
      </button>
      <button
        className={styles.colorDownloadButton}
        onClick={handleDownload}
        aria-label={`Download ${name} color swatch`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7,10 12,15 17,10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        SVG
      </button>
    </div>
  );
}

function ColorSection({
  copy,
  copiedItem,
}: {
  copiedItem: string | null;
  copy: (text: string, itemId: string) => Promise<void>;
}) {
  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Ignition', isGradient: true, gradientFrom: '#FF3A33', gradientTo: '#FFE500' },
    { name: 'Light Grey', hex: '#EEEEEE' },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionNumber}>02</span>
        <h2 className={styles.sectionTitle}>Colors</h2>
      </div>
      <div className={styles.colorGrid}>
        {colors.map((color) => (
          <ColorSwatch key={color.name} {...color} copy={copy} copiedItem={copiedItem} />
        ))}
      </div>
      <p className={styles.colorNote}>
        <strong>Ignition</strong> is the signature Peer gradient. Use for primary brand
        expression, CTAs, and key visual elements.
      </p>
    </section>
  );
}

function TypographyGuidelines() {
  const typographyDonts = [
    "Don't use unapproved typefaces",
    "Don't apply effects to typefaces",
    "Don't tilt (except 0° or 90°)",
    "Don't mix lower and upper case",
    "Don't use unapproved colors",
    "Don't stray from recommended spacing",
    "Don't use PP Valve for small copy",
    "Don't use stroke or outlines",
  ];

  return (
    <div className={styles.guidelinesInline}>
      <h3 className={styles.subsectionTitle}>Usage Guidelines</h3>
      <div className={styles.guidelineBlockWide}>
        <h4 className={styles.guidelineTitle}>Don&apos;ts</h4>
        <ul className={styles.guidelineListGrid}>
          {typographyDonts.map((item) => (
            <li key={item} className={styles.guidelineItemDont}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TypographySection() {
  const typographyRules = [
    {
      number: '1',
      title: 'Stay left-aligned, rag right',
      description: 'Text should be left-aligned with a natural rag on the right side.',
    },
    {
      number: '2',
      title: 'All caps and double size',
      description: 'Headlines use PP Valve in uppercase at prominent sizes.',
    },
    {
      number: '3',
      title: 'Align x-heights or baselines',
      description: 'When mixing type sizes, align on x-heights or baselines for visual harmony.',
    },
    {
      number: '4',
      title: 'Watch the rag',
      description: 'Avoid awkward line breaks and maintain a balanced text shape.',
    },
    {
      number: '5',
      title: 'Give things space',
      description: 'Use generous whitespace around type elements.',
    },
    {
      number: '6',
      title: 'Keep line length reasonable',
      description: 'Optimal line length is 45-70 characters for readability.',
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionNumber}>03</span>
        <h2 className={styles.sectionTitle}>Typography</h2>
      </div>

      <div className={styles.typefaceGrid}>
        <div className={styles.typefaceCard}>
          <span className={styles.typefaceLabel}>Headlines</span>
          <h3 className={styles.typefaceName}>PP Valve</h3>
          <p className={styles.typefaceSpecimen}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
          <p className={styles.typefaceNote}>Always uppercase, Semibold weight</p>
        </div>

        <div className={styles.typefaceCard}>
          <span className={styles.typefaceLabel}>Body</span>
          <h3 className={styles.typefaceNameBody}>Inter</h3>
          <p className={styles.typefaceSpecimenBody}>
            ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
          </p>
          <p className={styles.typefaceNote}>Regular weight for body text</p>
        </div>
      </div>

      <h3 className={styles.subsectionTitle}>Typography Rules</h3>
      <div className={styles.rulesGrid}>
        {typographyRules.map((rule) => (
          <div key={rule.number} className={styles.ruleCard}>
            <span className={styles.ruleNumber}>{rule.number}</span>
            <h4 className={styles.ruleTitle}>{rule.title}</h4>
            <p className={styles.ruleDescription}>{rule.description}</p>
          </div>
        ))}
      </div>

      <TypographyGuidelines />
    </section>
  );
}

function DownloadSection() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionNumber}>04</span>
        <h2 className={styles.sectionTitle}>Downloads</h2>
      </div>
      <div className={styles.downloadGrid}>
        <a href="/brand-kit/peer-logos.zip" download className={styles.downloadCard}>
          <div className={styles.downloadIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <div className={styles.downloadInfo}>
            <span className={styles.downloadTitle}>Logo Package</span>
            <span className={styles.downloadDescription}>
              All logo variants in SVG and PNG formats
            </span>
          </div>
        </a>

        <a
          href="https://drive.google.com/drive/folders/1ejYBILtBY10tNVrIySfcUC-mI07iFRUW?usp=sharing"
          target="_blank"
          rel="noreferrer"
          className={styles.downloadCard}
        >
          <div className={styles.downloadIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className={styles.downloadInfo}>
            <span className={styles.downloadTitle}>Full Brand Kit</span>
            <span className={styles.downloadDescription}>
              Complete brand guidelines, assets, and templates
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}

export function BrandKitPage() {
  const { copy, copiedItem } = useCopyToClipboard();

  return (
    <main className={styles.brandKit}>
      <HeroSection />
      <div className={styles.container}>
        <LogoSection copy={copy} copiedItem={copiedItem} />
        <ColorSection copy={copy} copiedItem={copiedItem} />
        <TypographySection />
        <DownloadSection />
      </div>
    </main>
  );
}
