import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { JWT } from "../../features/jwt/jwt";
import { authSlice } from "../../features/auth/authSlice";
import { ApiClientContext } from "../..";
import { AxiosError } from "axios";
import { Refresh } from "../../components/refresh.svg";
import { CreateUserForm } from "../../components/createuserform";

export function Users() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const [users, setUsers] = useState([]);
  const [errorMessages, setErrorMessages] = useState('');
  const [isfetching, setIsfetching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // 防止多次点击
  const [oncreate, setOncreate] = useState(false);
  const [ondelete, setOndelete] = useState(false);

  const apiClient = useContext(ApiClientContext);

  const fetchUsers = async () => {
    if (isfetching) {
      return;
    }
    setIsfetching(true);
    try {
      let response = await apiClient.get('accounts');
      console.log(response.data?.users);
      setUsers(response.data?.users);
      setIsfetching(false);
    } catch (error) {
      if ((error as AxiosError).response) {
        let data = (error as AxiosError).response?.data as { error: string };
        setErrorMessages(data.error);
      } else {
        setErrorMessages('网络错误');
      }
      setIsfetching(false);
    }
    setTimeout(() => {
      setErrorMessages('');
    }, 2000);
  };

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(authSlice.actions.logout());
    navigate('/signin');
  }


  useEffect(() => {
    console.log('ondelete updated', ondelete)
  }, [ondelete]);

  const handleDeleteUser = (id: string) => {
    console.log('delete user check before', id);
    if (ondelete) {
      return;
    }
    setOndelete(true);
    console.log('delete user check after', id);
    apiClient.delete(`account/delete/${id}`).then((response) => {
      fetchUsers();
      setOndelete(false);
    }).catch((error) => {
      if ((error as AxiosError).response) {
        let data = (error as AxiosError).response?.data as { error: string };
        setErrorMessages(data.error);
      } else {
        setErrorMessages('网络错误');
      }
      setOndelete(false);
    });
    setTimeout(() => {
      setErrorMessages('');
    }, 2000);
  }

  const CloseModal = () => {
    setShowModal(false);
  };

  const createAccount = (email: string, password: string) => {
    if (oncreate) {
      return;
    }
    setOncreate(true);
    apiClient.post('account/create', {
      email: email,
      password: password
    }).then((response) => {
      console.log(response);
      CloseModal();
      fetchUsers();
      setOncreate(false);
    }).catch((error) => {
      if ((error as AxiosError).response) {
        let data = (error as AxiosError).response?.data as { error: string };
        setErrorMessages(data.error);
      } else {
        setErrorMessages('网络错误');
      }
      setOncreate(false);
    });
    setTimeout(() => {
      setErrorMessages('');
    }, 2000);
  }

  const showErrorMessage = (message: string) => {
    setErrorMessages(message);
    setTimeout(() => {
      setErrorMessages('');
    }, 3000);
  }

  useEffect(() => {
    if (token === null) {
      navigate('/signin');
    } else if (JWT.getTokenExpiration(token)) {
      // 自动退出
      dispatch(authSlice.actions.logout())
      navigate('/signin');
    }
    document.title = '用户管理';
  }, [token, navigate, dispatch]);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="h-screen w-full ">
      <header className="flex fixed top-0 justify-between items-center w-full h-16 border rounded-sm shadow-md shadow-slate-200">
        <div></div>
        <button onClick={handleLogout} className="w-20 h-9 mr-4 bg-sky-500/80
         hover:bg-sky-600/80 rounded-md text-white">退出</button>
      </header>

      {showModal && (
        <div className="z-10 fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex
           items-center justify-center ">
          <CreateUserForm onClose={CloseModal} onSubmit={createAccount} onError={showErrorMessage} />
        </div>
      )}

      <div className="w-full h-full flex justify-center box-border pt-12">

        {errorMessages && (
          <div className="z-10 absolute top-24 rounded-md bg-red-100 text-red-500 text-center p-2
           animate-bounce">
            {errorMessages}
          </div>
        )}
        {isfetching && (
          <div className="z-10 absolute top-24 rounded-full bg-sky-100 fill-sky-500 text-center p-2 
          animate-spin">
            <Refresh />
          </div>
        )}

        <div className="w-full h-full flex flex-col justify-center box-border px-40">
          <div className="w-full flex justify-between">
            <div></div>
            <div className="flex gap-5 pr-8 pb-4">
              <button onClick={fetchUsers} className="w-20 h-9 mr-4 bg-sky-500/80
               hover:bg-sky-600/80 rounded-md text-white">刷新</button>
              <button onClick={(event) => setShowModal(true)} className="w-20 h-9 mr-4 bg-sky-500/80
               hover:bg-sky-600/80 rounded-md text-white">创建用户</button>
            </div>
          </div>
          <div className="h-2/3 w-full overflow-auto">
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <thead>
                <tr className="bg-gray-100 sticky top-0">
                  <th className="border border-gray-300 px-2 py-1">ID</th>
                  <th className="border border-gray-300 px-2 py-1">用户名</th>
                  <th className="border border-gray-300 px-2 py-1">邮箱</th>
                  <th className="border border-gray-300 px-2 py-1">头像</th>
                  <th className="border border-gray-300 px-2 py-1">是否激活</th>
                  <th className="border border-gray-300 px-2 py-1">创建时间</th>
                  <th className="border border-gray-300 px-2 py-1">删除用户</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-200">
                    <td className="border border-gray-300 px-2 py-1">{user.id}</td>
                    <td className="border border-gray-300 px-2 py-1">{user.username}</td>
                    <td className="border border-gray-300 px-2 py-1">{user.email}</td>
                    <td className="border border-gray-300 px-2 py-1">
                      <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">{user.activate ? '已激活' : '未激活'}</td>
                    <td className="border border-gray-300 px-2 py-1">{user.createdAt}</td>
                    <td className="border border-gray-300 px-2 py-1">
                      <button onClick={(event) => handleDeleteUser(user.id)} className="w-20 h-9 mr-4 bg-red-500/80
           hover:bg-red-600/80 rounded-md text-white">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}