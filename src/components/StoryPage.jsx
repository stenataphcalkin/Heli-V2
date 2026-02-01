import { useState } from "react";
import Story from "./Story";
import "./StoryPage.css";

export default function StoryPage() {
  const [name, setName] = useState(localStorage.getItem("Name"));

  function handleSaveName(formData) {
    if (!name) {
      localStorage.setItem("Name", formData.get("Name"));
      setName(formData.get("Name"));
    }
  }

  return (
    <>
      {name ? (
        <Story />
      ) : (
        <div className="login-container">
          <form action={handleSaveName} className="name-form">
            <label>Enter your name to continue</label>
            <input name="Name" required placeholder="Your Name..." />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </>
  );
}
