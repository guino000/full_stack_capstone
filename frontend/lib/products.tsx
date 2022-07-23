import axios from "axios";

export type Picture = {
  id: number,
  product_id: number,
  url: string
}

export type Product = {
  id: number,
  name: string,
  description: string,
  pictures: Picture[],
  size: string,
  cost: number
}

export type ProductUpdate = {
  name?: string,
  description?: string,
  pictures?: Picture[],
  size?: string,
  cost?: number
}

export type ProductCreate = {
  name: string,
  description?: string,
  pictures?: string[],
  size?: string,
  cost?: number
}

export type IDParam = {
  params: { id: string }
}

export class ProductApiClient {
  token: string
  authHeader: string
  baseUrl: string

  constructor(token: string) {
    this.token = token
    this.authHeader = `Bearer ${token}`
    this.baseUrl = 'http://localhost:5000'
  }

  async getAllProducts(): Promise<Product[]> {
    const res = await axios.get(`${this.baseUrl}/products/`)
    return res.data.products
  }

  async getProduct(id: string): Promise<Product[]> {
    const res = await axios.get(`${this.baseUrl}/products/${id}`)
    return res.data['product']
  }

  async deleteProduct(id: string): Promise<number> {
    const res = await axios.delete(`${this.baseUrl}/products/${id}`, {
      headers: {
        Authorization: this.authHeader
      }
    })

    return res.status
  }

  async updateProduct(id: string, data: ProductUpdate): Promise<number> {
    const res = await axios.patch(`${this.baseUrl}/products/${id}`, data, {
      headers: {
        Authorization: this.authHeader
      }
    })

    return res.status
  }

  async createProduct(data: ProductCreate): Promise<number> {
    try {
      const res = await axios.post(`${this.baseUrl}/products/`, data, {
        headers: {
          Authorization: this.authHeader
        }
      })

      return res.status
    } catch (e) {
      return 500
    }
  }

}
