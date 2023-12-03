import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { createStore } from 'redux'

import App from './app/app';
import { Provider } from 'react-redux';
import axios from 'axios';
import { IStock, IStockGraph } from './app/interfaces/stock';

const defaultState = {
  stock : GetData()
}

async function GetData() {
    const response = await axios.post<IStockGraph[]>('http://localhost:4200/api/stock/', {input: ''})

    for(let i = 0; i < response.data.length; i++){ 
        response.data[i].data = await axios.post('http://localhost:4200/api/stock/graph/', {input: response.data[i].symbol})
        response.data[i].data = response.data[i].data.data.data 
    }
    return response.data
}

const reducer = (state: any = defaultState, action: any) => {
    switch(action.type){
        default:
          return state
    }
} 

const store = createStore(reducer)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>
);
