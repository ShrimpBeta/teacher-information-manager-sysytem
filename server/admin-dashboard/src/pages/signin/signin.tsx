import { useContext, useEffect, useState } from "react";
import { Visibility } from "../../components/visibility.svg";
import { VisibilityOff } from "../../components/visibility_off.svg";
import { ApiClientContext } from "../..";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { authSlice } from "../../features/auth/authSlice";
import { useNavigate } from "react-router";

export function SignIn() {

  const [hide, setHide] = useState(false);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState('');

  const [onsignin, setOnsignin] = useState(false);

  const apiClient = useContext(ApiClientContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // console.log(account, password);
    if (onsignin) {
      return;
    }
    setOnsignin(true);
    try {
      let response = await apiClient.post('admin/signin', { account: account, password: password });
      let data = response.data as { token: string };
      dispatch(authSlice.actions.login(data.token));
      setOnsignin(false);
      navigate('/users');
    } catch (error) {
      if ((error as AxiosError).response) {
        // console.log((error as AxiosError).response?.data);
        let data = (error as AxiosError).response?.data as { error: string };
        setErrorMessages(data.error);
      } else {
        setErrorMessages('网络错误');
      }
      setOnsignin(false);
    }
    setTimeout(() => {
      setErrorMessages('');
    }, 2000);
  }

  useEffect(() => {
    document.title = '管理员登录';
  }, []);

  return (
    <div className="flex size-full h-screen m-0 justify-center items-center"
      style={{
        background: 'rgba(217, 227, 248,0.6)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {errorMessages && (
        <div className=" absolute top-10 rounded-md bg-red-100 text-red-500 text-center p-2 animate-bounce">
          {errorMessages}
        </div>
      )}
      <form onSubmit={handleLogin} className=" w-full max-w-lg rounded-xl shadow-md
       shadow-gray-300 bg-slate-50 px-10 py-5">
        <div className="w-full flex py-10">
          <h2 className="m-auto font-sans text-2xl">Sign In</h2>
        </div>
        <div className="flex flex-col gap-8 mb-5">
          <div className="w-full flex flex-col gap-3">
            <label className="pl-2" htmlFor="account">账号</label>
            <input className="w-full bg-gray-100 pl-5 h-14 rounded-md border border-slate-300
            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 
            invalid:border-red-500 focus:invalid:border-red-500  focus:invalid:ring-red-500"
              type="text" value={account} onChange={(event) => setAccount(event.target.value)}
              placeholder="账号" id="account" required />
          </div>
          <div className="w-full flex flex-col gap-3">
            <label className="pl-2" htmlFor="password">密码</label>
            <div className="flex items-center">
              <input className="w-full bg-gray-100 pl-5 h-14 rounded-md border border-slate-300
            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 
            invalid:border-red-500 focus:invalid:border-red-500  focus:invalid:ring-red-500"
                type={hide ? "password" : "text"} value={password} onChange={(event) => setPassword(event.target.value)}
                placeholder="密码" id="password" required />
              <button type="button" className=" -ml-12 hover:bg-gray-200 w-10 h-10 rounded-full flex 
            justify-center items-center" onClick={(event) => setHide(!hide)}>
                {hide ?
                  (
                    <Visibility />
                  ) : (
                    <VisibilityOff />
                  )}
              </button>
            </div>
          </div>
          <button className="mx-auto w-32 h-10 bg-sky-500 rounded-md shadow-md
           shadow-gray-300 hover:bg-sky-600 text-white" type="submit">登录</button>
        </div>
      </form>
    </div>
  );
}