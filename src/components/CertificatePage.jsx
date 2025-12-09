import React, { useState } from "react";

export default function CertificateDownloadPage() {
  const [userName, setUserName] = useState("");
  return (
    <>
      <h1>
        🎉 Congratulations on passing this Tech Educators PREVENT training
        module 🎉
      </h1>
      <p> Please enter your name below to download your certificate!</p>
      <div className="name-input-field">
        <label htmlFor="name-input">Your Name:</label>
        <input
          id="name-input"
          type="text"
          value={userName}
          placeholder="e.g. Ogilvie Maurice"
          onChange={(event) => setUserName(event.target.value)}
        />
      </div>
      {/* Need to resolve JSPDF template and input to handle the following */}
      <button
        // !!onClick={downloadCertificate}>
        disabled={!userName.trim()}
      >
        Download your certificate!
      </button>
    </>
  );
}
