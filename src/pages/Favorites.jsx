import React from "react";
import Index from "../components/card";
import AppContext from "../context";

function Favorites() {
    const {favorites, onAddToFavorite } = React.useContext(AppContext)

    return (
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>Мои закладки</h1>
            </div>

            <div className="d-flex flex-wrap">
                {favorites.map((item, index)  => (
                        <Index
                            id={item.id}
                            key={index}
                            title={item.title}
                            favorited={true}
                            onFavorite={onAddToFavorite}
                               {...item}
                        />
                    ))}
            </div>
        </div>
    )
}

export default Favorites;