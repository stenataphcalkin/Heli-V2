# Accessibility Documentation

This document outlines the accessibility improvements made to the HELI application following [The A11Y Project](https://www.a11yproject.com/) guidelines.

## Overview

The HELI app is designed to be accessible to all users, including those using assistive technologies like screen readers, keyboard-only navigation, and users with various disabilities.

## Key Accessibility Features Implemented

### 1. Semantic HTML
- **Proper heading hierarchy**: H1 → H2 → H3 structure for logical content flow
- **Landmark regions**: `<main>`, `<section>`, `<article>` elements for screen reader navigation
- **Semantic elements**: Proper use of `<form>`, `<label>`, `<button>`, and `<time>` elements

### 2. Keyboard Navigation
- **Focus visible**: 3px solid outline on all focusable elements
- **Skip link**: "Skip to story choices" link for keyboard users to bypass repetitive content
- **Keyboard accessible**: All interactive elements can be accessed and activated via keyboard
- **Tab order**: Logical tab order through the interface

### 3. ARIA Attributes
- **aria-label**: Descriptive labels for buttons and interactive elements
- **aria-labelledby**: Associates controls with their labels
- **aria-live**: Announces dynamic content changes (chat messages, typing indicators)
- **aria-pressed**: Indicates toggle button states (theme selection)
- **aria-disabled**: Indicates disabled state on choices already selected
- **role attributes**: Proper roles for custom elements (log, status, banner, group)

### 4. Screen Reader Support
- **Descriptive labels**: All buttons and links have clear, descriptive text
- **Live regions**: Chat messages announced as they appear
- **Hidden text**: Visually hidden but screen-reader-accessible headings for context
- **Alt text**: Decorative images marked with aria-hidden="true"
- **Time formatting**: Proper `<time>` elements with datetime attributes

### 5. Forms
- **Associated labels**: All form inputs have explicit `<label>` elements with `htmlFor`
- **Required fields**: `required` and `aria-required="true"` attributes
- **Autocomplete**: Appropriate autocomplete attributes for name inputs
- **Error handling**: Clear error messaging for form validation
- **Proper submission**: Form submit prevention and proper event handling

### 6. Color and Contrast
- **Theme options**: Light, Dark, and Colorblind-friendly themes
- **Sufficient contrast**: All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- **Color-independent**: Information not conveyed by color alone
- **Focus indicators**: High contrast focus outlines

### 7. Responsive and Flexible
- **Viewport meta tag**: Proper mobile viewport configuration
- **Responsive design**: Works on all screen sizes
- **Text resizing**: Text can be resized up to 200% without loss of functionality
- **Touch targets**: Minimum 44x44px tap targets for mobile users

### 8. Motion and Animation
- **Reduced motion**: Respects `prefers-reduced-motion` user preference
- **Smooth scrolling**: Chat auto-scroll with smooth animation (respects reduced motion)
- **Typing indicators**: Clear visual and screen-reader indicators

### 9. Document Structure
- **Language attribute**: `lang="en"` on `<html>` element
- **Page title**: Descriptive title for the page
- **Meta description**: Clear description for search engines and assistive tech
- **Theme color**: Proper theme color metadata

### 10. Error Boundaries
- **Graceful degradation**: Error boundaries catch and display errors accessibly
- **User-friendly messages**: Clear error messages without technical jargon
- **Recovery options**: Clear actions users can take when errors occur

## Testing Recommendations

### Manual Testing
1. **Keyboard Navigation**: Tab through the entire interface, ensure logical order
2. **Screen Reader**: Test with NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS), TalkBack (Android)
3. **Zoom**: Test at 200% browser zoom
4. **Color Blind**: Test with color blindness simulators
5. **Reduced Motion**: Test with system preferences set to reduce motion

### Automated Testing Tools
- **axe DevTools**: Browser extension for accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Chrome DevTools accessibility audit
- **Pa11y**: Command-line accessibility testing

### Keyboard Shortcuts
- **Tab**: Navigate forward through interactive elements
- **Shift + Tab**: Navigate backward
- **Enter/Space**: Activate buttons and links
- **Arrow keys**: Navigate within groups (theme buttons)
- **Escape**: Close modals (if implemented)

## WCAG 2.1 Compliance

This application aims for **WCAG 2.1 Level AA** compliance:

### Level A (Minimum)
✅ Non-text content has alternatives
✅ Time-based media has alternatives
✅ Content is adaptable
✅ Content is distinguishable
✅ Keyboard accessible
✅ Users have enough time
✅ No seizure-inducing content
✅ Navigable
✅ Input modalities accessible

### Level AA (Target)
✅ Captions and audio descriptions provided
✅ Contrast ratio of at least 4.5:1
✅ Text can be resized
✅ Images of text avoided (except logos)
✅ Multiple ways to navigate
✅ Headings and labels are descriptive
✅ Focus visible
✅ Language of page identified

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Known Limitations
1. **Save/Load functionality**: Currently not implemented, buttons are placeholders
2. **Phone mockup**: Visual representation, may not be ideal for screen readers (marked as decorative where appropriate)
3. **Progress tracking**: No visible progress indicator for story completion

## Future Enhancements
1. Add progress indicator with ARIA live region
2. Implement actual save/load functionality
3. Add keyboard shortcuts reference modal
4. Add text-to-speech option for chat messages
5. Add language selection (internationalization)
6. Implement high contrast mode detection and optimization

## Resources
- [The A11Y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [W3C WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/)

## Contact
For accessibility issues or suggestions, please file an issue in the project repository.
