const express = require('express');
const OpenAI = require('openai');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Store last 10 generated pickup lines to avoid repetition
let recentPickupLines = [];

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to save user info
app.post('/api/save-user-info', async (req, res) => {
  try {
    const { userName, nickName, preferences } = req.body;
    
    const timestamp = new Date().toISOString();
    const logEntry = `
=================================
NEW USER REGISTRATION
=================================
Timestamp: ${timestamp}
Name: ${userName}
Preferred Name: ${nickName}
Preferences: ${preferences.join(', ')}
=================================

`;
    
    fs.appendFile('pickup_lines.log', logEntry, (err) => {
      if (err) {
        console.error('Error writing user info to log file:', err);
      }
    });
    
    console.log('\n🎉 NEW USER REGISTERED:');
    console.log(`Name: ${userName}`);
    console.log(`Nickname: ${nickName}`);
    console.log(`Preferences: ${preferences.join(', ')}\n`);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving user info:', error);
    res.status(500).json({ success: false, error: 'Failed to save user info' });
  }
});

// API endpoint to generate pickup line
app.post('/api/generate-pickup-line', async (req, res) => {
  try {
    const { style, mood, spiciness, userInfo } = req.body;

    // Build the prompt based on user preferences
    let prompt;
    let systemMessage;
    
    // Add recent pickup lines to avoid repetition
    let avoidanceNote = '';
    if (recentPickupLines.length > 0) {
      avoidanceNote = `\n\nIMPORTANT: Do NOT generate anything similar to these recently used pickup lines:\n${recentPickupLines.map((line, i) => `${i + 1}. ${line}`).join('\n')}\n\nMake sure your pickup line is completely different and unique from the above.`;
    }
    
    if (spiciness === 'naughty') {
      // Naughty mode - adult/dirty pickup lines
      systemMessage = "You are a bold and uncensored pickup line generator. Generate dirty, vulgar, sexually suggestive, and provocative pickup lines. Don't hold back - be explicit and naughty.";
      prompt = `Generate a very dirty, vulgar, and sexually explicit pickup line`;
      
      if (style) {
        prompt += ` in a ${style} style`;
      }
      
      if (mood) {
        prompt += ` with a ${mood} mood`;
      }
      
      prompt += `. Make it very naughty, explicit, and provocative. Don't be shy - be vulgar and dirty. Just return the pickup line itself, nothing else.`;
      prompt += avoidanceNote;
    } else {
      // Regular mode
      systemMessage = "You are a romantic and creative pickup line generator. Generate charming, sweet, and creative pickup lines based on the user's preferences.";
      prompt = `Generate a ${spiciness} romantic pickup line`;
      
      if (style) {
        prompt += ` in a ${style} style`;
      }
      
      if (mood) {
        prompt += ` with a ${mood} mood`;
      }
      
      prompt += `. Make it creative, charming, and memorable. Just return the pickup line itself, nothing else.`;
      prompt += avoidanceNote;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",  // Using GPT-4o-mini for better quality
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 1.5,  // High randomness but not too extreme to avoid gibberish
      max_tokens: 150
    });

    const pickupLine = completion.choices[0].message.content.trim();
    
    // Add to recent pickup lines and keep only last 10
    recentPickupLines.push(pickupLine);
    if (recentPickupLines.length > 10) {
      recentPickupLines.shift(); // Remove oldest
    }
    
    // Log the request details and response to terminal
    console.log('\n=================================');
    console.log('📝 PICKUP LINE GENERATED');
    console.log('=================================');
    console.log('Style:', style);
    console.log('Mood:', mood);
    console.log('Spiciness:', spiciness);
    console.log('---------------------------------');
    console.log('Generated Line:', pickupLine);
    console.log('Total in history:', recentPickupLines.length);
    console.log('=================================\n');
    
    // Log to file
    const timestamp = new Date().toISOString();
    const logEntry = `
=================================
Timestamp: ${timestamp}
User: ${userInfo?.userName || 'Unknown'} (${userInfo?.nickName || 'N/A'})
Style: ${style}
Mood: ${mood}
Spiciness: ${spiciness}
Generated Line: ${pickupLine}
=================================

`;
    
    fs.appendFile('pickup_lines.log', logEntry, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });
    
    res.json({ 
      success: true, 
      pickupLine: pickupLine 
    });

  } catch (error) {
    console.error('Error generating pickup line:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate pickup line. Please try again.' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`💕 Romantic Pickup Line App running on http://localhost:${PORT}`);
});

