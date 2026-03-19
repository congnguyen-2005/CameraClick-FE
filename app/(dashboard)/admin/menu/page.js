"use client";

import React, { useEffect, useState } from "react";
import menuService from "../../../services/menuService";


export default function MenusPage() {
  const [menus, setMenus] = useState([]);

 useEffect(() => {
  menuService.getAll()
    .then((res) => {
      const list = res?.data?.data || res?.data || [];
      setMenus(Array.isArray(list) ? list : []);
    })
    .catch((err) => {
      console.error("Lỗi load menu:", err);
      setMenus([]);
    });
}, []);


  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Quản lý Menus</h1>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Link</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Parent</th>
            <th className="border p-2">Sort</th>
            <th className="border p-2">Position</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.id}</td>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.link}</td>
              <td className="border p-2">{item.type}</td>
              <td className="border p-2">{item.parent_id}</td>
              <td className="border p-2">{item.sort_order}</td>
              <td className="border p-2">{item.position}</td>
              <td className="border p-2">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
