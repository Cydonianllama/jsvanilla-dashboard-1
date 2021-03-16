class ProductRepo {

    constructor(data){
        this.data = data
    }

    find(id){
        if (!id){
            let report = this.data.slice(0,15)
            return report
        }else{
            let report = this.data.find(product => product.id === id)
            return report
        }
    }

    create(object){
        if(!object) return
        this.data.push(object)
    }

    update(object){
        if(!object) return
        let newArray = this.data.map(product => {
            if (product.id === object.id ){
                return object
            }else{
                return product
            }
        })        
        this.data = newArray
    }

    delete(id){
        if (!id) return 
        let newArr = this.data.filter(product => product.id !== id)
        this.data = newArr
        return true
    }
}

class ProductService {

    constructor(repo){
        this.repo = repo
    }
    
    createProduct(object){
        this.repo.create(object)
    }

    editProduct(object){
        this.repo.update(object)
    }

    deleteProduct(id){
        if (!id) return
        let response = this.repo.delete(id)
        if (response){
            return response
        }else{
            return false
        }
    }

    getProduct(id){
        let report = this.repo.find(id)
        return report
    }

    getProducts(){
        let report = this.repo.find()
        return report
    }

    getProductFromPage(number){

    }

}

const productService = new ProductService(new ProductRepo(products))

class Hint {

    constructor(){

    }

    listeners(){

    }

    getTemplate(){
        let div = document.createElement('div')
        let template = `
            <span>Hint still in development</span>
        `
        div.innerHTML = template
        return div
    }

    render(container){
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }

}

const HINT_CONTEXT = 'HINT_CONTEXT'

var HintState = {
    hints : []
}

const contextState = (context) => {
    switch(context){
        case HINT_CONTEXT :
            return HintState
    }
}

class ModalEdit {
    
    constructor(){
        this.dataCurrentRow={}
    }

    update(object){
        let id = object.data.id
        this.dataCurrentRow = productService.getProduct(id)
        this.currentComponent = object
        this.updateDataComponent()
    }

    listeners(){
        const component = this.currentComponent
        
        const closeModal = () => {
            const modalContainer = document.getElementById('modal')
            if (component.classList.contains('modal-open')) {
                component.classList.toggle('modal-open')
                component.classList.add('modal-close')
                modalContainer.classList.remove('container-modal-activate')
            }
        }

        const removeBlur = () => {
            const content = document.getElementById('content-dash')
            content.style.filter = 'blur(0)'
        }
        
        const btnEdit = document.getElementById('btn-modal-proccess-edit')
        btnEdit.addEventListener('click',(e)=>{

            let form = document.getElementById('form-edit-product')
            const formEdit = new FormData(form)
            const { id } = this.dataCurrentRow

            let object = {
                id,
                name: formEdit.get('edit-input-product-name'),
                type: formEdit.get('edit-select-type'),
                idSection: formEdit.get('edit-select-section'),
                quantity: parseInt(formEdit.get('edit-quantity'))
            }

            productService.editProduct(object)

            this.currentComponent.updateComponent(object)

            removeBlur()
            closeModal()
            e.preventDefault()

        })

        const btnCancel = document.getElementById('btn-edit-cancel')
        btnCancel.addEventListener('click',(e)=>{
            closeModal()
            removeBlur()
            e.preventDefault()
        })
    }

    getTemplate(){
        let div = document.createElement('div')
        div.classList.add('modal-edit')
        div.classList.add('modal-close')
        let template = `
            <h3>Edit product </h3>
            <form id = "form-edit-product" >
                <input name = "edit-input-product-name" type="text" placeholder="product name" />
                <select name = "edit-select-type" id="modal-create-select-type">
                    <option>select</option>
                    <option>fruta</option>
                    <option>verdura</option>
                    <option>abarrotes</option>
                </select>
                <select name = "edit-select-section" id="modal-create-select-section">
                    <option>select</option>
                    <option>a06-001</option>
                    <option>a06-002</option>
                    <option>a06-003</option>
                    <option>a06-004</option>
                    <option>a06-005</option>
                </select>
                <input type="number" name = "edit-quantity" placeholder="quantity" />
                <button type = "button" id="btn-modal-proccess-edit">edit product</button>
                <button type = "button" id = "btn-edit-cancel" >cancel</button>
            </form>
        `
        div.innerHTML = template
        this.currentComponent = div
        return div
    }

    updateDataComponent(){
        const {name,type,idSection,quantity} = this.dataCurrentRow
        const formEdit = document.forms['form-edit-product']
        formEdit['edit-input-product-name'].value = name
        formEdit['edit-select-type'].value = type
        formEdit['edit-select-section'].value = idSection
        formEdit['edit-quantity'].value = quantity.toString()
    }

