import { BrowserRouter, Routes, Route } from "react-router-dom";
import keepConnectionAlive from "./lib/keepConnectionAlive";
import Home from "./pages/Home";
import About from "./pages/About";
import PageNotFound from "./pages/404";
import Download from "./pages/Download";

export default function App() {
	keepConnectionAlive();
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={<Home />}
					/>
					<Route
						path="/download/:filename/:filedesc/:id"
						element={<Download />}
					/>
					<Route
						path="/about"
						element={<About />}
					/>
					<Route
						path="/404"
						element={<PageNotFound />}
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
}
