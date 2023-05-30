import { Link, useRouteError } from 'react-router-dom';
import { Button, Result } from 'antd';


export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Result
      status="404"
      title="404"
      subTitle={
        <>
          <h1>Oops!</h1>
          <p>Sorry, an unexpected error has occurred.</p>
          <p>
            <i>{error.statusText || error.message}</i>
          </p>
        </>
      }
      extra={<Button type="secondary"><Link to="/algo-frontend-service/">Back Home</Link></Button>}
    />
  );
}