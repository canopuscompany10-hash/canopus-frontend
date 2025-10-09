import { useState } from "react";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";

function PaymentPopup({ isOpen, onClose, staff, onUpdate }) {
  const [amountPaid, setAmountPaid] = useState(staff.amountPaid || 0);
  const [paymentStatus, setPaymentStatus] = useState(staff.paymentStatus || "pending");
  const [violations, setViolations] = useState(staff.violations || []);

  if (!isOpen) return null;

  const handleAddViolation = () => {
    setViolations([...violations, { reason: "", penalty: 0 }]);
  };

  const handleViolationChange = (index, field, value) => {
    const updated = [...violations];
    updated[index][field] = field === "penalty" ? parseFloat(value) : value;
    setViolations(updated);
  };

  const handleRemoveViolation = (index) => {
    const updated = [...violations];
    updated.splice(index, 1);
    setViolations(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      amountPaid: parseFloat(amountPaid),
      paymentStatus,
      violations,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Update Payment for {staff.user.name}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount Paid</label>
            <input
              type="number"
              min={0}
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Violations</label>
            {violations.map((v, i) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  placeholder="Reason"
                  value={v.reason}
                  onChange={(e) => handleViolationChange(i, "reason", e.target.value)}
                  className="flex-1 border p-1 rounded"
                />
                <input
                  type="number"
                  placeholder="Penalty"
                  min={0}
                  value={v.penalty}
                  onChange={(e) => handleViolationChange(i, "penalty", e.target.value)}
                  className="w-20 border p-1 rounded"
                />
                <button type="button" onClick={() => handleRemoveViolation(i)} className="text-red-500">
                  <FaTrash />
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddViolation} className="flex items-center gap-1 text-blue-600">
              <FaPlus /> Add Violation
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaymentPopup;
