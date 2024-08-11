const url = "http://localhost:3000/notes"
async function getNotes() {
    const res = await fetch(url , {
        method : "GET"
    })
    const data = await res.json()
    return data
}

async function renderNotes() {
    const notes = await getNotes();
    const row = document.querySelector('.row')
    notes.forEach(note => {
        const div = document.createElement('div')
        div.className = `col-lg-3 col-md-6 col-sm-12 my-2`
        div.innerHTML = `
            <div class="card text-bg-light mb-3" style="max-width: 18rem;">
            <div class="card-header">${note.title}</div>
            <div class="card-body">
                <p class="card-text">${note.desc}</p>
                <button class="btn btn-danger" 
                onclick="deleteNote('${note.id}')"> Delete Note </button>
                <button class="btn btn-success" onclick="editNote('${note.id}')"> Edit Note </button>
            </div>
            </div>
        `
        row.appendChild(div)
    });
}
function addNote(event) {
    event.preventDefault();
    
    const titleValue = document.querySelector('#title').value
    const descValue = document.querySelector("#desc").value
     // Validation check
     if (titleValue === "" || descValue === "") {
        alert("Both title and description are required.");
        console.log("Fail")
        return; // Stop the function execution if validation fails
     }
    fetch(url , {
        method : "POST" , 
        body : JSON.stringify({
            title : titleValue , 
            desc : descValue
        }),
        headers : {
            "Content-type" : "application/json; charset=UTF-8"
        }
    })
    // }).then(res => res.json())
    // .then(data => console.log(data))
    // .catch(err => console.log(err))
}



function deleteNote(id) {
    fetch(`${url}/${id}` , {
        method : "DELETE"
    }) 
}

 // Edit an existing note
 function editNote(id) {

    const titleElement = document.querySelector('#title');
    const descElement = document.querySelector('#desc');
    
    if (!titleElement || !descElement) {
        console.error('Edit elements not found for note ID:', id);
        return;
    }

    // Find the card element related to the clicked note
    const card = document.querySelector(`button[onclick="editNote('${id}')"]`).closest('.card');
    const cardTitle = card.querySelector('.card-header');
    const cardDesc = card.querySelector('.card-text');
    const editButton = card.querySelector('.btn-success');

    // Make the title and description editable
    cardTitle.contentEditable = true;
    cardDesc.contentEditable = true;
    cardTitle.style.backgroundColor = "#dddbdb";
    cardDesc.style.backgroundColor = "#dddbdb";

    // Change the button text to "Save"
    editButton.textContent = "Save";

    // When the "Save" button is clicked
    editButton.onclick = async function() {
        const newTitle = cardTitle.textContent;
        const newDesc = cardDesc.textContent;

        if (!newTitle || !newDesc) {
            alert("Title or description is empty for note");
            return;
        }

        // Update the note via the API
        await fetch(`${url}/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                title: newTitle,
                desc: newDesc
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        // After saving, make the fields non-editable again
        cardTitle.contentEditable = false;
        cardDesc.contentEditable = false;
        cardTitle.style.backgroundColor = "";
        cardDesc.style.backgroundColor = "";

        // Change the button text back to "Edit Note"
        editButton.textContent = "Edit Note";
        
        // Rebind the edit function
        editButton.onclick = () => editNote(id);
        
    };
}

document.addEventListener('DOMContentLoaded' , renderNotes)
document.querySelector('form').addEventListener('submit' , addNote)
