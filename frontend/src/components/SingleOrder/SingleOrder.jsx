import React from "react";
import "./singleorder.css"

const SingleOrder = () => {
  return (
    <>
      <section class="status">
        <div class="single_container">
          <div class="status-box w-full lg:w-2/3 mx-auto">
            <div class="flex items-center justify-between mb-12">
              <h1 class="text-xl font-bold">Track delivery status</h1>
              <h6 class="bg-white py-1 rounded-full px-4 text-green-600 text-xs">
                Order Id
              </h6>
              <input id="hiddenInput" type="hidden" value="" />
            </div>
            <ul>
              <li
                class="status_line text-sm md:text-xl pb-16 step-completed"
                data-status="order_placed"
              >
                <span>Order Placed</span>
              </li>
              <li
                class="status_line text-sm md:text-xl pb-16 current"
                data-status="confirmed"
              >
                <span>Order confirmation</span>
              </li>
              <li
                class="status_line text-sm md:text-xl pb-16"
                data-status="prepared"
              >
                <span>Preparation</span>
              </li>
              <li
                class="status_line text-sm md:text-xl pb-16"
                data-status="delivered"
              >
                <span>Out for delivery </span>
              </li>
              <li
                class="status_line text-sm md:text-xl"
                data-status="completed"
              >
                <span>Complete</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleOrder;
