class User {
    constructor(name, age, profession) {
        this.name = name;
        this.age = age;
        this.profession = profession;
    }

    display() {
        const info = `User: ${this.name}, Age: ${this.age}, Profession: ${this.profession}`;
        console.log(info);
        alert(info);
    }
}

class Admin extends User {
    constructor(name, age, profession, role) {
        super(name, age, profession);
        this.role = role;
    }

    display() {
        const info = `Admin: ${this.name}, Age: ${this.age}, Profession: ${this.profession}, Role: ${this.role}`;
        console.log(info);
        alert(info);
    }
}

function getUserInput(promptMessage) {
    let input;
    do {
        input = prompt(promptMessage)?.trim();
    } while (!input);
    return input;
}

function getValidAge() {
    let age;
    do {
        age = prompt("Enter age:")?.trim();
    } while (!age || isNaN(age) || age <= 0);
    return Number(age);
}

const userType = getUserInput("Enter type of user:").toLowerCase();
const name = getUserInput("Enter name:");
const age = getValidAge();
const profession = getUserInput("Enter profession:");

if (userType === "admin") {
    const role = getUserInput("Enter admin role:");
    const admin = new Admin(name, age, profession, role);
    admin.display();
} else {
    const user = new User(name, age, profession);
    user.display();
}
