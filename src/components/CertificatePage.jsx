import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf/dist/polyfills.es.js";

const doc = new jsPDF({
  orientation: "landscape",
});

const today = new Date();
const formattedDate = today.toLocaleDateString("en-GB", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const dateString = `${formattedDate}`;
doc.text(dateString, 148.5, 128.5, { align: "center" });

doc.text("Your Name goes here!", 148.5, 108.5, { align: "center" });
doc.save("TechEducators_Prevent_Certificate.pdf");

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
