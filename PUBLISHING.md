# Publishing Guide

This document outlines the publishing process for `react-github-activity`.

## Pre-Publishing Checklist

### 1. Version Update
- [ ] Update version in `package.json`
- [ ] Update any version references in documentation
- [ ] Create a new release branch if needed

### 2. Code Quality
- [ ] Run type checking: `npm run type-check`
- [ ] Run linting: `npm run lint`
- [ ] Test build process: `npm run build`
- [ ] Verify exports in `dist/` directory

### 3. Documentation
- [ ] Update README.md with any new features
- [ ] Verify all code examples work
- [ ] Check TypeScript examples are accurate
- [ ] Update CHANGELOG.md (if exists)

### 4. Testing
- [ ] Test in Next.js App Router
- [ ] Test in Next.js Pages Router
- [ ] Test in Create React App
- [ ] Test in Vite
- [ ] Verify TypeScript exports work correctly

## Publishing Process

### 1. Prepare Release
```bash
# Ensure clean working directory
git status

# Install dependencies
npm ci

# Run quality checks
npm run type-check
npm run build

# Test package contents
npm pack --dry-run
```

### 2. Version and Tag
```bash
# Update version (patch/minor/major)
npm version patch

# Or manually update package.json and commit
git add package.json
git commit -m "chore: bump version to x.x.x"
git tag vx.x.x
```

### 3. Publish to NPM
```bash
# Build for production
npm run build

# Publish (this will run prepublishOnly automatically)
npm publish

# Push tags to GitHub
git push origin main --tags
```

### 4. Post-Publishing
- [ ] Verify package on [npmjs.com](https://npmjs.com/package/react-github-activity)
- [ ] Test installation: `npm install react-github-activity@latest`
- [ ] Update GitHub release notes
- [ ] Announce release (if major version)

## Versioning Strategy

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (x.0.0): Breaking changes to API
- **MINOR** (0.x.0): New features, backward compatible
- **PATCH** (0.0.x): Bug fixes, backward compatible

### Breaking Changes
- Changing required props
- Removing props or exports
- Changing TypeScript types in incompatible ways
- Changing default behavior significantly

### New Features
- Adding new optional props
- Adding new exports
- Adding new utility functions
- Improving existing functionality without breaking changes

### Bug Fixes
- Fixing incorrect behavior
- Updating dependencies
- Performance improvements
- Documentation fixes

## Release Checklist Template

```markdown
## Release vX.X.X

### Changes
- [ ] Feature/fix 1
- [ ] Feature/fix 2

### Pre-Release
- [ ] Version updated in package.json
- [ ] Build successful
- [ ] Types check passed
- [ ] Documentation updated
- [ ] Examples tested

### Release
- [ ] Published to NPM
- [ ] GitHub release created
- [ ] Tags pushed

### Post-Release
- [ ] Package verified on NPM
- [ ] Installation tested
- [ ] Community notified (if applicable)
```

## Emergency Fixes

For critical bugs in production:

1. Create hotfix branch from main
2. Fix the issue
3. Test thoroughly
4. Fast-track through testing
5. Publish as patch version
6. Merge back to main

## NPM Scripts Reference

- `npm run build` - Build the package
- `npm run dev` - Watch mode for development
- `npm run type-check` - TypeScript type checking
- `npm run lint` - Code quality checks
- `npm pack` - Test package contents locally

## Development Setup

For contributors and local development:

### 1. Clone and Setup
```bash
git clone https://github.com/yourusername/react-github-activity.git
cd react-github-activity
npm install
```

### 2. Development Commands
```bash
npm run dev        # Watch mode for development
npm run build      # Build the package
npm run type-check # TypeScript type checking
npm run lint       # Code quality checks
```

### 3. Testing Locally
```bash
# Build and test package contents
npm run build
npm pack --dry-run

# Test in another project
npm pack
# Then in your test project:
npm install /path/to/react-github-activity-x.x.x.tgz
```

### 4. Contribution Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test thoroughly
4. Run type checks and build: `npm run type-check && npm run build`
5. Commit and push: `git commit -m "feat: your feature" && git push`
6. Create a Pull Request

## Package Structure

```
react-github-activity/
├── src/
│   ├── GitHubContributions.tsx  # Main component
│   ├── utils.ts                 # Utility functions
│   └── index.ts                 # Package exports
├── dist/                        # Built files (generated)
├── package.json                 # Package configuration
├── tsconfig.json               # TypeScript config
├── README.md                   # Documentation
└── PUBLISHING.md              # This file
```

## Build Output

The build process generates:
- `dist/index.js` - CommonJS build
- `dist/index.esm.js` - ES modules build
- `dist/index.d.ts` - TypeScript definitions

## Quality Assurance

Before publishing, ensure:
- [ ] All TypeScript types are exported correctly
- [ ] Component works in both light and dark modes
- [ ] Error handling works as expected
- [ ] Documentation is up to date
- [ ] Examples in README work correctly 