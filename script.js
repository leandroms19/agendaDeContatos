const form = document.getElementById("form");
const contactName = document.getElementById("contactName");
const contactNumber = document.getElementById("number");
const email = document.getElementById("email");
const tbody = document.getElementById('tbody');

let contactSaved = [];
let dinamicID = 0;
let allowedCharacters = /^[A-Za-z \u00C0-\u017F]+$/;
let isFormValid = false;
let isValidationOn = false;

const resetElm = (elm) => {
    elm.nextElementSibling.classList.add("hidden");
};
const invalidateElm = (elm) => {
    elm.nextElementSibling.classList.remove("hidden");
}

let inputs = [contactName, contactNumber];

form.addEventListener('submit', (e) => {
    e.preventDefault();
    isValidationOn = true;
    checkInputs();
    if (isFormValid) {
        getInfo();
       
    }
});

inputs.forEach((input) => {
    input.addEventListener("input", () => {
        checkInputs();
    })
});
    

function cleanForm() {
    document.getElementById("form").reset();
}

function cleanSearchField() {
    document.getElementById("searchField").value = '';
}

function checkInputs() {
    if (!isValidationOn) return;

    isValidationOn = false;
    isFormValid = true;

    resetElm(contactName);
    resetElm(contactNumber);

    if (contactNumber.value.length > 11 || contactNumber.value.length < 10) {
        invalidateElm(contactNumber);
        isFormValid = false;
    }
    if (contactName.value == '') {
       
    }

    if (!allowedCharacters.test(contactName.value)) {
        invalidateElm(contactName);
        isFormValid = false;
    }

}

contactName.addEventListener("input", () => {
    checkInputs()
})

contactNumber.addEventListener("input", () => {
    checkInputs()
})



function getInfo() {
    contactName.focus();
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
        const contactOrdered = contactSaved.sort(function (a, b) {
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            else if (b.name.toLowerCase() > a.name.toLowerCase()) return -1;
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
            <a class="icon">
                <i class="material-icons" style="font-size:24px">person</i>
            </a><br>
                <span class="info">${contactSaved[i].name} </span>
            </div>
            <div style="border-bottom: 1px solid white">
                <a class="icon">
                    <i class="material-icons" style="font-size:24px">call</i>
                </a><br>
                <span class="info">${contactSaved[i].number}</span></br>
                <span class="info" id="numberType">${contactSaved[i].tipoNumero}</span>
            </div>
            <div style="border-bottom: 1px solid white">
                <a class="icon"> <i class="material-icons" style="font-size:24px; background-color: #f5f5f5">mail_outline</i></a><br>
                <span class="info">${contactSaved[i].emailContact}</span>
            </div>
            <a id="deleteButton" onclick="getID(this)">
                <i class="material-icons" style="font-size:24px; color:red">delete</i>
            </a>
            <a id="editButton" onclick="editContact(this)">
                <i class="material-icons" style="font-size:24px; color:blue">mode_edit</i>
            </a>
           </td>
        </tr><br>`;
    }
    table.innerHTML = dataHTML;
}

function editContact(info) {
    cleanSearchField();
    form.focus(function () {
        form.css("border", "1px solid black")
    });
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