import React from "react";
import { Link } from "react-router-dom";

const AgenciesTable = ({ agencies }) => {
  const now = new Date();
  const agentsLast24Hours = agencies.filter((user) => {
    const agentCreatedAt = new Date(user.createdAt);
    return now - agentCreatedAt < 24 * 60 * 60 * 1000;
  });

  return (
    <div>
      <div className="m-4 text-xl">
        Agents added in the last 24 hours: {agentsLast24Hours.length}
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Specialization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agencies.map((agency, index) => (
              <tr key={agency._id}>
                <td>{index + 1}</td>
                <td>{agency.name}</td>
                <td>{agency.contactInfo?.email || "N/A"}</td>
                <td>{agency.contactInfo?.phone || "N/A"}</td>
                <td>{agency.specialization}</td>
                <td>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link 
                      className="btn btn-neutral btn-xs" 
                      to={`/admin/agency/${agency._id}`}
                    >
                      Show
                    </Link>
                    <Link 
                      className="btn btn-dark btn-xs" 
                      to={`/admin/agency/edit/${agency._id}`}
                    >
                      Update
                    </Link>
                    <Link 
                      className="btn btn-error btn-xs" 
                      to={`/admin/agency/delete/${agency._id}`}
                    >
                      Delete
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgenciesTable;