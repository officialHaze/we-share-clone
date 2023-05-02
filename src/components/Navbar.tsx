import "../component-styles/Navbar.css";

export default function Navbar() {
	return (
		<div className="navbar">
			<ul className="list-container">
				<div>
					<li>
						<a
							href="/"
							style={{ color: "black" }}>
							Home
						</a>
					</li>
				</div>
				<div>
					<li>About</li>
				</div>
				<div>
					<li>
						<a
							href="mailto:moinak.dey8@gmail.com"
							style={{ color: "black" }}>
							Contact
						</a>
					</li>
				</div>
			</ul>
		</div>
	);
}
