import { useEffect, useState } from "react";
import "./styles/index.scss";
import axios from "axios";
function App() {
	const [data, setData] = useState<any[]>([]);
	useEffect(() => {
		axios.post("https://jsonplaceholder.typicode.com/posts", { title: "1" }).then((resp) => {
			// setData(resp.data);
		});
	}, []);
	return (
		<ul>
			{/* {data.map((item, index) => {
				return <li key={index}>{item.title}</li>;
			})} */}
		</ul>
	);
}

export default App;
