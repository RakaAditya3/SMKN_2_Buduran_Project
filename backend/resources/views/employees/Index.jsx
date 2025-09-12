import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import EmployeeTable from "./Table";
import EmployeeForm from "./Form";

const EmployeesIndex = () => {
    const [employees, setEmployees] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const fetchEmployees = async () => {
        try {
            const response = await fetch("/api/admin/employees");
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleAddClick = () => {
        setSelectedEmployee(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    const handleFormSuccess = () => {
        setIsModalOpen(false);
        fetchEmployees(); // Refresh data setelah berhasil
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            try {
                await fetch(`/api/admin/employees/${id}`, { method: "DELETE" });
                fetchEmployees(); // Refresh tabel setelah hapus
            } catch (error) {
                console.error("Failed to delete employee:", error);
            }
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manajemen Karyawan</h1>
                <button
                    onClick={handleAddClick}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                    Tambah Karyawan
                </button>
            </div>

            <EmployeeTable
                employees={employees}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <EmployeeForm
                    employee={selectedEmployee}
                    onSuccess={handleFormSuccess}
                />
            </Modal>
        </div>
    );
};

export default EmployeesIndex;
