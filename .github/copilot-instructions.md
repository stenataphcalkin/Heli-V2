# Copilot Instructions for Heli-V2

## Project Overview
Heli-V2 is a React-based interactive story experience with PDF certificate generation. It combines two distinct systems:
1. **React SPA** (modern UI for story interaction and certificate generation)
2. **Ink.js Story Engine** (narrative logic executed via legacy JavaScript in `public/ink-files/main.js`)

## Architecture

### Core Tech Stack
- **Frontend**: React 19 + React Router v7 for navigation
- **Build Tool**: Vite (dev: `npm run dev`, build: `npm run build`)
- **Story Engine**: Ink.js (narrative scripting framework)
- **PDF Generation**: jsPDF library
- **State Management**: React hooks + localStorage for user data (name persistence)

### Component Structure
- **[src/App.jsx](src/App.jsx)**: Routes to `/` (story) and `/certificate` pages
- **[src/components/StoryPage.jsx](src/components/StoryPage.jsx)**: Entry point; captures user name, manages game state
- **[src/components/Story.jsx](src/components/Story.jsx)**: Renders ink.js story (implementation needed/verified)
- **[src/components/CertificatePage.jsx](src/components/CertificatePage.jsx)**: Generates downloadable PDF certificate using jsPDF
- **[public/ink-files/main.js](public/ink-files/main.js)**: Ink.js runtime (458 lines) - processes narrative flow, handles tags (IMAGE, AUDIO, AUDIOLOOP, LINK, BACKGROUND, CLASS), progress tracking

### Data Flow
1. User enters name → saved to localStorage
2. Story component loads ink.js story from `firstDraft.js`
3. Ink engine processes story state, renders choices as buttons
4. Selections advance narrative and update progress bar
5. Certificate page reads localStorage name and generates PDF

## Critical Patterns & Conventions

### Story Content Management
- Story content imported from `public/ink-files/firstDraft.js` (exportable format from Ink editor)
- **Custom Ink Tags** parsed in `main.js`:
  - `# IMAGE: path/to/image` - displays image in story
  - `# AUDIO: path/to/audio` - plays sound once
  - `# AUDIOLOOP: path/to/audio` - background loop (pauses previous)
  - `# SENDER: name` - formats text as message bubble (right-aligned if "You", left-aligned otherwise)
  - `# LINK: url` - navigates away; `# LINKOPEN: url` - opens in new tab
  - `# BACKGROUND: url` - sets page background
  - `# CLASS: className` - applies CSS classes
  - `# CLEAR` / `# RESTART` - clears DOM or restarts story

### UI/State Patterns
- **localStorage key**: `"Name"` (capitalized) for storing user name
- **Conditional rendering**: StoryPage shows form if no name, Story component if name exists
- **Progress tracking**: Calculated from story state's `callstack.threadCounter`

## Developer Workflows

### Running the Project
```bash
npm install        # Install dependencies
npm run dev        # Start Vite dev server (hot reload)
npm run build      # Production build (output: dist/)
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
```

### Key Files to Modify
- **Story content**: Edit narrative in Ink (external tool), export to `public/ink-files/firstDraft.js`
- **UI styling**: [src/App.css](src/App.css), [src/components/StoryPage.css](src/components/StoryPage.css)
- **Story interaction**: Modify `main.js` to add custom tag handlers or alter progress calculation
- **Certificate design**: Update jsPDF rendering in `CertificatePage.jsx` (base64 asset embedded)

### Debugging Tips
- Story state stored as JSON in `story.state.toJson()` - can inspect for tracking choices/progress
- Ink.js logs `currentTags` for each story line - check browser console
- localStorage persists name across sessions; clear dev tools Storage to reset
- Audio objects stored globally (`this.audio`, `this.audioLoop`) - watch for pause/resume issues

## Integration Points & Dependencies

### External Assets
- Ink story content files in `public/ink-files/` (referenced statically)
- Images/audio referenced in Ink tags must be relative paths to `public/` folder
- Certificate generation uses embedded base64 image in `CertificatePage.jsx`

### Browser APIs
- **localStorage**: User name persistence (domain-scoped)
- **Audio API**: Direct `new Audio()` instantiation for playback
- **jsPDF**: DOM-based PDF rendering (embeds fonts/images)

### ESLint Config
- Uses `@eslint/js` with React plugins
- React Refresh enabled for HMR
- Enforce hooks rules via `eslint-plugin-react-hooks`
