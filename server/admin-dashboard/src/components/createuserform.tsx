import { useState } from "react";
import { Visibility } from "./visibility.svg";
import { VisibilityOff } from "./visibility_off.svg";
import { Close } from "./close.svg";

interface CreateUserFormProps {
  onSubmit: (email: string, password: string) => void;
  onClose: () => void;
  onError: (error: string) => void;
}


export function CreateUserForm({ onSubmit, onClose, onError }: CreateUserFormProps) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hide, setHide] = useState(true);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // check email and password
    let regex_number = /[0-9]/;
    let regex_letter = /[a-zA-Z]/;
    
    if (regex_number.test(password) === false || regex_letter.test(password) === false) {
      onError('密码必须是8位以上的数字和字母组合');
      return;
    }

    onSubmit(email, password);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg rounded-xl shadow-md
    shadow-gray-300 bg-slate-50 px-10 py-5">
      <button type="button" onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full 
      hover:bg-slate-200 hover:fill-white">
        <Close />
      </button>
      <div className="w-full flex py-10">
        <h2 className="m-auto font-sans text-2xl">创建用户</h2>
      </div>
      <div className="flex flex-col gap-8 mb-5">
        <div className="w-full flex flex-col gap-3">
          <label className="pl-2" htmlFor="account">邮箱</label>
          <input className="w-full bg-gray-100 pl-5 h-14 rounded-md border border-slate-300
            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 
            invalid:border-red-500 focus:invalid:border-red-500  focus:invalid:ring-red-500"
            type="email" value={email} onChange={(event) => setEmail(event.target.value)}
            placeholder="邮箱" id="account" required />
        </div>
        <div className="w-full flex flex-col gap-3">
          <label className="pl-2" htmlFor="password">密码</label>
          <div className="flex items-center">
            <input className="w-full bg-gray-100 pl-5 h-14 rounded-md border border-slate-300
            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 
            invalid:border-red-500 focus:invalid:border-red-500  focus:invalid:ring-red-500"
              type={hide ? "password" : "text"} value={password} onChange={(event) => setPassword(event.target.value)}
              placeholder="密码" id="password" required minLength={8} />
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
           shadow-gray-300 hover:bg-sky-600 text-white" type="submit">新建用户</button>
      </div>
    </form>
  );
}