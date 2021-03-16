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

class OrderService {

    constuctor(){

    }

    processOrder(object){     
        object.forEach(data => {
            let report = productService.getProduct(data.id)
            const {id,name,type,idSection,quantity} = report
            if (report){
                var model = {
                    id,
                    name,
                    type,
                    idSection,
                    quantity
                }
                model.quantity = model.quantity - data.quantity
                productService.editProduct(model)
            }
        })
    }

}

const orderService = new OrderService()

class HintItem {

    constructor(){

    }

    listeners(){
        const component = this.currentComponent
        const btnClose = component.querySelector('.hint-item-close-btn')
        btnClose.addEventListener('click',(e)=>{
            // od stuff
            component.remove()
            e.preventDefault()
        })
        setTimeout(()=>{component.remove()},2000)
    }

    getTemplate(){
        let div = document.createElement('div')
        div.classList.add('hint-item')
        const {status,msg} = this.data
        let template = `
            <div class = ${status} >
                <p>${msg}</p><button class = "hint-item-close-btn" >close</button>
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

    setData(data){
        this.data = data
    }
}
class Hint {

    constructor(HintItemClass){
        this.hintItemClass = HintItemClass;
    }

    listeners(){

    }

    updateComponent(queue){
        
        let hints = contextState(HINT_CONTEXT).hints
        hints = []
        hints.push(queue)
        this.render(document.getElementById('hint'))
        const container = document.getElementById('hint-items')
        container.innerHTML = ''
        queue.forEach(data => {
            let component = new this.hintItemClass()
            component.setData(data)
            component.render(container)
        })        

    }

    getTemplate(){
        let div = document.createElement('div')
        let template = `
            <div id = "hint-items" ></div>
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
const ORDER_CONTEXT = 'ORDER_CONTEXT'

var HintState = {
    hints : []
}
var OrderState = {
    currentOrder : {
        products : []
    },
    getProduct : function(id){
        return this.currentOrder.products.find(data => data.id === id)
    },
    idInProductsOrder : function(id){
        if (this.currentOrder.products.find(data => data.id === id)) return true
        else return false
    },
    removeProductToOrder : function(id){
        let newArr = this.currentOrder.products.filter(data => data.id !== id )
        this.currentOrder.products = newArr
        console.log(this.currentOrder.products);
    },
    editProduct : function(object){
        let newArr = this.currentOrder.products.map(data => {
            if (data.id === object.id){
                return object
            }else{
                return data
            }
        })
        this.currentOrder.products = newArr
    }
}

const contextState = (context) => {
    switch(context){
        case HINT_CONTEXT :
            return HintState
        case ORDER_CONTEXT :
            return OrderState
    }
}


class OrderItem {
    
    constructor(){
        this.state = {
            id: '',
            quantity : 1,
            component : ''
        }
    }

    listeners(){

        const component = this.currentComponent
        const quantitySpan = component.querySelector('.quantity-order-item')

        let context = contextState(ORDER_CONTEXT)

        const btnSum = component.querySelector('.order-item-btn-sum')
        btnSum.addEventListener('click',(e)=>{  
            this.state.quantity++;
            context.editProduct(this.state)
            quantitySpan.innerText = this.state.quantity
            e.preventDefault()
        })

        const btnSub = component.querySelector('.order-item-btn-sub')
        btnSub.addEventListener('click',(e)=>{
            if (this.state.quantity === 1) return
            this.state.quantity--
            context.editProduct(this.state)

            quantitySpan.innerText = this.state.quantity
            e.preventDefault()
        })

    }

    getTemplate(){
        let div = document.createElement('div')
        div.classList.add('order-item')
        const {id} = this.data
        let report = productService.getProduct(id)
        const {name,idSection} = report
        let template = `
            <div>
                <h4>${name}</h4>
                <small>${idSection}</small>
                <div>
                    <button class = "order-item-btn-sub">sub</button>
                    <span class = "quantity-order-item">1</span>
                    <button class = "order-item-btn-sum" >sum</button>
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

    setData(data){
        this.state.id = data.id
        this.state.component = data.component
        this.data = data
    }

}
class PurchaseOrderModal {
    
    constructor(ItemClass){
        this.ItemClass = ItemClass
    }

    listeners(){

        const component = this.currentComponent

        const removeBlur = () => {
            const content = document.getElementById('content-dash')
            content.style.filter = 'blur(0)'
        }

        const restartBtn = () => {
            const actionsRowProduct = document.querySelectorAll('.row-products-actions')
            actionsRowProduct.forEach(actions => {
                let btnAdd = actions.querySelector('.btn-add-to-order')
                if (btnAdd.classList.contains('btn-add-to-order-added')){
                    btnAdd.classList.toggle('btn-add-to-order-added')
                }
            })
        }

        const closeModal = () => {
            const modalContainer = document.getElementById('modal')
            if (component.classList.contains('modal-open')) {
                component.classList.toggle('modal-open')
                component.classList.add('modal-close')
                modalContainer.classList.remove('container-modal-activate')
            }
        }

        const btnProcess = document.getElementById('btn-process-order')
        btnProcess.addEventListener('click',(e)=>{

            let context = contextState(ORDER_CONTEXT)
            
            context.currentOrder.products.forEach(data => {
                let report = productService.getProduct(data.id)
                let forUpdate = context.getProduct(data.id)
                report.quantity = report.quantity - forUpdate.quantity
                productService.editProduct(report)
                data.component.updateComponent(report)
            })
            
            this.hint.updateComponent([{ status: 'success', msg: ` order processed` }])

            let products = contextState(ORDER_CONTEXT).currentOrder
            products.products = []

            removeBlur()
            closeModal()
            restartBtn()
            e.preventDefault()
        })
        const btnCancel = document.getElementById('btn-cancel-order')
        btnCancel.addEventListener('click',(e)=>{
            removeBlur()
            closeModal()
            e.preventDefault()
        })
    }

    getTemplate(){
        let div = document.createElement('div')
        div.classList.add('form-order-process')
        div.classList.add('modal-close')
        let template = `
            <h3>Order</h3>
            <div id = "container-items-order"></div>
            <button type = "button" id ="btn-process-order" >proccess</button>
            <button type = "button" id ="btn-cancel-order" >cancel</button>

        `
        div.innerHTML = template
        this.currentComponent = div
        return div
    }

    updateOrderItems(){
        const containerItems = document.getElementById('container-items-order')
        let context = contextState(ORDER_CONTEXT).currentOrder
        containerItems.innerHTML = ''
        context.products.forEach(data => {
            let component = new this.ItemClass()
            component.setData(data)
            component.render(containerItems)
        })
    }

    render(container){
        let component = this.getTemplate()
        container.append(component)
        this.listeners()    
    }

    setHint(hint){
        this.hint = hint
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

    setHint(hint){
        this.hint = hint
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

            this.hint.updateComponent([{ status: 'success', msg: `object : ${object.name} edited successfully` }])

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

    setHint(hint){
        this.hint = hint
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
            component.setHint(hint) // hint is out of my class
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

            this.hint.updateComponent([{status : 'success',msg : `object : ${object.name} created successfully`}])

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

    setHint(hint){
        this.hint = hint
    }

    listeners(){

        let component = this.currentComponent
        const {id,name} = this.data

        const blur = () => {
            const content = document.getElementById('content-dash')
            content.style.filter = 'blur(1px)'
        }

        const btnAdd = component.querySelector('.btn-add-to-order')
        btnAdd.addEventListener('click',(e)=>{

            let context = contextState(ORDER_CONTEXT)

            if (context.idInProductsOrder(id)){
                component.querySelector('.btn-add-to-order').classList.remove('btn-add-to-order-added')
                context.removeProductToOrder(id)
                this.hint.updateComponent([{ status: 'success', msg: `object : ${name} removed to order` }])
                return 
            }

            context.currentOrder.products.push({id,quantity : 1,component : this})

            component.querySelector('.btn-add-to-order').classList.add('btn-add-to-order-added')
            this.hint.updateComponent([{ status: 'success', msg: `object : ${name} added to order` }])

            e.preventDefault()
        })

        const btnRemove = component.querySelector('.btn-remove-product')
        btnRemove.addEventListener('click',(e)=>{
            let response = productService.deleteProduct(id)
            console.log('is product deleted correctly : ', response);
            component.remove(id)
            this.hint.updateComponent([{ status: 'success', msg: `object : ${this.data.name} removed successfully` }])
            e.preventDefault()
        })

        const btnEdit = component.querySelector('.btn-edit-product')
        btnEdit.addEventListener('click',(e)=>{

            document.forms['form-edit-product']['edit-input-product-name'].focus()

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
                    <button class = "btn-add-to-order" >add</button>
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
            component.setHint(hint)// hint declared outside
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

const hint = new Hint(HintItem)

const modalEdit = new ModalEdit()
modalEdit.setHint(hint)
const modalCreate = new ModalCreateProduct()
modalCreate.setHint(hint)
modalCreate.setComponentRowClass(ProductRow)
const modalOrder = new PurchaseOrderModal(OrderItem)
modalOrder.setHint(hint)

class Dashboard {
    
    constructor(){
        
    }

    listeners(){

        const btnCreate = document.getElementById('dashboard-btn-create-product')
        btnCreate.addEventListener('click',(e)=>{

            document.forms['form-create-product']['create-input-product-name'].focus()

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

        const btnGenerateOrder = document.getElementById('dashboard-btn-generate-order')
        btnGenerateOrder.addEventListener('click',(e)=>{

            const blur = () => {
                const content = document.getElementById('content-dash')
                content.style.filter = 'blur(1px)'
            }

            blur()

            const modalContainer = document.getElementById('modal')
            modalContainer.classList.add('container-modal-activate')
            
            const modalOrder_ = document.querySelector('.form-order-process')
            if (modalOrder_.classList.contains('modal-close')) {
                modalOrder_.classList.remove('modal-close')
                modalOrder_.classList.add('modal-open')
            }

            modalOrder.updateOrderItems()

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
                    <button id = "dashboard-btn-generate-order" > generate order </button>
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
        modalOrder.render(modalContainer)
        modalCreate.render(modalContainer)
        modalEdit.render(modalContainer)
        const hintContainer = document.getElementById('hint')
        hint.render(hintContainer)
    }

}

const app = () => {
    const mainContainer = document.getElementById('root')
    const tableProduct = new TableProduct()
    const dashboard = new Dashboard(tableProduct)
    dashboard.render(mainContainer)
}

app()