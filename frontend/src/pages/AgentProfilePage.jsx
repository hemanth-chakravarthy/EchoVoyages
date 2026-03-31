/** @format */

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  FaEdit,
  FaSignOutAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaChartBar,
  FaSave,
  FaTimes,
  FaCalendar,
  FaDollarSign,
  FaChartLine,
  FaCamera,
  FaMapMarkerAlt
} from "react-icons/fa";
import apiUrl from "../utils/api.js";
import { motion, AnimatePresence } from "framer-motion";

const AgentProfilePage = () => {
  const [bookingsData, setBookingsData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [editing, setEditing] = useState(false);
  const [agent, setAgent] = useState({ contactInfo: {} });
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const id = token ? jwtDecode(token).id : null;

  const specializations = ["luxury", "adventure", "business", "family", "other"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Agent Details
        const agentRes = await axios.get(`${apiUrl}/agency/${id}`);
        setAgent(agentRes.data);
        if (agentRes.data.profileImage) {
          setPreviewImage(agentRes.data.profileImage.startsWith("http") 
            ? agentRes.data.profileImage 
            : `${apiUrl}/${agentRes.data.profileImage}`);
        }

        // Fetch Packages and Booking Counts
        const packagesRes = await axios.get(`${apiUrl}/packages/agents/${id}`);
        const packagesWithCounts = await Promise.all(
          packagesRes.data.map(async (pkg) => {
            const bRes = await axios.get(`${apiUrl}/bookings/pack/${pkg._id}`);
            return { 
              name: pkg.name, 
              count: bRes.data.length,
              price: pkg.price,
              revenue: bRes.data.length * pkg.price
            };
          })
        );
        setBookingsData(packagesRes.data);
        setChartData(packagesWithCounts);
      } catch (error) {
        toast.error("Resource synchronization failure");
        console.error(error);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("contactInfo.")) {
      const field = name.split(".")[1];
      setAgent(prev => ({
        ...prev,
        contactInfo: { ...prev.contactInfo, [field]: value }
      }));
    } else {
      setAgent(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      Object.keys(agent).forEach(key => {
        if (key !== "contactInfo" && key !== "profileImage" && key !== "travelPackages") {
          formData.append(key, agent[key]);
        }
      });
      formData.append("contactInfo.phone", agent.contactInfo?.phone || "");
      formData.append("contactInfo.email", agent.contactInfo?.email || "");
      if (profileImage) formData.append("profileImage", profileImage);

      await axios.put(`${apiUrl}/agency/${id}`, formData);
      toast.success("Profile records updated");
      setEditing(false);
    } catch (error) {
      toast.error("Update sequence failed");
    }
  };

  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalBookings = chartData.reduce((sum, item) => sum + item.count, 0);

  const neutralColors = ["#1a1a1a", "#4b5563", "#9ca3af", "#d1d5db"];

  return (
    <div className="min-h-screen bg-[#f5f3f0] py-12 px-4 md:px-8">
      {/* ── PROFILE HEADER ── */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-white border border-black/5 p-10 flex flex-col md:flex-row items-center gap-12">
          <div className="relative group">
            <div className="w-40 h-40 bg-[#f5f3f0] border border-black/5 overflow-hidden">
               {previewImage ? (
                  <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center"><FaUser className="text-4xl text-black/10" /></div>
               )}
            </div>
            {editing && (
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <FaCamera className="text-white text-xl" />
                <input type="file" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-black/40 mb-3">
              001 / Agent Directory
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#1a1a1a] uppercase mb-6">
              {agent.name || "UNIDENTIFIED AGENT"}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-8 text-[11px] font-bold uppercase tracking-widest text-black/40">
               <span className="flex items-center gap-2"><FaEnvelope className="text-black/10" /> {agent.contactInfo?.email}</span>
               <span className="flex items-center gap-2"><FaPhone className="text-black/10" /> {agent.contactInfo?.phone}</span>
               <span className="flex items-center gap-2"><FaBriefcase className="text-black/10" /> {agent.specialization}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 min-w-[200px]">
            {!editing ? (
              <button 
                onClick={() => setEditing(true)}
                className="w-full py-4 bg-[#1a1a1a] text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#333] transition-all"
              >
                Modify Records
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleUpdate} className="flex-1 py-4 bg-[#1a1a1a] text-white text-[10px] font-black uppercase tracking-[0.2em]">Save</button>
                <button onClick={() => setEditing(false)} className="flex-1 py-4 border border-black/10 text-[10px] font-black uppercase tracking-[0.2em]">Cancel</button>
              </div>
            )}
            <button 
              onClick={() => { localStorage.removeItem("token"); navigate("/"); }}
              className="w-full py-2 text-[10px] font-black uppercase tracking-[0.2em] text-black/20 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
            >
              <FaSignOutAlt /> Terminate Session
            </button>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex gap-12 border-b border-black/5">
          {["overview", "performance", "records"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all border-b-2 ${
                activeTab === tab ? "border-[#1a1a1a] text-[#1a1a1a]" : "border-transparent text-black/20 hover:text-black/40"
              }`}
            >
              {tab === "overview" ? "002 / Overview" : tab === "performance" ? "003 / Analytics" : "004 / Specifications"}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
               {[
                 { label: "Aggregate Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: <FaDollarSign /> },
                 { label: "Booking Transactions", value: totalBookings, icon: <FaCalendar /> },
                 { label: "Active Listings", value: bookingsData.length, icon: <FaBriefcase /> }
               ].map((stat, i) => (
                 <div key={i} className="bg-white border border-black/5 p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 text-[#1a1a1a]/5 text-5xl group-hover:scale-110 transition-transform">{stat.icon}</div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-2">{stat.label}</p>
                    <p className="text-3xl font-black tracking-tighter text-[#1a1a1a]">{stat.value}</p>
                 </div>
               ))}
            </div>

            <div className="bg-white border border-black/5 p-12">
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-black/20 mb-12">Portfolio Distribution / Volume</h3>
               <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} dataKey="count" stroke="none">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={neutralColors[index % neutralColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #1a1a1a10", fontSize: "10px", fontWeight: "black", textTransform: "uppercase" }}
                      />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "9px", fontWeight: "black", textTransform: "uppercase", tracking: "0.2em", paddingTop: "20px"}} />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === "performance" && (
          <motion.div key="performance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-7xl mx-auto">
             <div className="bg-white border border-black/5 p-12">
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-black/20 mb-12">Commercial Performance Index</h3>
               <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1a1a10" />
                      <XAxis dataKey="name" stroke="#1a1a1a30" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#1a1a1a30" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{fill: '#f5f3f0'}} contentStyle={{ border: "1px solid #1a1a1a10", fontSize: "10px" }} />
                      <Bar dataKey="revenue" fill="#1a1a1a" barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
             </div>
          </motion.div>
        )}

        {activeTab === "records" && (
          <motion.div key="records" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-7xl mx-auto">
            <div className="bg-white border border-black/5 p-12">
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-black/20 mb-12">Administrative Data Points</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-12">
                  {[
                    { id: "name", label: "Legal Entity Name", value: agent.name },
                    { id: "username", label: "Unique Directory ID", value: agent.username },
                    { id: "contactInfo.email", label: "Official Communication Link", value: agent.contactInfo?.email },
                    { id: "contactInfo.phone", label: "Operational Telemetrics", value: agent.contactInfo?.phone },
                    { id: "specialization", label: "Commercial Focus", value: agent.specialization, type: "select" }
                  ].map((field) => (
                    <div key={field.id} className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">{field.label}</label>
                      {editing ? (
                        field.type === "select" ? (
                          <select name={field.id} value={agent.specialization} onChange={handleChange} className="w-full p-4 bg-[#f5f3f0] border-none text-xs font-bold uppercase tracking-widest outline-none">
                            {specializations.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                          </select>
                        ) : (
                          <input type="text" name={field.id} value={field.id.includes('.') ? agent.contactInfo[field.id.split('.')[1]] : agent[field.id]} onChange={handleChange} className="w-full p-4 bg-[#f5f3f0] border-none text-xs font-bold uppercase tracking-widest outline-none" />
                        )
                      ) : (
                        <p className="text-sm font-bold text-[#1a1a1a] pb-4 border-b border-black/5 uppercase tracking-wider">{field.value || "NOT DOCUMENTED"}</p>
                      )}
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-20"></div>
    </div>
  );
};

export default AgentProfilePage;
