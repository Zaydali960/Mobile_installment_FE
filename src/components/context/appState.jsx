import React from 'react'
import AppContext from './appContext'
import { useState, useEffect  } from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppState = (props) => {
    const [helloworld, setHelloworld] = useState("Helloworld")
const [products, setProducts] = useState([])
const [product, setProduct] = useState(null);
const [notify, setNotify] = useState(false);
const [pdfData, setPdfdata] = useState(false);





  const [formData, setFormData] = useState({
    wholesalerName: "",
    productName: "",
    productDescription: "",
    productType: "",
    productImg: "",
    mobileIMEI1: "",
    mobileIMEI2: "",
    wholesalePrice: "",
  });


const loggedIn = async (username, password)=> {
  try {
    const response = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

 

    const data = await response.json(); // { authToken: "..." }
    console.log("Auth Token:", data.authToken);

    // Store token in localStorage/sessionStorage if needed
    // localStorage.setItem("authToken", data.authToken);

    return data;
  } catch (err) {
    console.error("Error during login:", err.message);
    // alert("Login failed: " + err.message);
  }
}

const getProducts = async () => {
    try {
        const response = await fetch("http://localhost:8000/api/product/get-product/");
        const data = await response.json(); // assuming your API returns JSON
            console.log("📦 API response:", data); 
        setProducts(data); // save all products
        
        
    } catch (err) {
        console.error(err);
    }
};
useEffect(() => {
  getProducts()
}, [])


const createTransaction = async (transactionObject) => {
   

    try {
        const response = await fetch("http://localhost:8000/api/transaction/create-transaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(transactionObject)
        });

        const data = await response.json();

        if (data.success) {
            console.log("Transaction created:", data.transaction);
            // alert("Transaction created successfully!");
        } else {
            console.error("Error creating transaction:", data.message);
            alert("Failed to create transaction: " + data.message);
        }
    } catch (err) {
        console.error("Server error:", err);
        alert("Server error: " + err.message);
    }
};


const handleCreateProduct = async (formData) => {
  try {
    const res = await fetch("http://localhost:8000/api/product/create-products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("📦 Create Product Response:", data); // 👈 check actual backend response

    if (data.success) {
    //   alert("✅ Product created successfully!");
      setFormData({
        wholesalerName: "",
        productName: "",
        productDescription: "",
        productType: "",
        productImg: "",
        mobileIMEI1: "",
        mobileIMEI2: "",
        wholesalePrice: "",
      });
    } else {
      alert("❌ Failed: " + (data.message || "Unknown error")); // fallback if message missing
    }
  } catch (err) {
    console.error("Error creating product:", err);
    alert("Server error: " + err.message);
  }
};


   const fetchProduct = async (id) => {
  try {
    const res = await fetch(`http://localhost:8000/api/product/getproductbyid/${id}`);
    if (!res.ok) throw new Error("Failed to fetch product");
    
    const data = await res.json();
    setProduct(data);
    return data; // return so caller (UpdateProducts) can use it
  } catch (err) {
    console.error("Error fetching product:", err);
  }
};



const updateProduct = async (id, updatedData) => {
  try {
    const res = await fetch(`http://localhost:8000/api/product/update-product/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to update product");
    }

    console.log("Product updated:", data);
    return data; // contains { message, product }
  } catch (err) {
    console.error("Error updating product:", err.message);
    throw err;
  }
};



// inside AppContext (or wherever you keep your API functions)
const deleteProduct = async (id) => {
  try {
    const res = await fetch(`http://localhost:8000/api/product/deleted-product/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("authToken"), // if you use JWT auth
      },
    });

    const data = await res.json();
    setNotify(true)
    
    if (!res.ok) {
      throw new Error(data.error || "Failed to delete product");
    }

    return { success: true, message: data.message };

  } catch (err) {
    console.error("Delete product error:", err.message);
    return { success: false, error: err.message };
  }
};



// In AppContext or a service file
const getTransactions = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/transaction/get-transactions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    console.log(data.transactions)
    if (data.success) {
      return data.transactions; // ✅ return array of transactions
    } else {
      console.error("Failed to fetch transactions:", data.message);
      return [];
    }
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return [];
  }
};


// Get transaction by ID
const getTransactionById = async (id) => {
  try {
    const res = await fetch(`http://localhost:8000/api/transaction/get-transaction/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data, "dn")
    setPdfdata(data.transaction)
    if (data.success) {
      return data.transaction; // ✅ return the transaction object
    } else {
      console.error("Error fetching transaction:", data.message);
      return null;
    }
  } catch (err) {
    console.error("Error fetching transaction:", err);
    return null;
  }
};

const updateTransaction = async (id, updatedData) => {
  try {
    const res = await fetch(`http://localhost:8000/api/transaction/update-transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to update transaction");
    }

    return data; // { success: true, transaction: {...} }
  } catch (error) {
    console.error("Error updating transaction:", error);
    return { success: false, message: error.message };
  }
};


 const deleteTransaction = async (id) => {
  try {
    const res = await fetch(`http://localhost:8000/api/transaction/delete-transactions/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to delete transaction");
    }

    return data; // { success: true, message: "Transactions deleted successfully" }
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, message: error.message };
  }
};

    
    return (
        <AppContext.Provider value={{helloworld,pdfData,getTransactions, deleteTransaction,updateTransaction,getTransactionById, formData,notify,setNotify, setFormData,updateProduct , deleteProduct,fetchProduct, product,handleCreateProduct, loggedIn, products, getProducts, products, createTransaction}}>
            {props.children}
        </AppContext.Provider>
    )
}


export default AppState