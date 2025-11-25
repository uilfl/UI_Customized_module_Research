# AI-Powered Personalized E-Commerce Website

An intelligent e-commerce platform that dynamically adapts its UI based on user behavior, persona detection, and feedback using browser-based AI (TensorFlow.js).

## Features

### 🤖 AI-Powered Personalization
- **Real-time Persona Detection**: Uses TensorFlow.js to analyze user behavior and classify them into personas:
  - **Bargain Hunter**: Focuses on deals and price comparisons
  - **Impulse Buyer**: Quick decisions, responds to promotions
  - **Researcher**: Values detailed information and reviews
  - **Loyal Customer**: Regular visitor with consistent patterns
  - **New Visitor**: First-time or infrequent visitor

### 🎨 Dynamic UI Customization
Based on the detected persona, the UI automatically adjusts:
- **Color Schemes**: Vibrant, Minimal, Warm, Cool, or Default
- **Layout Styles**: Grid, List, Compact, or Spacious
- **Content Display**: Reviews, Price Comparisons, Deals, Recommendations
- **Font Sizes**: Small, Medium, or Large
- **Animation Levels**: None, Subtle, or Full

### 📊 Behavior Tracking
The system tracks various user interactions:
- Click patterns and frequency
- Scroll depth on pages
- Time spent on page
- Product views
- Cart interactions
- Search queries
- Price filter usage
- Review reading behavior
- Category preferences

### 💬 User Feedback Integration
- Users can provide feedback on the UI experience
- Feedback is incorporated to further refine personalization
- Manual preference overrides available

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **TensorFlow.js** - Browser-based machine learning for persona detection

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/uilfl/UI_Customized_module_Research.git
cd UI_Customized_module_Research

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## How It Works

1. **Behavior Tracking**: As users interact with the site, their behavior is tracked (clicks, scrolls, time, etc.)

2. **Persona Detection**: The TensorFlow.js model analyzes the behavior data and classifies the user into one of five personas

3. **UI Adaptation**: Based on the detected persona, the UI preferences are automatically generated and applied

4. **Feedback Loop**: Users can provide feedback, which further refines the personalization

5. **Persistence**: User behavior and preferences are stored in localStorage for a consistent experience across sessions

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles with Tailwind
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main e-commerce page
├── components/
│   ├── Cart.tsx         # Shopping cart component
│   ├── Header.tsx       # Site header with search
│   ├── PersonalizationPanel.tsx  # AI panel showing persona & settings
│   ├── ProductCard.tsx  # Product display card
│   ├── ProductGrid.tsx  # Product grid layout
│   ├── ProductModal.tsx # Product details modal
│   ├── Recommendations.tsx  # Personalized recommendations
│   └── Sidebar.tsx      # Category and filter sidebar
├── lib/
│   ├── behaviorTracker.ts    # User behavior tracking module
│   ├── PersonalizationContext.tsx  # React context for state
│   ├── personaDetector.ts    # TensorFlow.js AI model
│   ├── products.ts           # Sample product data
│   └── types.ts              # TypeScript type definitions
└── public/              # Static assets
```

## License

ISC