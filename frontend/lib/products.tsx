export async function getAllProducts() {
    const res = await fetch('http://localhost:5000/products/')
    return await res.json()
}

export async function getAllProductIds() {
    const res = await fetch('http://localhost:5000/products/')
    const data = await res.json()
    console.log(data)
    return data['products'].map((p) => {return {params: {id: p.id.toString()}}})
}

export async function getProduct(id) {
    const res = await fetch(`http://localhost:5000/products/${id}`)
    const data = await res.json()
    console.log(data)
    return data['product']
}
