import React, { useContext } from "react";
import "./Basket.css";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { ProductContext, ProductDispath } from "../Context/ContextProvider";
import BasketItem from "./BasketItem";
import Offer from "./Offer";
import OfferBadge from "./OfferBadge";
import SendProducts from "./SendProducts";

export default function Basket() {
  const { state } = useContext(ProductContext);
  const { dispath } = useContext(ProductDispath);
  return (
    <>
      <div className="favorite_container_linkBar">
        <div className="favorite_linkBar">
          <span>Bar</span>
          <Link className="favorite_backLink" to={"/"}>
            <HiArrowRight />
            Favourite
          </Link>
        </div>
        {state.basket.length > 0 && (
          <div className="favorite_linkBar">
            <div className="free_send_title">
              <img src="images/sound(1).jpg" alt="" />
              <span>
                send
              </span>
            </div>
          </div>
        )}
      </div>
      {state.basket.length > 0 ? (
        <div className="basket_container">
          <div className="basket_itemBox">
            {state.basket.map((product) => (
              <BasketItem key={product.id} {...product} />
            ))}
          </div>
          <div className="basket_priceBox">
            <OfferBadge />
            <div className="basket_price">
              <span>price</span>
              <span>|</span>
              <span>{state.totalPrice.toLocaleString()} تومان</span>
            </div>
            {state.totalPriceAfterOffer > 0 && (
              <div className="basket_offer">
                <span>Offer</span>
                <span>{state.totalPriceAfterOffer.toLocaleString()} تومان</span>
              </div>
            )}
            <Offer />
            <SendProducts />
            <div className="basket_send">
              <span>مجموع مبلغ قابل پرداخت</span>
              <span>{state.totalPriceFainal.toLocaleString()} تومان</span>
            </div>
            <button className="basket_button_buy">ادامه فرایند خرید</button>
            <button
              onClick={() => dispath({ type: "EMPTY_BASKET" })}
              className="basket_button_remove"
            >
              all {state.basket.length} will be removed
            </button>
          </div>
        </div>
      ) : (
        <div className="favorite_empty">
          <img
            className="favorite_empty_img"
            src="images/empty-cart.png"
            alt=""
          />
          <span className="favorite_empty_title">empty</span>
        </div>
      )}
    </>
  );
}
