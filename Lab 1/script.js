"use strict";

/* Класи */
class PersonalInfo {
  constructor(firstName, lastName, age, address, email, phone, position, summary, photoDataURL) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.address = address;
    this.email = email;
    this.phone = phone;
    this.position = position;
    this.summary = summary;
    this.photoDataURL = photoDataURL;
  }

  toHTML() {
    return `
      ${this.photoDataURL ? `<img id="resume-photo" src="${this.photoDataURL}" alt="Photo" />` : ""}
      <h2>${this.firstName} ${this.lastName}, ${this.age} y.o.</h2>
      <p><strong>Address:</strong> ${this.address}</p>
      <p><strong>Email:</strong> ${this.email}</p>
      <p><strong>Phone:</strong> ${this.phone}</p>
      <p><strong>Position:</strong> ${this.position}</p>
      <p><strong>About Me:</strong> ${this.summary}</p>
    `;
  }
}

class Section {
  constructor(title, items) {
    this.title = title;
    this.items = items;
  }

  toHTML() {
    return `<h3>${this.title}</h3><ul>${this.items.map(item => `<li>${item}</li>`).join("")}</ul>`;
  }
}

class Skills extends Section {
  constructor(items) {
    super("Skills", items);
  }

  toHTML() {
    return `<h3>${this.title}</h3><p>${this.items.join(", ")}</p>`;
  }
}

class Resume {
  constructor(personalInfo, education, experience, skills) {
    this.personalInfo = personalInfo;
    this.education = education;
    this.experience = experience;
    this.skills = skills;
  }

  toHTML() {
    return `
      ${this.personalInfo.toHTML()}
      ${this.education.toHTML()}
      ${this.experience.toHTML()}
      ${this.skills.toHTML()}
    `;
  }
}

/* Функції */
function createParser(type) {
  return function (min, max) {
    return function (val) {
      if (type === "number") {
        const num = parseInt(val);
        if (isNaN(num)) throw new Error("Invalid number");
        if (num < min || num > max) throw new Error(`Age must be between ${min} and ${max}`);
        return num;
      }
      return val.trim();
    };
  };
}

function validateForm() {
  const requiredFields = [
    "first-name", "last-name", "age", "address",
    "email", "phone", "position", "summary",
    "education", "experience", "skills"
  ];

  const emailRegex = /^[\w.-]+@[\w.-]+\.[\w]{2,}$/;
  const phoneRegex = /^\+380\d{9}$/;
  const numberParser = createParser("number")(14, 100);

  for (const id of requiredFields) {
    const input = document.getElementById(id);
    const value = input.value.trim();

    if (!value) {
      alert(`Field "${input.placeholder || id}" is required.`);
      input.focus();
      return false;
    }

    if (id === "email" && !emailRegex.test(value)) {
      alert("Invalid email format.");
      input.focus();
      return false;
    }

    if (id === "phone" && !phoneRegex.test(value)) {
      alert("Phone must be in format +380XXXXXXXXX.");
      input.focus();
      return false;
    }

    if (id === "age") {
      try {
        numberParser(value);
      } catch (err) {
        alert(err.message);
        input.focus();
        return false;
      }
    }
  }

  return true;
}

function getArray(id) {
  const val = document.getElementById(id).value.trim();
  return val ? val.split(",").map(s => s.trim()) : [];
}

function showResumeSection() {
  document.getElementById("resume-section").style.display = "block";
}

function getPhotoAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject("Photo load failed");
    reader.readAsDataURL(file);
  });
}

/* PDF-експорт */
function exportToPDF(data) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const margin = 15;
  const lineHeight = 7;
  const photoSize = 40;
  const pageWidth = pdf.internal.pageSize.getWidth();

  const info = data.personalInfo;

  // Header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text(`${info.firstName} ${info.lastName}`, margin, margin + 10);

  pdf.setFontSize(14);
  pdf.text(info.position, margin, margin + 20);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`Age: ${info.age}`, margin, margin + 30);
  pdf.text(`Address: ${info.address}`, margin, margin + 37);
  pdf.text(`Email: ${info.email}`, margin, margin + 44);
  pdf.text(`Phone: ${info.phone}`, margin, margin + 51);

  if (info.photoDataURL) {
    pdf.addImage(info.photoDataURL, "PNG", pageWidth - photoSize - margin, margin, photoSize, photoSize);
  }

  let y = margin + 60;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("About Me", margin, y);
  y += lineHeight;

  pdf.setFont("helvetica", "normal");
  const aboutLines = pdf.splitTextToSize(info.summary, 180);
  pdf.text(aboutLines, margin, y);
  y += aboutLines.length * lineHeight + 3;

  y = addSectionToPDF("Education", data.education, y, pdf);
  y = addSectionToPDF("Experience", data.experience, y, pdf);
  y = addSectionToPDF("Skills", data.skills, y, pdf);

  pdf.save("resume.pdf");
}

function addSectionToPDF(title, items, startY, pdf) {
  const margin = 15;
  const lineHeight = 6;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text(title, margin, startY);
  startY += lineHeight;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  items.forEach(item => {
    const lines = pdf.splitTextToSize("• " + item, 180);
    pdf.text(lines, margin + 4, startY);
    startY += lines.length * lineHeight;
  });

  return startY + 5;
}

/* DOM */
window.addEventListener("DOMContentLoaded", () => {
  const resumeDisplay = document.getElementById("resume-display");
  const resumeSection = document.getElementById("resume-section");

  const saved = localStorage.getItem("resume-html");
  if (saved) {
    resumeDisplay.innerHTML = saved;
    showResumeSection();
  }

  document.getElementById("resume-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    const numberParser = createParser("number")(14, 100);
    const photoInput = document.getElementById("photo");
    let photoDataURL = "";

    if (photoInput.files.length > 0) {
      photoDataURL = await getPhotoAsDataURL(photoInput.files[0]);
    }

    const personalInfo = new PersonalInfo(
      document.getElementById("first-name").value,
      document.getElementById("last-name").value,
      numberParser(document.getElementById("age").value),
      document.getElementById("address").value,
      document.getElementById("email").value,
      document.getElementById("phone").value,
      document.getElementById("position").value,
      document.getElementById("summary").value,
      photoDataURL
    );

    const education = new Section("Education", getArray("education"));
    const experience = new Section("Experience", getArray("experience"));
    const skills = new Skills(getArray("skills"));

    const resume = new Resume(personalInfo, education, experience, skills);
    resumeDisplay.innerHTML = resume.toHTML();
    showResumeSection();

    // Save as JSON
    const resumeData = {
      personalInfo,
      education: education.items,
      experience: experience.items,
      skills: skills.items
    };
    localStorage.setItem("resume", JSON.stringify(resumeData));
    localStorage.setItem("resume-html", resumeDisplay.innerHTML);
  });

  document.getElementById("save-btn").addEventListener("click", () => {
    alert("Resume saved!");
  });

  document.getElementById("export-pdf-btn").addEventListener("click", () => {
    const data = JSON.parse(localStorage.getItem("resume"));
    if (!data) {
      alert("No resume data found.");
      return;
    }
    exportToPDF(data);
  });

  document.getElementById("clear-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your resume?")) {
      localStorage.removeItem("resume");
      localStorage.removeItem("resume-html");
      resumeDisplay.innerHTML = "";
      resumeSection.style.display = "none";
    }
  });
});
