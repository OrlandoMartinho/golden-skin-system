async function fetchCartItems(accessToken, idCart) {
    try {
        console.log("Requesting cart items from:", `${api_host}/api/cart-products/${idCart}`);
        console.log("Access token:", accessToken);

        const response = await fetch(`${api_host}/api/cart-products`, {
            headers: { 'token': accessToken }
        });

        console.log("Response status:", response.status);

        const data = await response.json();
        console.log("Response data:", data);

        if (response.ok && Array.isArray(data)) {
            return { status: response.status, data: data };
        } else {
            console.warn("Error fetching cart items:", response.status, data.message);
            return { status: response.status, error: data };
        }
    } catch (error) {
        console.error("Error in fetchCartItems:", error.message, error.stack);
        return { status: 500, error: { message: "Internal server error" } };
    }
}

async function registerAnyCartItem(accessToken, cartItemData) {
    try {
        const { idProduct } = cartItemData;

        // Basic validation to match the expected schema
        if (!Number.isInteger(idProduct) || idProduct <= 0) {
            throw new Error("ID Product must be a positive integer");
        }

        const url = `${api_host}/api/cart-products/register`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': accessToken
            },
            body: JSON.stringify({ idProduct })
        });

        const result = await response.json();

        if (response.ok) {
            return { status: response.status, data: result };
        } else {
            console.warn("Error registering cart item:", response.status, result.message);
            return { status: response.status, error: result };
        }
    } catch (error) {
        console.error("Error in registerCartItem:", error.message, error.stack);
        return { status: 500, error: { message: error.message || "Internal server error" } };
    }
}

async function deleteCartItem(accessToken, idCart, idProduct) {
    try {
        const url = `${api_host}/api/cart-products`;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': accessToken
            },
            body: JSON.stringify({ idCart, idProduct })
        });

        const result = await response.json();

        if (response.ok) {
            return { status: response.status, data: result };
        } else {
            console.warn("Error deleting cart item:", response.status, result.message);
            return { status: response.status, error: result };
        }
    } catch (error) {
        console.error("Error in deleteCartItem:", error.message, error.stack);
        return { status: 500, error: { message: "Internal server error" } };
    }
}

async function getProduct(accessToken, idProduct) {
    try {
        console.log("Fetching product with idProduct:", idProduct);
        const url = `${api_host}/api/products/${Number(idProduct)}`; // Assuming a products endpoint

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': accessToken
            }
        });

        const result = await response.json();

        if (response.ok) {
            return { status: response.status, data: result };
        } else {
            console.warn("Error getting product:", response.status, result.message);
            return { status: response.status, error: result };
        }
    } catch (error) {
        console.error("Error in getProduct:", error.message, error.stack);
        return { status: 500, error: { message: "Internal server error" } };
    }
}