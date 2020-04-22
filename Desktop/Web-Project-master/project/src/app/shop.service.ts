import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from "rxjs";
import { catchError, map, tap, filter } from 'rxjs/operators';

import { Category } from "./categories/category";
import { Product } from "./products/product";
import { CATEGORIES } from "./categories/category-detail/mock-categories";
import { ALL_PRODUCTS } from "./products/mock-products";
import { CART_PRODUCTS } from "./cart/cart-products";

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  products:Product[] = ALL_PRODUCTS;
  categories:Category[] = CATEGORIES;
  cartProducts:Product[] = CART_PRODUCTS;
  private categoriesUrl = 'api/categories';
  private productsUrl = 'api/products';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
  ) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl)
      .pipe(
        catchError(this.handleError<Product[]>('getProducts', []))
      );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl)
      .pipe(
        catchError(this.handleError<Category[]>('getCategories', []))
      );
  }
  
  getProductsByCategoryId(categoryId: number): Observable<Category> {
    const url =  `${this.categoriesUrl}/${categoryId}`
    return this.http.get<Category>(url).pipe(
      catchError(this.handleError<Category>(`getProductsByCategoryId id=${categoryId}`))
    );
  }

  getProductsByCategoryIdFromAllProducts(categoryId: number): Observable<Product[]> {
    const tempProducts = this.http.get<Product[]>(this.productsUrl)
      .pipe(
        map(products => products.filter(p => p.categoryId === categoryId)),
        catchError(this.handleError<Product[]>('getProducts', []))
      );
    return tempProducts;
  }

  getProductById(productId: number): Observable<Product> {
    const url = `${this.productsUrl}/${productId}`;
    return this.http.get<Product>(url).pipe(
      catchError(this.handleError<Product>(`getProductById id=${productId}`))
    );
  }

  deleteProduct (product: Product | number): Observable<Product> {
    const id = typeof product === 'number' ? product : product.id;
    const url = `${this.productsUrl}/${id}`;
  
    return this.http.delete<Product>(url, this.httpOptions).pipe(
      catchError(this.handleError<Product>('deleteProduct'))
    );
  }
  updateProduct (product: Product): Observable<Product> {
    return this.http.put(this.productsUrl, product, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateProduct'))
    );
  }

  getCartProducts() {
    return of(this.cartProducts);
  }

  deleteCartProduct(id: number) {
    this.cartProducts = this.cartProducts.filter(product => product.id !== id);
    return of(this.cartProducts);
  }

  addCartProduct(product:Product) {
    return of(this.cartProducts.push(product));
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }

}
