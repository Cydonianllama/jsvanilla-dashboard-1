const products = [
    {
        id : 'product-1',
        name : 'papaya',
        type : 'fruta',
        idSection : 'a06-001',
        quantity : 500
    },
    {
        id: 'product-2',
        name: 'fresa',
        type: 'fruta',
        idSection: 'a06-002',
        quantity: 600
    },
    {
        id: 'product-3',
        name: 'platano',
        type: 'fruta',
        idSection: 'a06-003',
        quantity: 900
    },
    {
        id: 'product-4',
        name: 'uva',
        type: 'fruta',
        idSection: 'a06-004',
        quantity: 655
    },
    {
        id: 'product-5',
        name: 'lima',
        type: 'fruta',
        idSection: 'a06-005',
        quantity: 1500
    },
    {
        id: 'product-6',
        name: 'maracuya',
        type: 'fruta',
        idSection: 'a06-005',
        quantity: 545
    },
    {
        id: 'product-7',
        name: 'chirimoya',
        type: 'fruta',
        idSection: 'a06-001',
        quantity: 1220
    }
]

const generateId = (function(){
    let counter = 150;
    let partialId = 'product-'
    return () => {
        counter++
        let id = partialId + counter.toString()
        return id
    }
})