    render(container){
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }

}

class ModalCreateProduct {

    constructor(){

    }

    listeners(){
        const component = this.currentComponent

        const formCreateProduct = document.forms['form-create-product']

        const closeModal = () => {
            const modalContainer = document.getElementById('modal')
            if (component.classList.contains('modal-open')) {
                component.classList.toggle('modal-open')
                component.classList.add('modal-close')
                modalContainer.classList.remove('container-modal-activate')
            }
        }

        const removeBlur = () =>{
            const content = document.getElementById('content-dash')
            content.style.filter = 'blur(0)'
        }

        const resetForm = () => {
            formCreateProduct.reset()
        }

        const isFormValid = () => {

            const valueInputProductName = formCreateProduct['create-input-product-name'].value
            const valueType = formCreateProduct['create-select-type'].value
            const valueSection = formCreateProduct['create-select-section'].value
            const quantityValue = formCreateProduct['create-quantity'].value
            
            let isValid = true

            let TypeSelected = valueType !== 'select' ? true : false
            if (!TypeSelected) isValid = false
            let SectionSelected = valueSection !== 'select' ? true : false
            if (!SectionSelected) isValid = false
            let quantityAdded = parseInt(quantityValue) > 0 ? true : false
            if (!quantityAdded) isValid = false
            let nameAdded = valueInputProductName !== '' ? true : false
            if (!nameAdded) isValid = false

            return isValid

        }

        const appendRowInTable = () => {
            const container = document.getElementById('table-product')
            let component = new this.componentClass()
            component.attach(modalEdit)
            component.setData(this.dataCreated)
            component.render(container)

        }

        const btnCreateProduct = document.getElementById('btn-create-product')
        btnCreateProduct.addEventListener('click',(e)=>{

            if (!isFormValid()) return

            const formCreate = new FormData(document.getElementById('form-create-product'))
            const object = {
                id: generateId()(),
                name: formCreate.get('create-input-product-name'),
                type: formCreate.get('create-select-type'),
                idSection: formCreate.get('create-select-section'),
                quantity: parseInt(formCreate.get('create-quantity'))
            }
            productService.createProduct(object)
            this.dataCreated = object

            resetForm()
            closeModal()
            removeBlur()
            appendRowInTable()

            e.preventDefault()
        })

        const btnCancel = document.getElementById('btn-create-cancel')
        btnCancel.addEventListener('click',(e)=>{
            closeModal()
            removeBlur()
            e.preventDefault()
        })

        
    }

    getTemplate(){
        let div = document.createElement('div')
        div.classList.add('modal-create-product')
        div.classList.add('modal-close')
        let template = `
            <h3>Create Product</h3>
            <form id = "form-create-product" >
                <input name = "create-input-product-name" type="text" placeholder="product name" />
                <select name = "create-select-type" id="modal-create-select-type">
                    <option>select</option>
                    <option>fruta</option>
                    <option>verdura</option>
                    <option>abarrotes</option>
                </select>
                <select name = "create-select-section" id="modal-create-select-section">
                    <option>select</option>
                    <option>a06-001</option>
                    <option>a06-002</option>
                    <option>a06-003</option>
                    <option>a06-004</option>
                    <option>a06-005</option>
                </select>
                <input name = "create-quantity" type="number" placeholder="quantity" />
                
                <button type = "button" id="btn-create-product">create product</button>
                <button type = "button" id = "btn-create-cancel" >cancel</button>
            </form>
        `
        div.innerHTML = template
        this.currentComponent = div
        return div
    }

    render(container){
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }

    setComponentRowClass(component) {
        this.componentClass = component
    }

}


class ProductRow {

    constructor(){
        this.observers=[]
    }

    attach(observer){
        this.observers.push(observer)
    }

    dettach(observer){
        let newArr = this.observers.filter(obs => obs === observer)
        this.observers = newArr
    }

    notify(){
        this.observers.forEach(observer => {
            observer.update(this)
        })
    }

    listeners(){

        let component = this.currentComponent
        const {id} = this.data

        const blur = () => {
            const content = document.getElementById('content-dash')
            content.style.filter = 'blur(1px)'
        }

        const btnRemove = component.querySelector('.btn-remove-product')
        btnRemove.addEventListener('click',(e)=>{
            let response = productService.deleteProduct(id)
            console.log('is product deleted correctly : ', response);
            component.remove(id)
            e.preventDefault()
        })

        const btnEdit = component.querySelector('.btn-edit-product')
        btnEdit.addEventListener('click',(e)=>{

            const modalEdit = document.querySelector('.modal-edit')
            const modalContainer = document.getElementById('modal')
            if (modalEdit.classList.contains('modal-close')){
                modalEdit.classList.toggle('modal-close')
                modalEdit.classList.add('modal-open')
                modalContainer.classList.add('container-modal-activate')
            }

            blur()
            this.notify()

            e.preventDefault()
        })

    }

