import { loadScript } from "https://cdn.jsdelivr.net/npm/@paypal/paypal-js@1.0.4/dist/paypal.esm.js";

loadScript({ "client-id": "YOUR_CLIENT_ID" })
.then((paypal) => {
    // start to use the PayPal JS SDK script
    console.log("PayPal SDK loaded:", paypal);
})
.catch((err) => {
    console.error("Failed to load the PayPal JS SDK script", err);
});