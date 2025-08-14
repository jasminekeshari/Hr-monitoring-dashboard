// src/components/AdvancedFiltersDialog.jsx
import React, { useState } from "react";

const AdvancedFiltersDialog = ({ onApply, onClose }) => {
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    employee: "",
    department: ""
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Advanced Filters</h2>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Date From</label>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Date To</label>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Employee</label>
          <input
            type="text"
            name="employee"
            placeholder="Employee name"
            value={filters.employee}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Department</label>
          <input
            type="text"
            name="department"
            placeholder="Department name"
            value={filters.department}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFiltersDialog;
