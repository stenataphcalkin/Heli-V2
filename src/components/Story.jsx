import { useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Story() {
  // Conversation state
  const [chat, setChat] = useState([
    {
      sender: "Lilly",
      text: "Hey Evan, it's Lilly - Lazlo's sister. I know you're really busy with your job nowadays but I wanted to reach out because I'm really worried about Lazlo."
    }
  ]);

  // Choices and responses
  const choices = [
    {
      text: "Oh no, what's going on?",
      response: "Lilly: He's been acting out of character and I'm really worried."
    },
    {
      text: "We haven't spoke for a while, are you sure I am the right person to speak to?",
      response: "Lilly: I know, but you're the only one I trust to help."
    },
    {
      text: "I'm really swamped right now, maybe give it a few days and see if he settles down?",
      response: "Lilly: I understand, but I'm really worried and don't know what else to do."
    }
  ];

  // Handle choice click
  const handleChoice = (choice) => {
    setChat((prev) => [
      ...prev,
      { sender: "You", text: choice.text }
    ]);
    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        { sender: "Lilly", text: choice.response.replace('Lilly: ', '') }
      ]);
    }, 900); // 900ms delay for realism
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', background: 'none' }}>
      <Box sx={{
        width: '100%',
        bgcolor: '#3498f2',
        py: { xs: 2, md: 3 },
        px: { xs: 1, sm: 2 },
        borderRadius: '0 0 24px 24px',
        position: 'relative',
        boxSizing: 'border-box',
        maxWidth: '100vw',
        overflow: 'hidden',
        minHeight: { xs: 120, md: 160 }
      }}>
        {/* Top right: Save, Load, Restart */}
        <Box sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
          zIndex: 2
        }}>
          <Button variant="contained" sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 700, borderRadius: 2, minWidth: 80 }}>Restart</Button>
          <Button variant="contained" sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 700, borderRadius: 2, minWidth: 80 }}>Save</Button>
          <Button variant="contained" sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 700, borderRadius: 2, minWidth: 80 }}>Load</Button>
        </Box>
        <Box sx={{
          maxWidth: 900,
          mx: 'auto',
          px: { xs: 1, sm: 2 },
          textAlign: 'center',
          wordBreak: 'break-word',
        }}>
          <Typography
            variant="h4"
            sx={{
              color: '#fff',
              fontWeight: 700,
              letterSpacing: 1,
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
              lineHeight: 1.2,
              wordBreak: 'break-word',
              whiteSpace: 'normal',
            }}
          >
            HELI - Helping Everyone Learn Interactively
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: '#e0e0e0',
              mt: 1,
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              lineHeight: 1.3,
              wordBreak: 'break-word',
              whiteSpace: 'normal',
            }}
          >
            Safeguarding Scenario: Recognizing and Responding to Concerns
          </Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mt: 2,
          flexWrap: 'wrap',
          zIndex: 1
        }}>
          <Button variant="contained" sx={{ bgcolor: '#6c63ff', color: '#fff', fontWeight: 700, borderRadius: 2, px: 3 }}>
            YOUR APPROACH: <span style={{ fontWeight: 900, marginLeft: 8 }}>Building Understanding</span>
          </Button>
          <Button variant="outlined" sx={{ color: '#fff', borderColor: '#fff', fontWeight: 700 }}>Light</Button>
          <Button variant="outlined" sx={{ color: '#fff', borderColor: '#fff', fontWeight: 700 }}>Dark</Button>
          <Button variant="outlined" sx={{ color: '#fff', borderColor: '#fff', fontWeight: 700 }}>Colorblind</Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', alignItems: 'flex-start', mt: 4, gap: 4 }}>
        {/* Left: Story context and choices */}
        <Box sx={{ flex: 1, minWidth: 350, maxWidth: 600, pr: 2 }}>
          {/* Story context */}
          <Box sx={{ bgcolor: '#e3f2fd', borderRadius: 2, boxShadow: 1, p: 3, mb: 2 }}>
            <Typography variant="body1" sx={{ color: '#333', fontWeight: 500 }}>
              You receive a message from a school friend's sister. She's concerned about her brother because he's been acting out of character.
            </Typography>
          </Box>
          {/* Choices */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {choices.map((choice, idx) => (
              <Button
                key={idx}
                variant="contained"
                sx={{
                  color: '#222',
                  bgcolor: '#fffde7',
                  borderColor: '#ffe082',
                  fontWeight: 700,
                  boxShadow: 1,
                  '&:hover': { bgcolor: '#ffe082' }
                }}
                onClick={() => handleChoice(choice)}
              >
                {choice.text}
              </Button>
            ))}
          </Box>
        </Box>
        {/* Right: Phone mockup with chat */}
        <Box sx={{ flex: 1, minWidth: 350, maxWidth: 400, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{
            width: 320,
            height: 600,
            bgcolor: '#fff',
            borderRadius: '32px',
            boxShadow: 6,
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            position: 'relative',
            border: '10px solid #222',
            overflow: 'hidden',
          }}>
            {/* Phone notch */}
            <Box sx={{ width: 80, height: 12, bgcolor: '#222', borderRadius: 6, position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }} />
            {/* Contact header */}
            <Box sx={{
              width: '100%',
              height: 54,
              bgcolor: '#f5f7fa',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
            }}>
              <Box sx={{
                width: 36,
                height: 36,
                bgcolor: '#b3c6e0',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 18,
                color: '#222',
                mr: 1.5,
              }}>
                L
              </Box>
              <Typography variant="subtitle1" sx={{ color: '#222', fontWeight: 700, fontSize: 16 }}>
                Lilly (Lazlo's Sister)
              </Typography>
            </Box>
            {/* Chat bubbles */}
            <Box sx={{
              mt: 1.5,
              mb: 1.5,
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              px: 1.2,
              pb: 2.5,
              boxSizing: 'border-box',
              width: '100%',
              maxWidth: '100%',
            }}>
              {chat.map((msg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    alignSelf: msg.sender === "You" ? 'flex-end' : 'flex-start',
                    bgcolor: msg.sender === "You" ? '#1976d2' : '#f1f0f0',
                    color: msg.sender === "You" ? '#fff' : '#222',
                    borderRadius: msg.sender === "You"
                      ? '18px 18px 4px 18px'
                      : '18px 18px 18px 4px',
                    p: 1.2,
                    px: 2,
                    maxWidth: '75%',
                    fontSize: '1.05rem',
                    boxShadow: 1,
                    mb: 0.5,
                    wordBreak: 'break-word',
                    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                    position: 'relative',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: msg.sender === "You" ? '#fff' : '#222',
                      fontSize: '1.05rem',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {msg.text}
                  </Typography>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: msg.sender === "You" ? '#cbe2ff' : '#888',
                      position: 'absolute',
                      right: 12,
                      bottom: 4,
                      opacity: 0.7,
                    }}
                  >
                    {msg.sender === 'You' ? 'You' : 'Lilly'}
                  </span>
                </Box>
              ))}
            </Box>
            {/* Typing indicator and input */}
            <Box sx={{ mt: 2, px: 1.2, pb: 1.5 }}>
              <Typography variant="caption" sx={{ color: '#bbb', mb: 1 }}>Typing...</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <input style={{ flex: 1, borderRadius: 16, border: '1px solid #ccc', padding: '8px 12px', fontSize: '1rem' }} placeholder="Message..." />
                <Button variant="contained" sx={{ borderRadius: 16, minWidth: 48 }}>Send</Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
