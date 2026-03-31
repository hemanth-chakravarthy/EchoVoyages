import { Link } from "react-router-dom";

const UsersTable = ({ users }) => {
  const now = new Date();

  const usersLast24Hours = users.filter((user) => {
    const userCreatedAt = new Date(user.createdAt);
    return now - userCreatedAt < 24 * 60 * 60 * 1000;
  });

  return (
    <div>
      <div className="mb-6 px-1">
        <span className="text-xs font-bold tracking-[0.2em] text-black/40 uppercase">
          Users added in the last 24 hours: {usersLast24Hours.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#1a1a1a] text-white">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">No</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">UserName</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Phone Number</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Gmail</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {users.map((user, index) => (
              <tr key={user._id} className="border-b border-black/5 hover:bg-black/5 transition-colors">
                <td className="px-4 py-4 text-sm font-semibold text-black/60">{index + 1}</td>
                <td className="px-4 py-4 text-sm font-medium text-[#1a1a1a]">{user.Name}</td>
                <td className="px-4 py-4 text-sm text-black/70">{user.username}</td>
                <td className="px-4 py-4 text-sm text-black/70">{user.phno}</td>
                <td className="px-4 py-4 text-sm text-black/70">{user.gmail}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link 
                      className="px-3 py-1 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2d2d2d] transition-all" 
                      to={`/admin/customers/${user._id}`}
                    >
                      Show
                    </Link>
                    <Link 
                      className="px-3 py-1 bg-[#4a4a4a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#5a5a5a] transition-all" 
                      to={`/admin/customers/edit/${user._id}`}
                    >
                      Update
                    </Link>
                    <Link 
                      className="px-3 py-1 bg-[#dc2626] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#b91c1c] transition-all" 
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