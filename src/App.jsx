import styles from "./App.module.css";
import LogIn from "./components/Login/LogIn";
import Main from "./components/Main/Main";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

export default function App() {

    return  <Router basename="/lnk">
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