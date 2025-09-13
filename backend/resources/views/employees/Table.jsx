const EmployeeTable = ({ employees, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Nama</th>
                        <th className="py-3 px-6 text-left">Divisi</th>
                        <th className="py-3 px-6 text-left">Posisi</th>
                        <th className="py-3 px-6 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {employees.length > 0 ? (
                        employees.map((employee) => (
                            <tr
                                key={employee.id}
                                className="border-b border-gray-200 hover:bg-gray-50"
                            >
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    {employee.name}
                                </td>
                                <td className="py-3 px-6 text-left">
                                    {employee.division}
                                </td>
                                <td className="py-3 px-6 text-left">
                                    {employee.position}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center space-x-2">
                                        <button
                                            onClick={() => onEdit(employee)}
                                            className="text-blue-600 hover:text-blue-900 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                onDelete(employee.id)
                                            }
                                            className="text-red-600 hover:text-red-900 transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="4"
                                className="py-4 text-center text-gray-500"
                            >
                                Tidak ada data karyawan.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeTable;
