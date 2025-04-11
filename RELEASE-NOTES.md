# Release Notes

## 2023-04-07

- ✨ feat: Add interactive control panel

  - Added sliding control panel with parameter sliders
  - Added animation toggle button to control panel
  - Made graph clickable area more precise
  - Parameters update in real-time:
    - numberOfRows
    - peakBandRatio
    - peakHeightMultiplier
    - peakBandNoiseMultiplier
    - peakGenerationProbability

- 🔧 chore: Move animation toggle button to bottom-right
  - Updated button position classes in `page.tsx`.
- ✨ feat: Enhance Joy Division graph appearance and animation
  - Positioned animation toggle button to the top-right of the page. (Superseded by above)
  - Adjusted data generation (`generateData`) to create a distribution with low peaks at edges and higher peaks in the center, mimicking the original album art. Added random sharp peaks near center.
  - Changed animation to scroll the entire set of lines vertically downwards instead of wave-like amplitude changes.
  - Wrapped paths in a `<g>` element for easier group transformation.
  - Increased row count and adjusted margins.
- ✨ feat: Refactor Joy Division graph titles and style
  - Moved titles ("THINK BIGGER", "CHOICE MAPPER") from `JoyDivisionGraph` component to the main page (`page.tsx`).
  - Updated button style to dark blue.
  - Modified graph lines to be filled shapes (`fill: black`) for occlusion effect.
  - Fixed minor TypeScript errors in `JoyDivisionGraph`.
- ✨ feat: Implement Joy Division style animated graph
  - Created `JoyDivisionGraph` component using D3.js.
  - Added toggle button for static/animated states.
  - Configured basic styling and layout.
