"use strict";

/* Клас для персональної інформації */
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

  /* Генерація HTML для персональної інформації */
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

/* Клас для секцій резюме */
class Section {
  constructor(title, items) {
    this.title = title;
    this.items = items;
  }

  /* Генерація HTML для секції */
  toHTML() {
    return `<h3>${this.title}</h3><ul>${this.items.map(item => `<li>${item}</li>`).join("")}</ul>`;
  }
}

/* Клас для секції навичок (спадкує від Section) */
class Skills extends Section {
  constructor(items) {
    super("Skills", items);
  }

  /* Генерація HTML для секції навичок */
  toHTML() {
    return `<h3>${this.title}</h3><p>${this.items.join(", ")}</p>`;
  }
}

/* Клас для створення резюме */
class Resume {
  constructor(personalInfo, education, experience, skills) {
    this.personalInfo = personalInfo;
    this.education = education;
    this.experience = experience;
    this.skills = skills;
  }

  /* Генерація HTML для всього резюме */
  toHTML() {
    return `
      ${this.personalInfo.toHTML()}
      ${this.education.toHTML()}
      ${this.experience.toHTML()}
      ${this.skills.toHTML()}
    `;
  }
}

/* Функція для створення парсера значень */
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

/* Функція для валідації форми */
function validateForm() {
  const requiredFields = [
    "first-name", "last-name", "age", "address",
    "email", "phone", "position", "summary",
    "education", "experience", "skills"
  ];

  const emailRegex = /^[\w.-]+@[\w.-]+\.[\w]{2,}$/;
  const phoneRegex = /^\+380\d{9}$/;
  const numberParser = createParser("number")(14, 100);

  let isValid = true;

  /* Перевірка кожного поля форми */
  for (const id of requiredFields) {
    const input = document.getElementById(id);
    const value = input.value.trim();

    if (!value) {
      console.error(`Field "${id}" is empty.`);
      alert(`Field "${input.placeholder || id}" is required.`);
      input.focus();
      isValid = false;
      break;
    }

    /* Перевірка email */
    if (id === "email") {
      if (!emailRegex.test(value)) {
        console.error(`Invalid email: ${value}`);
        alert("Invalid email format.");
        input.focus();
        isValid = false;
        break;
      }
    } 
    /* Перевірка телефону */
    else if (id === "phone") {
      if (!phoneRegex.test(value)) {
        console.error(`Invalid phone: ${value}`);
        alert("Phone must be in format +380XXXXXXXXX.");
        input.focus();
        isValid = false;
        break;
      }
    } 
    /* Перевірка віку */
    else if (id === "age") {
      try {
        const parsedAge = numberParser(value);
        console.log(`Age passed: ${parsedAge}`);
      } catch (err) {
        console.error(`Invalid age: ${value} - ${err.message}`);
        alert(err.message);
        input.focus();
        isValid = false;
        break;
      }
    } 
    /* Перевірка інших полів */
    else {
      console.log(`Field "${id}" passed: ${value}`);
    }
  }

  return isValid;
}

/* Допоміжна функція для отримання значень з поля як масиву */
function getArray(id) {
  const val = document.getElementById(id).value.trim();
  return val ? val.split(",").map(s => s.trim()) : [];
}

/* Функція для відображення секції резюме */
function showResumeSection() {
  document.getElementById("resume-section").style.display = "block";
}

/* Функція для отримання фото */
function getPhotoAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject("Photo load failed");
    reader.readAsDataURL(file);
  });
}

/* Подія при завантаженні DOM */
window.addEventListener("DOMContentLoaded", () => {
  const resumeDisplay = document.getElementById("resume-display");
  const resumeSection = document.getElementById("resume-section");

  /* Завантаження з localStorage */
  const saved = localStorage.getItem("resume");
  if (saved) {
    resumeDisplay.innerHTML = saved;
    showResumeSection();
  }

  /* Обробка форми при відправці */
  document.getElementById("resume-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    const numberParser = createParser("number")(14, 100);
    const photoInput = document.getElementById("photo");
    let photoDataURL = "";

    /* Отримання фото */
    if (photoInput.files.length > 0) {
      photoDataURL = await getPhotoAsDataURL(photoInput.files[0]);
    }

    /* Створення об'єкта персональної інформації */
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

    /* Створення секцій для освіти, досвіду та навичок */
    const education = new Section("Education", getArray("education"));
    const experience = new Section("Experience", getArray("experience"));
    const skills = new Skills(getArray("skills"));

    /* Створення та відображення резюме */
    const resume = new Resume(personalInfo, education, experience, skills);
    resumeDisplay.innerHTML = resume.toHTML();
    showResumeSection();
  });

  /* Збереження резюме */
  document.getElementById("save-btn").addEventListener("click", () => {
    localStorage.setItem("resume", resumeDisplay.innerHTML);
    alert("Resume saved!");
  });

  /* Експорт у PDF */
  document.getElementById("export-pdf-btn").addEventListener("click", async () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    const margin = 10;
    const lineHeight = 8;
    const photoSize = 40;

    // Отримання даних з форми
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const age = document.getElementById("age").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const position = document.getElementById("position").value;
    const summary = document.getElementById("summary").value;

    // Створення розділів для освіти, досвіду та навичок
    const education = getArray("education");
    const experience = getArray("experience");
    const skills = getArray("skills");

    // Форматування PDF
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text(`${firstName} ${lastName}`, margin, margin + 15);
    pdf.setFontSize(12);
    pdf.text(`${position}, ${age} years old`, margin, margin + 25);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(`Address: ${address}`, margin, margin + 35);
    pdf.text(`Email: ${email}`, margin, margin + 45);
    pdf.text(`Phone: ${phone}`, margin, margin + 55);

    pdf.setFont("helvetica", "italic");
    pdf.text("About Me:", margin, margin + 65);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(summary, margin, margin + 75);

    // Додавання освіти, досвіду, навичок
    let currentY = margin + 85;
    currentY = addSection("Education", education, currentY);
    currentY = addSection("Experience", experience, currentY);
    currentY = addSection("Skills", skills, currentY);

    // Додавання фото в PDF
    const photoInput = document.getElementById("photo");
    if (photoInput.files.length > 0) {
      const file = photoInput.files[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        const photoDataURL = e.target.result;

        pdf.addImage(photoDataURL, "PNG", pageWidth - photoSize - margin, margin + 5, photoSize, photoSize);

        pdf.save("resume.pdf");
      };
      reader.readAsDataURL(file);
    } else {
      pdf.save("resume.pdf");
    }
  });

  /* Очистка резюме */
  document.getElementById("clear-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your resume?")) {
      localStorage.removeItem("resume");
      resumeDisplay.innerHTML = "";
      resumeSection.style.display = "none";
    }
  });
});
