import React, { createContext, useReducer, useContext, useEffect } from "react";
import { ProductContext } from "./ContextProvider";

const initialFilterState = {
  filteredItems: [],
  allProducts: [],
  searchKey: ""
};

const filterItemsHandler = (allProducts, key) => {
  const filteredItems = allProducts.filter((product) => {
    return product.category === key;
  });

  return { filteredItems };
};

const filterReduce = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      return {...state, allProducts: action.payload, filteredItems: action.payload }
    }
    case "SEARCH_KEYWORD":
      state.searchKey = action.payload;
      return {
        ...state
      };
    case "ALL":
      state.filteredItems = [...state.allProducts];
      return {
        ...state
      };
    case "VEGETABLE":
      return {
        ...filterItemsHandler(state.allProducts, "سبزیجات")
      };
    case "FRUIT":
      return {
        ...filterItemsHandler(state.allProducts, "میوه جات")
      };
    case "NUTS":
      return {
        ...filterItemsHandler(state.allProducts, "خشکبار")
      };
    case "BEANS":
      return {
        ...filterItemsHandler(state.allProducts, "حبوبات")
      };
    default:
      return state;
  }
};

export const FilterContext = createContext();
export const FilterDispath = createContext();

export default function ContextFilter({ children }) {
  
  const [state, dispath] = useReducer(filterReduce, initialFilterState);
  const productContext = useContext(ProductContext);
  useEffect(()=> {
    console.log(productContext.state.allProducts)
    dispath({ type: 'INIT', payload: productContext.state.allProducts });
  }, [productContext]);
  
  console.log(state)
  return (
    <FilterContext.Provider value={{ state }}>
      <FilterDispath.Provider value={{ dispath }}>
        {children}
      </FilterDispath.Provider>
    </FilterContext.Provider>
  );
}
