import { useState } from "react";
import Story from "./Story";
import ErrorBoundary from "./ErrorBoundary";
import "./StoryPage.css";

export default function StoryPage() {
  // Safely get name from localStorage with error handling
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem("Name");
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  });

  function handleSaveName(formData) {
    if (!name) {
      try {
        const nameValue = formData.get("Name");
        if (nameValue && nameValue.trim()) {
          localStorage.setItem("Name", nameValue);
          setName(nameValue);
        }
      } catch (error) {
        console.error("Error saving to localStorage:", error);
        alert("Could not save your name. Please check your browser settings.");
      }
    }
  }

  return (
    <ErrorBoundary>
      {name ? (
        <Story />
      ) : (
        <main role="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleSaveName(formData);
            }}
            aria-labelledby="form-title"
            style={{ maxWidth: '400px', width: '100%' }}
          >
            <h1 id="form-title" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
              HELI - Mental Health Awareness
            </h1>
            <label 
              htmlFor="name-input"
              style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}
            >
              Enter your name to continue
            </label>
            <input 
              id="name-input"
              name="Name" 
              type="text"
              required
              aria-required="true"
              autoComplete="given-name"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                marginBottom: '1rem',
                border: '2px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Submit
            </button>
          </form>
        </main>
      )}
    </ErrorBoundary>
  );
}
