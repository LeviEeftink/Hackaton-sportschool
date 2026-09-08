import React from 'react'

// InitTheme is bewust vereenvoudigd om de React 19 / Next 16 warning
// "Scripts inside React components are never executed when rendering on the client"
// te vermijden. Theme wordt nu alleen via ThemeProvider (client useEffect)
// gezet — geen inline <script> meer. Dit voorkomt FOUC-fix script maar
// elimineert de browser warning. Wil je FOUC voorkomen, plaats een plain
// <script> direct in <head> via next.config of via een custom _document.
export const InitTheme: React.FC = () => {
  return null
}
