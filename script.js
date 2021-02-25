const form = document.getElementById("form");
const contactName = document.getElementById("contactName");
const contactNumber = document.getElementById("number");
const email = document.getElementById("email");
const tbody = document.getElementById('tbody');
let contactSaved = [];
let dinamicID = 0;
let allowedCharacters = /^[A-Za-z \u00C0-\u017F]+$/;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    checkInputs();
})

function cleanForm() {
    document.getElementById("form").reset();
}

function cleanSearchField() {
    document.getElementById("searchField").value = '';
}

function checkInputs() {
    if (contactNumber.value.length != 11 && contactName.value == '') {
        alert("É necessário que preencha o nome e o número do contato!")
        cleanForm();
        contactName.focus()
        return false
    }

    if (contactNumber.value.length != 11 && !allowedCharacters.test(contactName.value)) {
        alert("Caracter(es) inválido(s) e número inválido!")
        contactName.value = '';
        contactNumber.value = '';
        contactName.focus();
        return false
    }

    if (contactNumber.value.length != 11) {
        alert("Preencha um número válido!");
        contactNumber.value = '';
        contactNumber.focus();
        return false
    }
    if (contactName.value == '') {
        alert("Preencha o nome do contato!")
        contactName.value = '';
        contactName.focus()
        return false
    }

    if (!allowedCharacters.test(contactName.value)) {
        alert("Caracter inválido!")
        contactName.value = '';
        contactName.focus();
        return false
    }
    else {
        getInfo();
    }
}

function getInfo() {
    contactName.focus()
    let marker = document.getElementById("option");
    let chosenMarker = marker.options[marker.selectedIndex].value;
    if (chosenMarker.value == 0) {
        checkInputs(chosenMarker);
    }
    let contact = {
        name: contactName.value,
        number: contactNumber.value,
        tipoNumero: chosenMarker,
        emailContact: email.value,
        id: 0,
    }

    contactSaved.push(contact);
    orderList();

    function orderList() {
        var namesToLowerCase = [];
        for (var i = 0; i < contactSaved.length; i++) {
            namesToLowerCase.push(contactSaved[i].name.toLowerCase());
        }
        const contactsOrdem = namesToLowerCase.sort(function (a, b) {
            if (a.name > b.name) return 1;
            else if (b.name > a.name) return -1;
            else return 0
        });
        loadList(contactSaved);
    }
    cleanForm();
}

function setID() {
    for (var i = 0; i < contactSaved.length; i++) {
        contactSaved[i].id = i;
    }
}

function loadList(contactSaved) {
    const table = document.getElementById('tbody');
    let dataHTML = ''
    setID();
    for (var i = 0; i < contactSaved.length; i++) {
        dinamicID = contactSaved[i].id;
        dataHTML += `<tr id="${dinamicID}" class="row-item">
        <td class="item">
            <div style="border-bottom: 1px solid white">
                <a><i class="material-icons" style="font-size:24px">person</i></a></br>
                <span id="nome">${contactSaved[i].name} </span>
            </div>
            <div style="border-bottom: 1px solid white">
                <a><i class="material-icons" style="font-size:24px">call</i></i></a></br>
                <span class="info">${contactSaved[i].number}</span></br>
                <span class="info">${contactSaved[i].tipoNumero}</span>
            </div>
            <div style="border-bottom: 1px solid white">
                <a><i class="material-icons" style="font-size:24px">mail_outline</i></a></br>
                <span class="info"> E-mail: ${contactSaved[i].emailContact}</span>
            </div>
            ${"<input id=\"deleteButton\" type=\"button\" value= \"Deletar\" onclick=\"getID(this)\">"}
            ${"<input id=\"editButton\" type=\"button\" value= \"Editar\" onclick=\"editContact(this)\">"}</td>
        </tr><br>`;
    }
    table.innerHTML = dataHTML;
}

function editContact(info) {
    window.scrollTo(0, 0)
    cleanSearchField();
    let selectedID = parseInt(info.parentNode.parentNode.id);

    for (var i = 0; i < contactSaved.length; i++) {
        if (parseInt(contactSaved[i].id) == selectedID) {
            document.getElementById("contactName").value = contactSaved[i].name;
            document.getElementById("number").value = contactSaved[i].number;
            document.getElementById("option").value = contactSaved[i].tipoNumero;
            document.getElementById("email").value = contactSaved[i].emailContact;
            removeContact(selectedID)
        }
    }
}

function getID(idInfo) {
    let selectedID = parseInt(idInfo.parentNode.parentNode.id);
    removeContact(selectedID);
}

function removeContact(selectedID) {
    cleanSearchField();
    let idContact = document.getElementsByClassName("row-item");
    for (var i = 0; i < idContact.length; i++) {
        if (parseInt(idContact[i].id) == selectedID) {
            contactSaved.splice(selectedID, 1);
        }
    }
    loadList(contactSaved);
}

const searchField = document.getElementById("searchField");
searchField.addEventListener("keyup", (e) => {
    let searchString = (e.target.value);
    const filteredContacts = contactSaved.filter((contact) => {
        if (searchString.length && searchString == "") {
            loadList(contactSaved);
        }
        if (allowedCharacters.test(searchString)) {
            return contact.name.includes(searchString);
        }
        else {
            return contact.number.includes(searchString)
        }
    });
    showContactFiltered(filteredContacts);
});

function showContactFiltered(filteredContacts) {
    loadList(filteredContacts)
}