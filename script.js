'use strict'

// --- DARK MODE ---
let darkmode = localStorage.getItem('darkmode')
const mudar = document.getElementById('mudar')

const modoescuro = () => {
    document.body.classList.add('darkmode')
    localStorage.setItem('darkmode', 'active')
}

const modoclaro = () => {
    document.body.classList.remove('darkmode')
    localStorage.setItem('darkmode', null)
}

if (darkmode === "active") modoescuro()

mudar.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode')
    darkmode !== "active" ? modoescuro() : modoclaro()
})

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_produto')) ?? []
const setLocalStorage = (dbProduto) => localStorage.setItem("db_produto", JSON.stringify(dbProduto))

const createProduto = (produto) => {
    const dbProduto = getLocalStorage()
    dbProduto.push(produto)
    setLocalStorage(dbProduto)
}

const readProduto = () => getLocalStorage()

const updateProduto = (index, produto) => {
    const dbProduto = readProduto()
    dbProduto[index] = produto
    setLocalStorage(dbProduto)
}

const deleteProduto = (index) => {
    const dbProduto = readProduto()
    dbProduto.splice(index, 1)
    setLocalStorage(dbProduto)
}

const validfields = () => {
    return document.getElementById('form').reportValidity()
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

const salveProduto = () => {
    if (validfields()) {
        const produto = {
            id: document.getElementById('id').value,
            nome: document.getElementById('nome').value,
            preco: document.getElementById("preco").value,
            estoque: document.getElementById('estoque').value
        }
        createProduto(produto)
        updateTable()
        closeModal()
    }
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableProduto>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const createRow = (produto, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${produto.id}</td>
        <td>${produto.nome}</td>
        <td>${produto.preco}</td>
        <td>${produto.estoque}</td>
        <td>
            <button type="button" id="edit-${index}">Editar</button>
            <button type="button" id="delete-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tableProduto>tbody').appendChild(newRow)
}

const updateTable = () => {
    const dbProduto = readProduto()
    clearTable()
    dbProduto.forEach(createRow)
}

const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
    document.getElementById('modal').classList.remove('active')
    clearFields()
}

const fillFields = (produto) => {
    document.getElementById('id').value = produto.id
    document.getElementById('nome').value = produto.nome
    document.getElementById('preco').value = produto.preco
    document.getElementById('estoque').value = produto.estoque
    document.getElementById('id').dataset.index = produto.index
}

const editProduto = (index) => {
    const produto = readProduto()[index]
    produto.index = index
    fillFields(produto)
    document.querySelector(".modal-header>h2").textContent  = `Editando ${produto.id}`
    openModal()

}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editProduto(index)
            deleteProduto(index)
            updateTable()
        } else {
            const produto = readProduto()[index]
            const response = confirm(`Deseja realmente excluir o produto ${produto.id}`)
            if (response) {
                deleteProduto(index)
                updateTable()
            }
        }
    }
}


updateTable()

document.getElementById('cadastrarProduto').addEventListener('click', openModal)
document.getElementById('modalClose').addEventListener('click', closeModal)
document.getElementById('salvar').addEventListener('click', salveProduto)
document.querySelector('#tableProduto>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)