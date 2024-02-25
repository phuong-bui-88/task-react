import React, { useState, useEffect } from 'react';

import UserService from "../../services/UserService.js";

const UserListComponent = () => {
    const [users, setUsers] = useState();
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchUsers = async () => {
        const response = await UserService.getUsers(currentPage);
        setUsers(response.data);
        setTotalPages(response.meta.last_page);
    }

    useEffect(() => {
        fetchUsers();
    }, [currentPage])

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const renderPagination = (totalPages) => {
        let content = [];

        for (let i = 0; i < totalPages; i++) {
            content.push(
                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                        {i + 1}
                    </button>
                </li>
            );
        }

        return content;
    }

    return (
        <div className="mx-4 table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        <th>Register Time</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Website</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users && users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.created_at}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.website}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <nav>
                <ul className="pagination">
                    {renderPagination(totalPages)}
                </ul>
            </nav>
        </div>
    );
}

export default UserListComponent;
