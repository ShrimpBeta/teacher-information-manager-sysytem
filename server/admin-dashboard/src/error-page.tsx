import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as any;
  console.error(error);

  return (
    <div id="error-page" className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4 text-lg">
        <h1 className=" text-2xl font-serif">Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
}