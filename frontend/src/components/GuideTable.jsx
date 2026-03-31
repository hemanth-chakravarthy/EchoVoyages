import { Link } from "react-router-dom";

const GuidesTable = ({ guides }) => {
  const now = new Date();
  const guidesLast24Hours = guides.filter((user) => {
    const guideCreatedAt = new Date(user.createdAt);
    return now - guideCreatedAt < 24 * 60 * 60 * 1000;
  });

  return (
    <div>
      <div className="mb-6 px-1">
        <span className="text-xs font-bold tracking-[0.2em] text-black/40 uppercase">
          Guides added in the last 24 hours: {guidesLast24Hours.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#1a1a1a] text-white">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">No</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Experience</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Languages</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {guides.map((user, index) => (
              <tr key={user._id} className="border-b border-black/5 hover:bg-black/5 transition-colors">
                <td className="px-4 py-4 text-sm font-semibold text-black/60">{index + 1}</td>
                <td className="px-4 py-4 text-sm font-medium text-[#1a1a1a]">{user.name}</td>
                <td className="px-4 py-4 text-sm text-black/70">{user.experience}</td>
                <td className="px-4 py-4 text-sm text-black/70">{user.contact?.email || "N/A"}</td>
                <td className="px-4 py-4 text-sm text-black/70">{user.languages}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link 
                      className="px-3 py-1 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2d2d2d] transition-all" 
                      to={`/admin/guides/${user._id}`}
                    >
                      Show
                    </Link>
                    <Link 
                      className="px-3 py-1 bg-[#4a4a4a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#5a5a5a] transition-all" 
                      to={`/admin/guides/edit/${user._id}`}
                    >
                      Update
                    </Link>
                    <Link 
                      className="px-3 py-1 bg-[#dc2626] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#b91c1c] transition-all" 
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