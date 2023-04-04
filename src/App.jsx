import styles from "./App.module.css";
import LogIn from "./components/Login/LogIn";
import Main from "./components/Main/Main";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";

function App() {

    if (process.env.NODE_ENV === 'development') console.log("Running on development!");

    return  <Router basename="/">
                <div className={styles.container}>
                    <Switch>
                        <Route path="/login">
                            <LogIn/>
                        </Route>
                        <Route path="/">
                            <Main/>
                        </Route>
                    </Switch>
                </div>
            </Router>
}

export default function AppWrapper() {
	return (
		<AuthProvider>
			<App/>
		</AuthProvider>
	);
}
