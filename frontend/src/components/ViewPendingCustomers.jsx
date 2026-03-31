/** @format */

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import apiUrl from "../utils/api.js";
import { FaUser, FaClock, FaCheckCircle, FaTimesCircle, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const ViewPendingCustomers = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const guideId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${apiUrl}/bookings/guides/${guideId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (guideId) {
      fetchBookings();
    }
  }, [guideId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-[#f5f3f0]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Synchronizing Records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 bg-white border border-black/5 text-center">
        <p className="text-xs font-black uppercase tracking-widest text-red-500">System Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f3f0] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mb-1">
              001 / Assignment Ledger
            </span>
            <h1 className="text-3xl font-black tracking-tighter text-[#1a1a1a] uppercase">
              Assigned Bookings
            </h1>
          </div>
          <div className="text-right">
             <span className="inline-block bg-[#1a1a1a] text-white text-[10px] font-black px-4 py-2 uppercase tracking-[0.2em]">
              {bookings.length} Current
            </span>
          </div>
        </div>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking, idx) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-black/5 p-8 flex flex-col md:flex-row md:items-center justify-between group hover:border-[#1a1a1a]/20 transition-all duration-300"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-[#f5f3f0] flex items-center justify-center border border-black/5 shrink-0">
                    <FaUser className="text-[#1a1a1a]/20 text-xl group-hover:text-[#1a1a1a] transition-colors" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-[#1a1a1a] uppercase mb-1">
                      {booking.customerName}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-black/40 flex items-center gap-2">
                        <span className="w-1 h-1 bg-black/20 rounded-full"></span>
                        ID: {booking.bookingId || booking._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#FFC107] flex items-center gap-2">
                        <span className="w-1 h-1 bg-[#FFC107] rounded-full"></span>
                        {booking.status}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 md:mt-0 flex items-center gap-6">
                  <Link 
                    to={`/bookings/${booking._id}`}
                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#1a1a1a] hover:opacity-50 transition-opacity"
                  >
                    Details <FaArrowRight className="text-[8px]" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-black/5 py-24 text-center">
            <p className="text-xs font-black uppercase tracking-[0.4em] text-black/20">
              Zero records found in assignment ledger
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPendingCustomers;
