# Work Calendar 2026

A modern, responsive web application for tracking work hours throughout 2026. Built with Vite, React, and Tailwind CSS.

## Features

- 📅 **Full Year Calendar**: View all 12 months of 2026
- ⏰ **30-Minute Increments**: Log work hours in 0.5-hour increments (0.5, 1.0, 1.5, 2.0, etc.)
- 💰 **Earnings Calculator**: Set your hourly rate and automatically calculate earnings
- 📊 **Monthly & Yearly Summaries**: Track total hours and earnings per month and year
- 💾 **Data Persistence**: All data saved to localStorage (survives page refresh)
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- 🎨 **Modern UI**: Clean, intuitive interface built with Tailwind CSS

## Project Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd work-calendar-2026
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
work-calendar-2026/
├── public/
│   ├── _redirects          # Netlify SPA redirects
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Calendar.jsx    # Main calendar grid component
│   │   ├── DayEntry.jsx    # Modal for adding/editing hours
│   │   ├── MonthNavigation.jsx  # Month switcher
│   │   ├── Settings.jsx    # Hourly rate configuration
│   │   └── Summary.jsx    # Statistics and totals
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css         # Tailwind CSS imports
├── netlify.toml           # Netlify deployment configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── package.json
```

## Usage

### Setting Your Hourly Rate

1. Click the "⚙️ Settings" button in the header
2. Enter your hourly rate in USD
3. Click "Save Rate"

### Logging Work Hours

1. Click on any day in the calendar
2. Select the number of hours worked (in 30-minute increments)
3. Click "Save" to store the entry

### Viewing Summaries

- **Monthly Summary**: Shows total hours and earnings for the current month
- **Yearly Summary**: Shows total hours, earnings, and days worked for 2026

### Navigation

- Use the "Prev" and "Next" buttons to navigate between months
- Use the month dropdown to jump to any month
- On mobile devices, swipe left/right to navigate (optional)

## Data Storage

All data is stored in your browser's localStorage:

- **Work Entries**: `workCalendar2026_entries` - JSON object with date keys and hour values
- **Hourly Rate**: `workCalendar2026_hourlyRate` - Number value

Data persists across browser sessions and page refreshes. If you clear your browser data, all entries will be lost.

## Deployment to Netlify

### Option 1: Deploy via Netlify CLI

1. Install Netlify CLI globally:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod
```

### Option 2: Deploy via Netlify Dashboard

1. Build the project:
```bash
npm run build
```

2. Go to [Netlify](https://app.netlify.com)
3. Drag and drop the `dist` folder to the Netlify dashboard
4. Your site will be live!

### Option 3: Connect Git Repository

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click "Deploy site"

The `netlify.toml` file is already configured with the correct build settings and SPA redirects.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technical Details

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks (useState, useEffect)
- **Data Persistence**: localStorage API
- **Deployment**: Netlify (SPA configuration)

## Troubleshooting

### Data Not Saving

- Check if localStorage is enabled in your browser
- Ensure you're not in private/incognito mode (some browsers restrict localStorage)
- Check browser console for errors

### Build Errors

- Ensure all dependencies are installed: `npm install`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires v16+)

### Styling Issues

- Ensure Tailwind CSS is properly configured
- Clear browser cache
- Check that `index.css` includes Tailwind directives

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, please check the browser console for error messages and ensure all dependencies are properly installed.
