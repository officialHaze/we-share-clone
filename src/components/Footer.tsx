import "../component-styles/Footer.css";
import { FaLinkedinIn } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { BsGithub } from "react-icons/bs";
import { SiGmail } from "react-icons/si";

export default function Footer() {
	return (
		<div className="footer">
			<div className="footer-content-wrapper">
				<p>&copy; Copyright {new Date().getFullYear()}</p>
				<p>Made with ❤ by Moinak</p>

				<div className="socials">
					<h2>
						<a href="https://www.linkedin.com/in/moinak-dey-60b1a3266/">
							<FaLinkedinIn />
						</a>
					</h2>
					<h2>
						<a href="https://www.facebook.com/moinak.dey.16/">
							<FaFacebookF />
						</a>
					</h2>
					<h2>
						<a href="https://github.com/officialHaze">
							<BsGithub />
						</a>
					</h2>
					<h2>
						<a href="mailto: moinak.dey8@gmail.com">
							<SiGmail />
						</a>
					</h2>
				</div>
			</div>
		</div>
	);
}
