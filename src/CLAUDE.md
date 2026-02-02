# Source Directory

Custom React components, styling, and pages for the Docusaurus site.

## Structure

```
src/
├── brand/           # Design system package (has own CLAUDE.md)
├── css/
│   ├── custom.css   # Global Docusaurus styles (~1650 lines)
│   └── fonts/       # Graphik fonts (legacy, unused)
└── pages/
    ├── index.js     # Homepage
    ├── index.module.css
    ├── blogs.js     # Blog listing page
    └── blog/        # Individual blog post pages
```

## Brand Package

See `src/brand/CLAUDE.md` for comprehensive design system documentation.

Key exports:
- `tokens.ts` - Colors, typography, spacing, gradients
- `variables.css` - CSS custom properties
- `components/` - Logo, Icon, GradientText, BackgroundNoise

## Global Styles (`css/custom.css`)

### Architecture

1. Imports brand tokens: `@import "../brand/src/variables.css"`
2. Maps brand vars to Docusaurus `--ifm-*` variables
3. Custom component styles

### Key Sections

- **Theme bindings**: `--peer-*` → `--ifm-*` mapping
- **Typography**: PP Valve headlines (uppercase), Inter body
- **Navbar**: Glassmorphism effect, gradient active indicator
- **Sidebar**: Brand-consistent active states
- **Code blocks**: Obsidian background, IGNITE syntax highlighting
- **Blog styles**: Full blog post and listing styles

### Design Rules

- Dark mode only (light theme hidden)
- Headlines always uppercase (PP Valve font rule)
- Focus states: `--peer-ignite-yellow` outline
- Cards: `--peer-rich-black` background, `--peer-border-dark` border
- Scrollbars hidden globally

## Custom Pages

### Homepage (`pages/index.js`)

Components:
- `HomepageHero` - Title + subtitle
- `FeatureCard` - Three cards (Use Peer, Integrate Peer, The Protocol)
- `CommunitySection` - Social links (X, Telegram, GitHub)

Uses CSS Modules with brand CSS variables.

### Blog System (`pages/blogs.js` + `pages/blog/`)

Custom blog implementation (Docusaurus blog disabled):
- `blogs.js` - Listing page with all posts defined inline
- `blog/*.js` - Individual post pages using ReactMarkdown

**To add a blog post:**
1. Create `pages/blog/new-post.js` following existing pattern
2. Add post metadata and content to `blogs.js` array
3. Optionally add markdown file to `/blogs/` for SEO

## Adding New Pages

1. Create `pages/new-page.js`
2. Use brand CSS variables for styling
3. Follow existing patterns (CSS Modules, brand imports)
4. Link from navbar in `docusaurus.config.js` if needed
