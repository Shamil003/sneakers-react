import Index from "../components/card";
import React from "react";

function Home({
                  items,
                  searchValue,
                  setSearchValue,
                  onChangeSearchInput,
                  onAddToFavorite,
                  onAddToCart,
                  isLoading,
              }) {

    const renderItems = () => {
        const filtredItems = items.filter((item) =>
            item.title.toLowerCase().includes(searchValue.toLowerCase())
        );
        return (isLoading ? [...Array(10)] : filtredItems).map((item, index) => (
                <Index
                    key={index}
                    onFavorite = {(obj) => onAddToFavorite (obj)}
                    onPluss = {(obj) => onAddToCart(obj)}
                    loading={isLoading}
                    {...item}
                />
            ));
    }

    return (
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>{searchValue ? `Поиск по запросу: "${searchValue}"` : 'Все кроссовки'}</h1>
                <div className="search-block d-flex">
                    <img src="/img/search.svg" alt="Search"/>
                    {searchValue && <img onClick={() => setSearchValue('')}
                                         className="clear cu-p"
                                         src="/img/kres.svg"
                                         alt="Close"/>}
                    <input onChange={onChangeSearchInput} value={searchValue} placeholder="Поиск..."/>
                </div>
            </div>
            <div className="d-flex flex-wrap">
                {renderItems()}
            </div>
        </div>
    )
}

export default Home;