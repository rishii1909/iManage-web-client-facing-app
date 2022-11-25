import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { secure_axios, handle_error } from "./../../helpers/auth";
import { useRouter } from "next/router";
import CheckoutForm from "./CheckoutForm";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.STRIPE_PK_KEY);

export default function MakePayment() {
  const [clientSecret, setClientSecret] = useState("");
  const router = useRouter();
  const appearance = { theme: "stripe" };
  const options = { clientSecret, appearance };

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    console.log(router.query);
    secure_axios(
      `/plans/create-payment-intent`,
      router.query,
      router,
      (response) => {
        if (response.accomplished) {
          if (response.accomplished) {
            setClientSecret(response.response.clientSecret);
            }else
            handle_error(response);

        } else {
          handle_error(response);
        }
      }
    );
  }, []);

  return (
    <div className="App">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm  queryParams={router.query}/>
        </Elements>
      )}
    </div>
  );
}