    getTemplate(){

        let div = document.createElement('div')

        const {id,name,idSection,type,quantity} = this.data

        let template = `
            <div class = "row-product" data-id-product = ${id}>
                <div class ="row-data">
                    <div class="container-row-product-name">
                        <span class="row-product-name">${name}</span>
                    </div>
                    <div class="container-row-product-type">
                        <span class="row-product-type">${type}</span>
                    </div>
                    <div class="container-row-product-section">
                        <span class="row-product-section">${idSection}</span>
                    </div>
                    <div class="container-row-product-quantity">
                        <span class="row-product-quantity">${quantity}</span>
                    </div>
                </div>
                <div class = "row-products-actions">
                    <button class = "btn-edit-product" >edit</button>
                    <button class = "btn-remove-product" >remove</button>
                </div>
            </div>
        `
        div.innerHTML = template
        this.currentComponent = div
        return div
    }

    render(container){
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }

    updateComponent(object){
        const {name,type,idSection,quantity} = object
        let component = this.currentComponent
        let rowData = component.querySelector('.row-data')
        let newFragment = `
            <div class="container-row-product-name">
                <span class="row-product-name">${name}</span>
            </div>
            <div class="container-row-product-type">
                <span class="row-product-type">${type}</span>
            </div>
            <div class="container-row-product-section">
                <span class="row-product-section">${idSection}</span>
            </div>
            <div class="container-row-product-quantity">
                <span class="row-product-quantity">${quantity}</span>
            </div>
        `
        rowData.innerHTML = newFragment
    }

    setData(data){
        this.data = data
    }

}

class TableProduct {

    constructor(){

    }

    listeners(){

    }

    getTemplate(){
        let div = document.createElement('div')
        div.classList.add('table-wrapper')
        let template = `
            <div class = "rw-container">
                <div class = "rw-1">name</div>
                <div class = "rw-2">type</div>
                <div class = "rw-3">section</div>
                <div class = "rw-4">quantity</div>
                <div class = "rw-5">actions</div>
            </div>
            <div id = "table-product"></div>
        `
        div.innerHTML = template
        return div
    }

    setComponentRow(componentClass){
        this.rowClass = componentClass
    }

    render(container){

        let component = this.getTemplate()
        container.append(component)
        let report = productService.getProducts()
        const containerTableProduct = document.getElementById('table-product')

        report.forEach(data => {
            let component = new this.rowClass()
            component.setData(data)
            component.render(containerTableProduct)
            component.attach(this.modalCreate)
        })

    }

    getModalCreate(modal){
        this.modalCreate = modal 
    }

}

const tableProduct = new TableProduct()
tableProduct.setComponentRow(ProductRow)

const modalEdit = new ModalEdit()
const modalCreate = new ModalCreateProduct()
modalCreate.setComponentRowClass(ProductRow)

const hint = new Hint()

class Dashboard {
    
    constructor(){
        
    }

    listeners(){
        const btnCreate = document.getElementById('dashboard-btn-create-product')
        
        btnCreate.addEventListener('click',(e)=>{

            const content = document.getElementById('content-dash')
            content.style.filter = 'blur(1px)'
            const modalContainer = document.getElementById('modal')
            modalContainer.classList.add('container-modal-activate')
            
            const modalCreate = document.querySelector('.modal-create-product')
            if (modalCreate.classList.contains('modal-close')){
                modalCreate.classList.remove('modal-close')
                modalCreate.classList.add('modal-open')
            } 
            e.preventDefault()
        })

    }

   getTemplate(){
        let div = document.createElement('div')
        div.classList.add('dashboard-container')
        let template = `
            <div id = "hint"></div>
            <div id = "modal"></div>
            <div id = "content-dash">
                <div class = "dashboard-actions-container">
                    <button id = "dashboard-btn-create-product" > create product </button>
                </div>
                <div id = "dashboard"><div>
            </div>
        `
        div.innerHTML = template
        return div
    }

    render(container){
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
        const containerDashboard = document.getElementById('dashboard')
        tableProduct.getModalCreate(modalEdit)
        tableProduct.render(containerDashboard)
        const modalContainer = document.getElementById('modal')
        modalEdit.render(modalContainer)
        modalCreate.render(modalContainer)
        const hintContainer = document.getElementById('hint')
        hint.render(hintContainer   )
    }

}

const app = () => {
    const mainContainer = document.getElementById('root')
    const tableProduct = new TableProduct()
    const dashboard = new Dashboard(tableProduct)
    dashboard.render(mainContainer)
}

app()