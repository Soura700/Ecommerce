import React, { useState, useEffect } from "react";
import css from "./header.module.css";
import Logo from "../../assets/logo.png";
import { CgEnter, CgShoppingBag } from "react-icons/cg";
import { GoArrowDownRight } from "react-icons/go";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const Header = ({ value }) => {
  var count = 0;

  const activeCartProduct = value.filter(
    (slide) => slide.is_active === 1 && (count = count + 1)
  );

  const [ShowMenu, setShowMenu] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cookie, setCookie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeProducts, setActiveProducts] = useState([]);

  const [socket, setSocket] = useState(null); //For setting the socket connection



  const toggleMenu = () => {
    setShowMenu((ShowMenu) => !ShowMenu);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    async function fetchCartProducts() {
      try {
        const cookie = await fetch(
          "http://localhost:5000/api/auth/check-cookie",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const cookieData = await cookie.json();

        setCookie(cookieData);

        // const newData = data.map(product => {
        //   const imagesArray = JSON.parse(product.images);
        //   return {
        //     ...product,
        //     images: imagesArray
        //   };
        // });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchCartProducts();
    setActiveProducts(activeCartProduct);
  }, []);



  useEffect(() => {
    if (socket) {
      socket.on("create_cart", async ({ product_id, cartItemCount, user_id }) => {
        // Fetch the product details based on product_id
        const existingProductIndex = activeProducts.findIndex(
          (product) => product.p_id === product_id
        );
        if (existingProductIndex !== -1) {
          const updatedActiveProducts = [...activeProducts];
          updatedActiveProducts[existingProductIndex].total += cartItemCount;
          setActiveProducts(updatedActiveProducts);
        }
        else{
          try {
            const response = await fetch(`http://localhost:5000/api/product/singleProduct/${product_id}`);
            const productDetails = await response.json();

            const imagesArray = JSON.parse(productDetails[0].images);

            const newProduct = {
              p_id: product_id,
              productName: productDetails[0].name,
              totalPrice: productDetails[0].price,
              images:imagesArray,
              total: cartItemCount
            };
  
            // Update the state to include the new product
            setActiveProducts([...activeProducts, newProduct]);
          } catch (error) {
            console.error("Error fetching product details:", error);
          }
        }
      });
    }
    return () => {
      if (socket) {
        socket.off("create_cart");
      }
    };
  }, [socket]);



  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Define a function to fetch product details by ID
  const fetchProductDetails = async (user_id) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/cart/get/cart/" + user_id
      );
      const productDetails = await response.json();

      const newData = productDetails.map((product) => {
        const imagesArray = JSON.parse(product.images);
        return {
          ...product,
          images: imagesArray,
        };
      });

      // const imagesArray = JSON.parse(productDetails.images); // Parsing images to array
      // const processedProductDetails = {
      //   ...productDetails,
      //   images: imagesArray
      // };
      return newData;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching product details");
    }
  };

  // const handleKeyPress = (event) => {
  //   if (event.key === 'Enter') {
  //     handleSearch();
  //   }
  // };

  const handleKeyPress = async (event) => {
    if (event.key === "Enter") {
      try {
        const response = await fetch(
          `http://localhost:5000/api/product/search/${searchTerm}`
        );
        const suggestionsData = await response.json();
        setSuggestions(suggestionsData);
      } catch (error) {
        console.log("ERROR FETCHING DATA" + error);
      }
      // handleSearch();
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/product/search/${searchTerm}`
      );
      const searchData = await response.json();
      // Process the searchData as needed
      console.log(searchData);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  var totalCartItem = 0;
  var totalPrice = 0;

  // Calculating the total cart item
  for (var i = 0; i < value.length; i++) {
    totalCartItem = totalCartItem + value[i].total;
  }

  // Calculating the total
  for (var i = 0; i < value.length; i++) {
    console.log(typeof value[i].totalPrice);
    totalPrice = totalPrice + +value[i].totalPrice;
  }

  return (
    <div className={css.container}>
      <div className={css.logo}>
        <img src={Logo} alt="" />
        <span>amazon</span>
      </div>

      <div className={css.right}>
        <div className={css.bars} onClick={toggleMenu}>
          <GoArrowDownRight />
        </div>
        <ul
          className={css.menu}
          style={{ display: ShowMenu ? "inherit" : "none" }}
        >
          <li>Collections</li>
          <li>Brands</li>
          <li>New</li>
          <li>Sales</li>
          <li>ENG</li>
        </ul>

        <div className={css.searchContainer}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={css.search}
          ></input>

          {suggestions.length > 0 && (
            <div className={css.suggestion_box}>
              {suggestions.map((suggestion) => (
                <Link
                  key={suggestion.id}
                  to={`/singleProduct/${suggestion.p_id}/${suggestion.productName}`}
                >
                  <div key={suggestion.id}>{suggestion.productName}</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <CgShoppingBag className={css.cart} onClick={toggleSidebar} />
      </div>

      {/* <div className={`${css.sidebar} ${sidebarOpen ? css.sidebarOpen : ""}`}>
        <button className={css.closeButton} onClick={toggleSidebar}>
          <span>&times;</span>{" "}
        </button>
      </div> */}

      {/* <div className={`${css.sidebar} ${sidebarOpen ? css.sidebarOpen : ""}`}>
        <button className={css.closeButton} onClick={toggleSidebar}>
          <span>&times;</span>
        </button>
      </div> */}

      <div className={`${css.sidebar} ${sidebarOpen ? css.sidebarOpen : ""}`}>
        <div className={css.miniCart}>
          <div className={css.miniCartHead}>
            <span className={css.miniCartTitle}>Cart</span>
            <button className={css.miniCartClose} onClick={toggleSidebar}>
              <span>&times;</span>
            </button>
          </div>

          <div className={`${css.miniCartProductArea} ${css.ltn__scrollbar}`}>
            {/* {value.map((slide, i) => ( */}
            {count > 0 ? (
              activeProducts.map((slide, index) => {
                return (
                  <div className={`${css.miniCartItem} clearfix`}>
                    <div className={css.miniCartImg}>
                      <a href="#">
                        <img src={slide.images[0]} alt="Image" />
                      </a>
                      <span className={css.miniCartItemDelete}>
                        <i className={css.iconCancel}></i>
                      </span>
                    </div>
                    <div className={css.miniCartInfo}>
                      <h6>
                        <a href="#">{slide.productName}</a>
                      </h6>
                      <span className={css.miniCartQuantity}>
                        {slide.total} x ${slide.totalPrice}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <h5 style={{ textAlign: "center" }}>Cart Is Empty</h5>
            )}
          </div>


          {count > 0 ? (
            <div className={css.miniCartFooter}>
              <div className={css.miniCartSubTotal}>
                <h5>
                  Subtotal: <span>${totalPrice}</span>
                </h5>
              </div>
              <div className={css.btnWrapper}>
                <a
                  href="/cart"
                  className={`${css.themeBtn1} ${css.btn} ${css.btnEffect1}`}
                >
                  View Cart
                </a>
                <a
                  href={`checkout/${cookie}`}
                  className={`${css.themeBtn2} ${css.btn} ${css.btnEffect2}`}
                >
                  Checkout
                </a>
              </div>
              <p>Free Shipping on All Orders Over $100!</p>
            </div>
          ) : (
            ""
          )}

          {/*  */}
        </div>
      </div>
    </div>
  );
};

export default Header;
