import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";
import { useRef } from "react";



axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext=createContext();


export const AppContextProvider=({children})=>{
    const initialCartSync = useRef(true);
    const currency=import.meta.env.VITE_CURRENCY;
    // const currency="Rs"

    const navigate=useNavigate();
    const [user,setUser]=useState(null);
    const [isSeller,setisSeller]=useState(false);
    const [showUserLogin,setshowUserLogin]=useState(false);
    const [products,setproducts]=useState([]);

    const [cardItems,setcardItems]=useState({})

    const [searchQuery,setsearchQuery]=useState('')


    // Fetch Seller Status
    const fetchSeller = async()=>{
        try {
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success)
            {
                setisSeller(true);
            }
            else{
                setisSeller(false);
            }
        } catch (error) {
            setisSeller(false);
        }
    }

    // Fetch User Status , Cart Items
    const fetchUser = async () => {
    try {
        const { data } = await axios.get('/api/user/is-auth');

        if (data.success) {
            setUser(data.user);

            // ✅ Safely fallback to empty object if cartItems is undefined
            setcardItems(data.user.cartItems || {});
        }
        } catch (error) {
            setUser(null);
            setcardItems({}); // ✅ Clear cart on failed fetch
        }
    };


    //Fetch Data
    const fetchProducts =async()=>{
        try {
            const {data} = await axios.get('/api/product/list')
            if(data.success)
            {
                setproducts(data.products);
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //Add to Cart implemetation
    const addToCard = (itemId) => {
    let cartData = { ...cardItems };
    if (cartData[itemId]) {
        cartData[itemId] += 1;
    } else {
        cartData[itemId] = 1;
    }
    setcardItems(cartData);
    toast.success("Added to Cart");
};


    //Update Cart implementation
    const updateCardItem=(itemId,quantity)=>{
        let cardData=structuredClone(cardItems);
        cardData[itemId]=quantity;
        setcardItems(cardData)
        toast.success("Cart Updated");
    }

    //Remove Cart implementation
    const removeCardItem=(itemId)=>{
        let cardData=structuredClone(cardItems);
        if(cardData[itemId])
        {
            cardData[itemId]-=1;
            if(cardData[itemId]==0)
            {
                delete cardData[itemId];
            }
        }
        toast.success("Remove from Cart");
        setcardItems(cardData);


    }


    const getCartCount=()=>{
        let total=0;
        for(const item in cardItems)
        {
            total+=cardItems[item];
        }
        return total;
    }

    const getCartAmount=()=>{
        let totalamount=0;
        for(const item in cardItems)
        {
            let iteminfo=products.find((product)=>product._id===item)
            if(cardItems[item]>0)
            {
                totalamount+=iteminfo.offerprice * cardItems[item]

            }
        }
        return Math.floor(totalamount*100)/100;
    }

    useEffect(() => {
    if (initialCartSync.current) return;

    const updateCart = async () => {
        if (!user || !user._id || !cardItems) return;

        try {
            const { data } = await axios.post('/api/cart/update', { cardItems });
            if (!data.success) toast.error(data.message);
        } catch (error) {
            toast.error("Update cart error: " + error.message);
        }
    };

            updateCart();
        }, [cardItems]);

        // 🟩 Sync `initialCartSync` to start only AFTER login fetch
        useEffect(() => {
            if (user) {
                initialCartSync.current = false; // ✅ Start syncing only now
            }
        }, [user]);



    useEffect(()=>{
        fetchProducts()
        fetchSeller()
        fetchUser()
    },[])

    const value={axios,navigate,user,setUser,setisSeller,isSeller,showUserLogin,
        setshowUserLogin,products,getCartCount,currency,addToCard,removeCardItem,
        cardItems,updateCardItem,searchQuery,setsearchQuery,getCartAmount,fetchProducts,
        setcardItems,fetchUser}


    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}


export const useAppContext=()=>{
    return useContext(AppContext)
}