import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [pending, setPending] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    fetch("/api/admin/pending").then(r => r.json()).then(setPending).catch(()=>{});
    fetch("/api/admin/users").then(r => r.json()).then(setUsers).catch(()=>{});
    fetch("/api/admin/stats").then(r => r.json()).then(setStats).catch(()=>{});
  }, []);

  function approve(id: string) {
    fetch(`/api/admin/approve/${id}`, { method: "POST" })
      .then(() => setPending((p)=>p.filter((x)=>x.id !== id)))
      .catch(()=>alert("Error approving"));
  }

  function removeUser(id: string) {
    fetch(`/api/admin/users/${id}`, { method: "DELETE" })
      .then(()=> setUsers((u)=>u.filter(x=>x._id !== id)))
      .catch(()=>alert("Error"));
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total users</div>
          <div className="text-2xl font-bold">{stats.totalUsers ?? 0}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total cars</div>
          <div className="text-2xl font-bold">{stats.totalCars ?? 0}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Revenue</div>
          <div className="text-2xl font-bold">₹{Number(stats.revenue || 0).toLocaleString()}</div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Pending Listings</h2>
        <div className="space-y-3">
          {pending.length === 0 ? <div className="text-gray-500">No pending items</div> : pending.map(item => (
            <div key={item.id} className="bg-white p-3 rounded shadow flex items-center gap-3">
              <img src={item.image} className="w-24 h-16 object-cover rounded" alt=""/>
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-500">{item.sellerName}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>approve(item.id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                <button onClick={()=>fetch(`/api/admin/reject/${item.id}`,{method:"POST"}).then(()=>setPending(p=>p.filter(x=>x.id!== item.id)))} className="px-3 py-1 bg-red-500 text-white rounded">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Users</h2>
        <div className="bg-white p-3 rounded shadow">
          <table className="w-full text-left">
            <thead>
              <tr><th>Name</th><th>Email</th><th></th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td><button onClick={()=>removeUser(u._id)} className="text-red-500">Remove</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
