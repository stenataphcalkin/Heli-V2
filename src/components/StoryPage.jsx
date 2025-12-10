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
        <>
          <form action={(e) => handleSaveName(e)}>
            <label>Enter your name to continue</label>
            <input name="Name" />
            <button type="submit">Submit</button>
          </form>
        </>
      )}
    </>
  );
}
