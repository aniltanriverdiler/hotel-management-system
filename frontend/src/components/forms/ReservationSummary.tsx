import React from "react";
import HotelInfoCard from "../booking/HotelInfoCard";
import ReservationDetailsCard from "../booking/ReservationDetailsCard";
import PaymentSummaryCard from "../booking/PaymentSummaryCard";

function ReservationSummary() {
  return (
    <div className="flex flex-col gap-5">
      <HotelInfoCard />
      <ReservationDetailsCard />
      <PaymentSummaryCard />
    </div>
  );
}

export default ReservationSummary;
