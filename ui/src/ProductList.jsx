/* eslint-disable react/destructuring-assignment */
/* eslint "react/jsx-no-undef": "off" */

import React from 'react';
import { Panel } from 'react-bootstrap';
import ProductTable from './ProductTable.jsx';
import ProductAdd from './ProductAdd.jsx';
// import { Label } from 'react-bootstrap';

export default class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  componentDidMount() {
    console.log('Hello');
    this.loadData();
  }

  async deleteProduct(index) {
    const query = `mutation productDelete($id: Int!){
      productDelete(id: $id)
    }`;
    const { products } = this.state;
    const { id } = products[index];
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id } }),
    });
    const result = await response.json();
    console.log(result);

    if (result && result.data && result.data.productDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.products];
        console.log(newList);
        newList.splice(index, 1);
        return { products: newList };
      });
    } else {
      this.loadData();
    }
  }

  async loadData() {
    const query = `query {
              productList {
                  id
                  category
                  productName
                  price 
                  image
              }
          }`;

    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const result = await response.json();
    console.log(result);
    this.setState({ products: result.data.productList });
  }

  async createProduct(product) {
    const query = `mutation productAdd($product: ProductInputs!) {
              productAdd(product: $product) {
                  id
              }
          }`;

    await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ query, variables: { product } }),
    });
    this.loadData();
  }

  render() {
    return (
      <React.Fragment>
        {/* <h1><Label>My Company Inventory</Label></h1> */}
        <Panel>
          <Panel.Heading>
            <Panel.Title toggle>Inventory</Panel.Title>
          </Panel.Heading>
          {/* <Panel.Body collapsible>
            <Product />
          </Panel.Body> */}
        </Panel>
        <h2>Showing all available products</h2>
        <hr />
        <br />
        <ProductTable products={this.state.products} deleteProduct={this.deleteProduct} />
        <hr />
        <h2>Add a new product to inventory</h2>
        <hr />
        <br />
        <ProductAdd createProduct={this.createProduct} />
      </React.Fragment>

    );
  }
}
