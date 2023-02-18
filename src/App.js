import React from "react";
import {Route} from "react-router-dom";
import axios from "axios";
import './App.css';
import Header from "./components/Header";
import Index from "./components/drawer";
import AppContext from "./context";

import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Orders from "./pages/Orders";


function App() {
    const [items, setItems] = React.useState([])
    const [cartItems, setCartItems] = React.useState([])
    const [favorites, setFavorites] = React.useState([])
    const [searchValue, setSearchValue] = React.useState("")
    const [cartOpened, setCartOpened] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);


    const FetchData = async () => {
        try {
            const [cards, favorites, data] = await Promise.all([
            axios.get('https://63ce8fccfdfe2764c725afef.mockapi.io/cart'),
            axios.get('https://63e0decc59bb472a742aae1c.mockapi.io/favorite'),
            axios.get('https://63ce8fccfdfe2764c725afef.mockapi.io/items'),

        ]);
            setIsLoading(false)

            setCartItems(cards.data)
            setFavorites(favorites.data)
            setItems(data.data)
        } catch (error) {
            alert( 'Ошибка при запросе данных')
        }

    }
    React.useEffect( () => {
      FetchData()
    }, []);

    const onAddToCart = async (obj) => {
        try {
            const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id))
            if (findItem) {
                setCartItems((prev) => prev.filter((item) => Number(item.parentId) !== Number(obj.id)))
                await axios.delete(`https://63ce8fccfdfe2764c725afef.mockapi.io/cart/${findItem.id}`)
            } else {
                setCartItems((prev) => [ ...prev, obj]);
                const {data} = await axios.post('https://63ce8fccfdfe2764c725afef.mockapi.io/cart', obj);
                setCartItems((prev) => prev.map(item => {
                    if (item.parentId === data.parentId) {
                        return {
                            ...item,
                            id: data.id
                        };
                    }
                    return item;
                }));

            }
        } catch (error) {
            alert('Ошибка при добавлении корзину');
            console.error(error);

        }
    };

    const onRemoveItem = async (id) => {
        try {
            setCartItems(prev => prev.filter((item) => Number(item.id) !== Number(id)));
            await axios.delete(`https://63ce8fccfdfe2764c725afef.mockapi.io/cart/${id}`)
        } catch (error) {
            alert('Ошибка при удалении из корзины');
            console.error(error)
        }
    }

    const onAddToFavorite = async (obj) => {
        try {
            if (favorites.find(favObj => Number(favObj.id) === Number(obj.id))) {
                await axios.delete(`https://63e0decc59bb472a742aae1c.mockapi.io/favorite/${obj.id}`);
                setFavorites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)))


            } else {
                const { data } = await axios.post('https://63e0decc59bb472a742aae1c.mockapi.io/favorite', obj)

                setFavorites((prev) => [...prev, data]);
            }
        } catch (error) {
            alert("Error")
        }
    };

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    }

    const isItemAdded = (id) => {
        return cartItems.some((obj) => Number(obj.parentId) === Number(id));

    }

  return (
      <AppContext.Provider value={{ items, cartItems, favorites, isItemAdded, onAddToFavorite, onAddToCart, setCartOpened, setCartItems }}>
          <div className="wrapper clear">
              <Index items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem} opened={cartOpened}/>


              <Header onClickCart={() => {
                  setCartOpened(true)
              }} />
              <Route path="/" exact>
                  <Home
                      cartItems={cartItems}
                      items={items}
                      searchValue={searchValue}
                      setSearchValue={setSearchValue}
                      onChangeSearchInput={onChangeSearchInput}
                      onAddToFavorite={onAddToFavorite}
                      onAddToCart={onAddToCart}
                      isLoading={isLoading}
                  />
              </Route>
              <Route path="/favorites" exact>
                  <Favorites />
              </Route>

              <Route path="/orders" exact>
                  <Orders />
              </Route>
          </div>
      </AppContext.Provider>
  );
}

export default App;
