# 3D Rotating Cube

An interactive 3D cube visualization built with React, TypeScript, and Three.js. This application allows users to manipulate a 3D cube through both UI controls and keyboard shortcuts.

## Live Demo

[View Live Demo](https://rotating-cube-n3swb5nrb-space-plushy.vercel.app)

## Features

- Real-time 3D rendering with Three.js
- Interactive controls for cube manipulation:
  - Color selection with presets and color picker
  - Rotation speed adjustment
  - Wireframe mode toggle
  - Manual rotation controls
  - Reset rotation functionality
- Full keyboard support:
  - Arrow keys for rotation
  - R to reset rotation
  - W to toggle wireframe
  - +/- to adjust speed
  - H to toggle help panel
- Responsive design for all device sizes
- Custom material and lighting effects
- Performance optimized with React hooks

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Technologies

- React 18
- TypeScript
- Vite (for fast builds and development)
- Three.js (for 3D rendering)
- CSS Modules (for component styling)

## Project Structure

```
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Cube/        # Cube component with Three.js
│   │   └── Controls/    # UI controls for cube manipulation
│   ├── hooks/           # Custom React hooks
│   ├── styles/          # Global styles
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── vite-env.d.ts    # Vite type definitions
└── index.html           # HTML entry point
```

## License

MIT

## Author

SpacePlushy

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
