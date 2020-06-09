// formulário
function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then( resp => resp.json() )
        .then( states => {
            for( const state of states ) {
                ufSelect.innerHTML += 
                    `<option value="${state.id}">${state.nome}</option>`
            }
        } )
}

populateUFs()

function getCities(event) {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value

    // pegar o numero do Estado
    const indexOFSelectedState = event.target.selectedIndex
    
    // vai sempre atualizar ao mudar o Estado
    stateInput.value = event.target.options[indexOFSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true
    
    fetch(url)
        .then( resp => resp.json() )
        .then( cities => {
            for( const city of cities ) {
                citySelect.innerHTML += 
                `<option value="${city.nome}">${city.nome}</option>`
            }

            citySelect.disabled = false;
        } )
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

// itens
const itemsToCollect = document.querySelectorAll(".items-grid li")

for(const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)
}

let selectedItems = []
const collectedItems = document.querySelector("input[name=items]")

function handleSelectedItem(event) {
    const itemLi = event.target
    // console.log('ITEM ID: ', itemId)
    
    // toggle = identifica e adiciona ou remove uma classe
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id

    // função anônima que retorna se achou ou não os itens e se sim pegar os itens
    const alreadySelected = selectedItems.findIndex( item => {
        const itemFound = item === itemId
        return itemFound
    })

    // se estiver selecionado, if = tirar da seleção; else = adicionar na seleção
    if( alreadySelected != -1 ) {
        const filteredItems = selectedItems.filter( item => {
            const itemIsDiferent = item != itemId
            return itemIsDiferent
        })

        selectedItems = filteredItems
    } else {
        selectedItems.push(itemId)
    }

    // console.log('selectedItems: ', itemId)

    // atualizar o campo escondido
    collectedItems.value = selectedItems
}