import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearErrors, deleteUser, getAllUsers } from '../../actions/userAction';
import { DELETE_USER_RESET } from '../../constants/userConstants';
import MetaData from '../Layout/MetaData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, users } = useSelector(state => state.allUsers);

  const {
    error: deleteError,
    isDeleted,
    message
  } = useSelector(state => state.profile);

  const deleteUserHandler = id => {
    dispatch(deleteUser(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success(message);
      navigate('/admin/users');
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [dispatch, error, deleteError, navigate, isDeleted, message]);

  const columns = [
    { field: 'id', headerName: 'User ID', minWidth: 180, flex: 0.8 },
    { field: 'email', headerName: 'Email', minWidth: 200, flex: 1 },
    { field: 'name', headerName: 'Name', minWidth: 150, flex: 0.5 },
    {
      field: 'role',
      headerName: 'Role',
      type: 'number',
      minWidth: 150,
      flex: 0.3,
      cellClassName: params => {
        return params.getValue(params.id, 'role') === 'admin'
          ? 'text-green-500'
          : 'text-red-500';
      }
    },
    {
      field: 'actions',
      flex: 0.3,
      headerName: 'Actions',
      minWidth: 150,
      sortable: false,
      renderCell: params => {
        return (
          <Fragment>
            <div className='flex space-x-2'>
              <Link to={`/admin/user/${params.getValue(params.id, 'id')}`}>
                <FontAwesomeIcon
                  icon={faEdit}
                  className='text-blue-600 hover:text-blue-800 cursor-pointer'
                />
              </Link>
              <button
                onClick={() =>
                  deleteUserHandler(params.getValue(params.id, 'id'))
                }
                className='text-red-600 hover:text-red-800'
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </Fragment>
        );
      }
    }
  ];

  const rows = [];

  users &&
    users.forEach(item => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL USERS - Admin`} />
      <div className='p-4'>
        <h1 className='text-2xl font-bold mb-4'>ALL USERS</h1>
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white border border-gray-300'>
            <thead>
              <tr className='bg-gray-200'>
                {columns.map(col => (
                  <th key={col.field} className='py-2 px-4 border-b'>
                    {col.headerName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} className='hover:bg-gray-100'>
                  {columns.map(col => (
                    <td key={col.field} className='py-2 px-4 border-b'>
                      {col.field === 'actions'
                        ? col.renderCell({
                            getValue: (id, field) => row[field]
                          })
                        : row[col.field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};

export default UsersList;
