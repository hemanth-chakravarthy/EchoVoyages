import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AgenciesTable = ({ agencies }) => {
  const now = new Date();
  const agentsLast24Hours = agencies.filter((user) => {
    const agentCreatedAt = new Date(user.createdAt);
    return now - agentCreatedAt < 24 * 60 * 60 * 1000;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-white rounded-2xl shadow-xl max-w-7xl mx-auto"
    >
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-10 p-6 bg-gradient-to-r from-[#4169E1] to-[#1a365d] rounded-xl text-white shadow-lg"
      >
        <h2 className="text-3xl font-bold flex items-center justify-between">
          Recent Agents
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold bg-white/10 px-6 py-2 rounded-full"
          >
            {agentsLast24Hours.length}
          </motion.span>
        </h2>
      </motion.div>

      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-[#1a365d] to-[#00072D] text-white">
            <tr>
              <th className="px-8 py-5 text-left font-bold text-lg">No</th>
              <th className="px-8 py-5 text-left font-bold text-lg">Name</th>
              <th className="px-8 py-5 text-left font-bold text-lg">Email</th>
              <th className="px-8 py-5 text-left font-bold text-lg">Phone</th>
              <th className="px-8 py-5 text-left font-bold text-lg">Specialization</th>
              <th className="px-8 py-5 text-left font-bold text-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agencies.map((agency, index) => (
              <motion.tr 
                key={agency._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors duration-200"
              >
                <td className="px-8 py-6 text-[#2d3748] font-medium">{index + 1}</td>
                <td className="px-8 py-6 font-semibold text-[#1a365d]">{agency.name}</td>
                <td className="px-8 py-6 text-[#2d3748]">{agency.contactInfo?.email || "N/A"}</td>
                <td className="px-8 py-6 text-[#2d3748]">{agency.contactInfo?.phone || "N/A"}</td>
                <td className="px-8 py-6">
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-[#4169E1]/10 text-[#4169E1] border border-[#4169E1]/20">
                    {agency.specialization}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-row items-center gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link 
                        className="px-5 py-2.5 bg-[#4169E1] text-white text-sm font-medium rounded-full hover:bg-[#1a365d] transition-all duration-300 shadow-md hover:shadow-lg"
                        to={`/admin/agency/${agency._id}`}
                      >
                        View
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link 
                        className="px-5 py-2.5 bg-[#00072D] text-white text-sm font-medium rounded-full hover:bg-[#1a365d] transition-all duration-300 shadow-md hover:shadow-lg"
                        to={`/admin/agency/edit/${agency._id}`}
                      >
                        Edit
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link 
                        className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-full hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                        to={`/admin/agency/delete/${agency._id}`}
                      >
                        Delete
                      </Link>
                    </motion.div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AgenciesTable;