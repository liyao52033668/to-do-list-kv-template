import { redirect } from "@remix-run/react";
import { nanoid } from "nanoid";

export const loader = () => {
	const id = nanoid();
	return redirect(`/${id}`);
};

export default function Index() {
	return <div>'此处内容不会显示'</div>;
}
