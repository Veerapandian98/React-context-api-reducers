import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from './../dummy-products.js';

export const CartContext = createContext({
    items: [],
    addToCart: () => {},
    updateCartQuantity: () => {}
});

function shoppingCartReducer(state, action) {
    if (action.type === 'ADD_Cart') {
        const updatedItems = [...state.items];
        const existingCartItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.id === action.payload
        );
        const existingCartItem = updatedItems[existingCartItemIndex];
    
        if (existingCartItem) {
            const updatedItem = {
            ...existingCartItem,
            quantity: existingCartItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
            updatedItems.push({
            id: action.payload,
            name: product.title,
            price: product.price,
            quantity: 1,
            });
        }
    
        return {
            ...state,
            items: updatedItems,
        };
    }

    if (action.type === 'UPDATE_Cart') {
        const updatedItems = [...state.items];
        const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id === action.payload.productId
        );
    
        const updatedItem = {
            ...updatedItems[updatedItemIndex],
        };
    
        updatedItem.quantity += action.payload.amount;
    
        if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
        } else {
            updatedItems[updatedItemIndex] = updatedItem;
        }
    
        return {
            ...state,
            items: updatedItems,
        };
    }
    return state;
}

export default function CartContextProvider({children}) {
    const [shoppingCartState, shoppingCartDispatch] = useReducer(shoppingCartReducer, {
        items: [],
    })
    
      function handleAddItemToCart(id) {
        shoppingCartDispatch({
            type: 'ADD_Cart',
            payload: id
        });
      }
    
      function handleUpdateCartItemQuantity(productId, amount) {
        shoppingCartDispatch({
            type: 'UPDATE_Cart',
            payload: {
                productId,
                amount
            }
        });
      }
    
      const ctxValue = {
        items: shoppingCartState.items,
        addToCart: handleAddItemToCart,
        updateCartQuantity: handleUpdateCartItemQuantity
      }

      return (
        <CartContext.Provider value={ctxValue}>
            {children}
        </CartContext.Provider>
      )
}