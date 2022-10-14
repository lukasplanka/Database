// loading from localStorage
const getSavedNames = () => {
    const myNames = localStorage.getItem('names')

    if (myNames !== null){
        return JSON.parse(myNames)
    } else {
        return []
    }
}

let names = getSavedNames()

// saveing from inputs to localStorage
const saveNames = (oneName) => {
    localStorage.setItem('names', JSON.stringify(oneName))
}

// submitting the form and saving it to localStorage
let myForm = document.querySelector('#test-form')

myForm.addEventListener('submit', (event) => {
    event.preventDefault()

    names.push({
        id: uuidv4(),
        firstName: event.target.elements.firstName.value,
        secondName: event.target.elements.secondName.value,
        crime: event.target.elements.crime.value
    })

    event.target.elements.firstName.value = ''
    event.target.elements.secondName.value = ''
    event.target.elements.crime.value = ''

    saveNames(names)
})

// generation of HTML structure after clicking
// listing new names after deletion
const generateHTMLstructure = (oneName) => {
    
    const newDiv = document.createElement('div')
    const newParagraph = document.createElement('p')
    const button = document.createElement('button')

    newParagraph.innerHTML = `
        Meno: ${oneName.firstName} <br/>
        Priezvisko: ${oneName.secondName} <br/>
        Zločin: ${oneName.crime} <br/>
        ID: ${oneName.id}
        `
    
    newDiv.appendChild(newParagraph)

    // grease button setting
    button.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Vymazať osobu`
    newParagraph.appendChild(button)

    button.addEventListener('click', () => {
        removeNames(names, oneName.id)
        saveNames(names)
        toListAgain()
    })

    return newDiv
}

// listing on the page
let buttonToList = document.querySelector('.to-list')
buttonToList.addEventListener('click', () => {

    if (localStorage.getItem('names') == null){
        alert('Databáza je prázdna.')
    } else {
        document.querySelector('.list-names').innerHTML = ''
        
        let namesFromStorage = localStorage.getItem('names')
        let namesFromStorageJSON = JSON.parse(namesFromStorage)

        namesFromStorageJSON.forEach((myName) => {
            const oneNameHTML = generateHTMLstructure(myName)
            document.querySelector('.list-names').appendChild(oneNameHTML)
        })
    }
})

// filtering by id
const removeNames = (ourNames, id) => {
    const index = ourNames.findIndex((nameWantToCheck) => {
        return nameWantToCheck.id === id
    })

    if (index > -1){
        ourNames.splice(index, 1)
    }
}

// rewriting localStorage after deleting a user
const toListAgain = () => {
    document.querySelector('.list-names').innerHTML = ''

    let newData = getSavedNames()

    newData.forEach((onlyOneName) => {
        const newContent = generateHTMLstructure(onlyOneName)
        document.querySelector('.list-names').appendChild(newContent)
    });
}

// filtering
let nameFilter = document.querySelector('.name-filter')

nameFilter.addEventListener('input', function(event){
    
    let whatWeSearch = event.target.value

    let ourResults = names.filter(function(oneName){
        return oneName.firstName.toLowerCase().includes(whatWeSearch.toLowerCase()) ||
        oneName.secondName.toLowerCase().includes(whatWeSearch.toLowerCase()) ||
        oneName.crime.toLowerCase().includes(whatWeSearch.toLowerCase()) ||
        oneName.id.toLowerCase().includes(whatWeSearch.toLowerCase())
    })

    document.querySelector('.list-names').innerHTML = ''

    ourResults.forEach(function(oneName){
        document.querySelector('.list-names').appendChild(generateHTMLstructure(oneName))
    })
})
