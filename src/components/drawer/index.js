import React from 'react';
import axios from "axios";

import Info from "../info";
import { useCart } from '../../hooks/useCart'

import styles from './drawer.module.scss';

const delay = () => new Promise((resolve) => setTimeout(resolve, 1000))

const Index = ({ onClose, onRemove, items = [], opened }) => {
    const { cartItems,  setCartItems, totalPrice } = useCart();
    const [ orderId, setOrderId] = React.useState(null);
    const [ isOderComplete, setIsOderComplete] = React.useState(false);
    const [ isLoading, setIsLoading] = React.useState(false);



    const onClickOrder = async () => {
        try{
            setIsLoading(true)
            const {data} = await axios.post('https://63e0decc59bb472a742aae1c.mockapi.io/orders', {
                items: cartItems
            });
            setOrderId(data.id)
            setIsOderComplete(true)
            setCartItems([]);

            for (let i = 0; i < cartItems.length; i++) {
                const item = cartItems[i];
                    await axios.delete('https://63ce8fccfdfe2764c725afef.mockapi.io/cart/' + item.id);
                    await delay();
            }
        }   catch (error) {
            alert("Не удалось создать заказ :(");
        }
        setIsLoading(false);
    }

    return (
        <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
        <div className={styles.drawer}>
            <h2 className="d-flex justify-between mb-30">
                Корзина<img onClick={onClose} className="cu-p"
                            src="/img/kres.svg" alt="Close"/></h2>

            {
                items.length > 0 ? (
                    <div className="d-flex flex-column flex">
                        <div className="items">
                            {items.map((obj) => (
                                    <div key={obj.id} className="cartItem d-flex align-center mb-20">
                                        <div
                                            style={{backgroundImage: `url(${obj.imageUrl})`}}
                                            className="cartItemImg"></div>
                                        <div className="mr-20 flex">
                                            <p className="mb-5">{obj.title}</p>
                                            <b>{obj.price} руб.</b>
                                        </div>
                                        <img onClick={() => onRemove(obj.id)} className="removeBtn" src="/img/kres.svg" alt="Remove"/>
                                    </div>
                                )
                            )}
                        </div>
                        <div className="cartTotalBlock">
                            <ul>
                                <li><span>Итого: </span>
                                    <div></div>
                                    <b>{totalPrice} руб.</b></li>
                                <li><span>Налог 5%: </span>
                                    <div></div>
                                    <b>{totalPrice / 100 * 5} руб. </b></li>
                            </ul>
                            <button disabled={isLoading} onClick={onClickOrder} className="greenButton">Оформить заказ <img src="/img/strelka.svg" alt="Stralka"/></button>
                        </div>
                    </div>
                    )
                    :
                        (
                            <Info title={isOderComplete ? "Заказ оформлен!" : "Корзина пустая"}
                                  description={isOderComplete ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке`
                                      : "Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ"}
                                  image={isOderComplete ? "/img/complete-order.jpg" : "/img/empty-cart.jpg"}
                            />
                        )}
        </div>
        </div>
    );
};

export default Index;