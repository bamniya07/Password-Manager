function maskPassword(pass) {
    return '*'.repeat(pass.length);
}

function copyText(txt) {
    navigator.clipboard.writeText(txt).then(
        () => {
            document.getElementById("alert").style.display = "inline";
            setTimeout(() => {
                document.getElementById("alert").style.display = "none";
            }, 2000);
        },
        () => {
            alert("Clipboard copying failed");
        }
    );
}

const deletePassword = (website) => {
    let data = localStorage.getItem("passwords");
    let arr = JSON.parse(data);
    let arrUpdated = arr.filter(e => e.website !== website);
    localStorage.setItem("passwords", JSON.stringify(arrUpdated));
    alert(`Successfully deleted ${website}'s password`);
    showPasswords();
}

const clearAllPasswords = () => {
    localStorage.removeItem("passwords");
    alert("All passwords have been deleted.");
    showPasswords();
}

const showPasswords = () => {
    let tb = document.querySelector("table");
    let data = localStorage.getItem("passwords");
    if (!data || JSON.parse(data).length === 0) {
        tb.innerHTML = "<tr><td colspan='4'>No Data To Show</td></tr>";
    } else {
        tb.innerHTML = `
            <tr>
                <th>Website</th>
                <th>Username</th>
                <th>Password</th>
                <th>Delete</th>
            </tr>`;
        let arr = JSON.parse(data);
        let str = arr.map(element => `
            <tr>
                <td>${element.website} <img onclick="copyText('${element.website}')" src="./copy.svg" alt="Copy Button"></td>
                <td>${element.username} <img onclick="copyText('${element.username}')" src="./copy.svg" alt="Copy Button"></td>
                <td>${maskPassword(element.password)} <img onclick="copyText('${element.password}')" src="./copy.svg" alt="Copy Button"></td>
                <td><button class="btnsm" onclick="deletePassword('${element.website}')">Delete</button></td>
            </tr>`).join('');
        tb.innerHTML += str;
    }
    document.getElementById('website').value = "";
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
}

document.addEventListener("DOMContentLoaded", () => {
    showPasswords();
    document.querySelector("#password-form").addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the default form submission
        let website = document.getElementById('website').value.trim();
        let username = document.getElementById('username').value.trim();
        let password = document.getElementById('password').value.trim();

        if (website && username && password) {
            let passwords = localStorage.getItem("passwords");
            let json = passwords ? JSON.parse(passwords) : [];
            json.push({ website, username, password });
            localStorage.setItem("passwords", JSON.stringify(json));
            alert("Password Saved");
            showPasswords();
        } else {
            alert("Please fill in all fields.");
        }
    });

    document.querySelector(".clear-all-btn").addEventListener("click", clearAllPasswords);
});
