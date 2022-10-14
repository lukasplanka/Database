// nacitanie dat z localStorage do premennej names
// ak je localStorage prazdne, do names sa ulozi prazdne pole
const getSavedNames = () => {
    const myNames = localStorage.getItem('names')

    if (myNames !== null){
        return JSON.parse(myNames)
    } else {
        return []
    }
}
let names = getSavedNames()

// ukladanie do localStorage z inputov
const saveNames = (oneName) => {
    localStorage.setItem('names', JSON.stringify(oneName))
}

// odoslanie formulara a ulozenie do localStorage
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

// generovanie HTML struktury po kliknuti
// vypisanie novych mien po vymazani
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

    // nastavenie mazacieho tlacitka
    button.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Vymazať osobu`
    newParagraph.appendChild(button)

    button.addEventListener('click', () => {
        removeNames(names, oneName.id)
        saveNames(names)
        toListAgain()
    })

    return newDiv
}

// vypisovanie na stranku
let buttonToList = document.querySelector('.to-list')
buttonToList.addEventListener('click', () => {

    if (localStorage.getItem('names') == null){
        alert('Databáza je prázdna.')
    } else {
        // vycisti div
        document.querySelector('.list-names').innerHTML = ''
        
        let namesFromStorage = localStorage.getItem('names')
        let namesFromStorageJSON = JSON.parse(namesFromStorage)

        namesFromStorageJSON.forEach((myName) => {
            const oneNameHTML = generateHTMLstructure(myName)
            document.querySelector('.list-names').appendChild(oneNameHTML)
        })
    }
})

// podla id najdeme meno a odstranime
const removeNames = (ourNames, id) => {
    const index = ourNames.findIndex((nameWantToCheck) => {
        return nameWantToCheck.id === id
    })

    // -1 preto lebo ak to nenajde vrati to -1 inak to vrati nejaky index mena
    if (index > -1){
        ourNames.splice(index, 1)
    }
}

// znovu vypisanie localStorage ked sa uzivatel zmaze
const toListAgain = () => {
    document.querySelector('.list-names').innerHTML = ''

    let newData = getSavedNames()

    newData.forEach((onlyOneName) => {
        const newContent = generateHTMLstructure(onlyOneName)
        document.querySelector('.list-names').appendChild(newContent)
    });
}

// filtrovanie
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
