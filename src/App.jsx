import styles from "./App.module.css";
import LogIn from "./components/Login/LogIn";
import Main from "./components/Main/Main";
import Register from "./components/register";
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";

const router = createBrowserRouter([
	{
		path: '/',
		element: <Main/>
	},
	{
		path: '/login',
		element: <LogIn/>
	},
	{
		path: '/register',
		element: <Register/>
	}
]);

function App() {

    if (process.env.NODE_ENV === 'development') console.log("Running on development!");
	
	return (
		<div className={styles.container}>
			<RouterProvider router={router}/>
		</div>
	);
}

export default function AppWrapper() {
	return (
		<AuthProvider>
			<App/>
		</AuthProvider>
	);
}
