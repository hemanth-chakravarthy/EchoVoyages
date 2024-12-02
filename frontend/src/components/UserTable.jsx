import React from "react";
import { Link } from "react-router-dom";

const UsersTable = ({ users }) => {
  const now = new Date();

  const usersLast24Hours = users.filter((user) => {
    const userCreatedAt = new Date(user.createdAt);
    return now - userCreatedAt < 24 * 60 * 60 * 1000;
  });

  return (
    <div>
      <div className="m-4 text-xl">
        Users added in the last 24 hours: {usersLast24Hours.length}
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>UserName</th>
              <th>Phone Number</th>
              <th>Gmail</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.Name}</td>
                <td>{user.username}</td>
                <td>{user.phno}</td>
                <td>{user.gmail}</td>
                <td>
                  <div className="linksPacks">
                    <Link className="links" to={`/admin/customers/${user._id}`}>
                      Show
                    </Link>
                    <Link
                      className="links"
                      to={`/admin/customers/edit/${user._id}`}
                    >
                      Update
                    </Link>
                    <Link
                      className="links"
                      to={`/admin/customers/delete/${user._id}`}
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

export default UsersTable;
