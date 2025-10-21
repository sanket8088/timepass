# 💕 Romantic Pickup Line Generator

A beautiful web app that generates custom romantic pickup lines using OpenAI's GPT. Perfect for making someone special smile!

## Features

- 🎨 Beautiful, romantic UI with animated hearts
- 🎭 Multiple style options: Sweet, Funny, Poetic, Cheesy
- 💖 Different moods: Romantic, Playful, Passionate, Gentle
- 🌶️ Adjustable spiciness levels: Mild, Medium, Spicy
- 🤖 Powered by OpenAI GPT for creative and unique pickup lines
- 📱 Fully responsive design

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   PORT=3000
   ```

3. **Run the app:**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   
   Navigate to `http://localhost:3000`

## How It Works

The app runs on a **single Express server** that:
- Serves the frontend (HTML, CSS, JavaScript) as static files
- Provides a backend API endpoint (`/api/generate-pickup-line`) that calls OpenAI
- All on one port for easy deployment!

## Deployment

This app is ready to deploy on platforms like:
- **Heroku**: Just push and add your `OPENAI_API_KEY` in the config vars
- **Render**: Auto-deploy from GitHub
- **Railway**: One-click deployment
- **Vercel/Netlify**: May need serverless function setup

Make sure to set your `OPENAI_API_KEY` environment variable in your deployment platform!

## API Usage

The app uses OpenAI's GPT-3.5-turbo model. Each pickup line generation costs a small amount based on OpenAI's pricing. Monitor your usage at [OpenAI Platform](https://platform.openai.com/usage).

## Project Structure

```
new_app/
├── server.js           # Express server (frontend + backend)
├── package.json        # Dependencies
├── .env               # Environment variables (not committed)
├── .env.example       # Example environment file
├── README.md          # This file
└── public/            # Static frontend files
    ├── index.html     # Main HTML
    ├── styles.css     # Styling
    └── script.js      # Frontend JavaScript
```

## Made with Love ❤️

Enjoy making your special someone smile!

