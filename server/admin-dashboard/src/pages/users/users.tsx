import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { JWT } from "../../features/jwt/jwt";
import { authSlice } from "../../features/auth/authSlice";
import { ListTable, ListColumn, VTable } from "@visactor/react-vtable";
import { ApiClientContext } from "../..";
import { AxiosError } from "axios";
import { Refresh } from "../../components/refresh.svg";
import { CreateUserForm } from "../../components/createuserform";

export function Users() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef = useRef<any>(null);
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
    }
    setTimeout(() => {
      setErrorMessages('');
    }, 2000);
    setIsfetching(false);
  };

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(authSlice.actions.logout());
    navigate('/signin');
  }

  const handleDeleteUser = (id: string) => {
    if (ondelete) {
      return;
    }
    setOndelete(true);
    console.log('delete user:', id);
    apiClient.delete(`account/delete/${id}`).then((response) => {
      console.log(response);
      fetchUsers();
    }).catch((error) => {
      if ((error as AxiosError).response) {
        let data = (error as AxiosError).response?.data as { error: string };
        setErrorMessages(data.error);
      } else {
        setErrorMessages('网络错误');
      }
    });
    setTimeout(() => {
      setErrorMessages('');
    }, 2000);
    setOndelete(false);
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
    }).catch((error) => {
      if ((error as AxiosError).response) {
        let data = (error as AxiosError).response?.data as { error: string };
        setErrorMessages(data.error);
      } else {
        setErrorMessages('网络错误');
      }
    });
    setTimeout(() => {
      setErrorMessages('');
    }, 2000);
    setOncreate(false);
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
          <div className="h-2/3">
            <ListTable className=" z-0" ref={tableRef} records={users} theme={VTable.themes.BRIGHT} defaultRowHeight={60}
              onClickCell={
                (params) => {
                  const { col, row, targetIcon } = params;
                  if (targetIcon) {
                    if (targetIcon.name === 'delete') {
                      if (tableRef.current) {
                        let userId = tableRef.current.getCellValue(0, row);
                        handleDeleteUser(userId);
                      }

                    }
                  }
                }
              }>
              <ListColumn field={'id'} title={'ID'} width={250} sort />
              <ListColumn field={'username'} title={'用户名'} width={100} sort />
              <ListColumn field={'email'} title={'邮箱'} width={220} sort />
              <ListColumn field={'avatar'} title={'头像'} width={100} cellType={'image'} />
              <ListColumn field={'activate'} title={'是否激活'} width={130} sort />
              <ListColumn field={'createdAt'} title={'创建时间'} width={220} sort />
              <ListColumn field={'delete'} title={'删除用户'} width={100} disableSelect
                icon={VTable.register.icon(
                  'delete',
                  {
                    name: 'delete',
                    type: 'svg',
                    svg: "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/delete.svg",
                    // svg: "../../svg/delete.svg",
                    width: 24,
                    height: 24,
                    cursor: 'pointer',
                    positionType: VTable.TYPES.IconPosition.right,
                    tooltip: {
                      style: { arrowMark: true },
                      title: '删除用户',
                      placement: VTable.TYPES.Placement.left
                    },
                  },
                )}
              />
            </ListTable>
          </div>
        </div>
      </div>
    </div>
  );
}