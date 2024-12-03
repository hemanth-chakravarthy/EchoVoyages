import React from "react";
import { Link } from "react-router-dom";

const GuidesTable = ({ guides }) => {
  const now = new Date();
  const guidesLast24Hours = guides.filter((user) => {
    const guideCreatedAt = new Date(user.createdAt);
    return now - guideCreatedAt < 24 * 60 * 60 * 1000;
  });

  return (
    <div>
      <div className="m-4 text-xl">
        Guides added in the last 24 hours: {guidesLast24Hours.length}
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Experience</th>
              <th>Email</th>
              <th>Languages</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {guides.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.experience}</td>
                <td>{user.contact?.email || "N/A"}</td>
                <td>{user.languages}</td>
                <td>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link 
                      className="btn btn-neutral btn-xs" 
                      to={`/admin/guides/${user._id}`}
                    >
                      Show
                    </Link>
                    <Link 
                      className="btn btn-dark btn-xs" 
                      to={`/admin/guides/edit/${user._id}`}
                    >
                      Update
                    </Link>
                    <Link 
                      className="btn btn-error btn-xs" 
                      to={`/admin/guides/delete/${user._id}`}
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

export default GuidesTable;