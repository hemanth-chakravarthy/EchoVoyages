/** @format */
import { Link } from "react-router-dom";

const AgenciesTable = ({ agencies }) => {
  const now = new Date();
  const agentsLast24Hours = agencies.filter((user) => {
    const agentCreatedAt = new Date(user.createdAt);
    return now - agentCreatedAt < 24 * 60 * 60 * 1000;
  });

  return (
    <div>
      <div className="m-4 text-xl text-white">
        Agents added in the last 24 hours: {agentsLast24Hours.length}
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra text-white w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3">No</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Specialization</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agencies.map((agency, index) => (
              <tr key={agency._id}>
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{agency.name}</td>
                <td className="p-3">{agency.contactInfo?.email || "N/A"}</td>
                <td className="p-3">{agency.contactInfo?.phone || "N/A"}</td>
                <td className="p-3">{agency.specialization}</td>
                <td className="p-3 flex flex-col sm:flex-row gap-2">
                  <Link
                    className="btn btn-neutral btn-xs"
                    to={`/admin/agency/${agency._id}`}
                  >
                    View
                  </Link>
                  <Link
                    className="btn btn-dark btn-xs"
                    to={`/admin/agency/edit/${agency._id}`}
                  >
                    Edit
                  </Link>
                  <Link
                    className="btn btn-error btn-xs"
                    to={`/admin/agency/delete/${agency._id}`}
                  >
                    Delete
                  </Link>
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
