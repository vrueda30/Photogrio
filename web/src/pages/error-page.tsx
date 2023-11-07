import {useRouteError} from "react-router-dom";
import {Container} from "reactstrap";
import {errorMessages}  from '../utils/ErrorMessages.tsx'

export const ErrorPage = () => {
    const error = useRouteError();


    return (
        <div id="error-page">
            <Container className="page-error">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{errorMessages(error)}</i>
            </p>
            </Container>
        </div>
    );
}

export default ErrorPage;