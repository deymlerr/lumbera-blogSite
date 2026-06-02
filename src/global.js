import { defineStore } from "pinia";
import { reactive } from "vue";
import api from "./api";

export const useGlobalStore = defineStore("global", () => {
	let user = reactive({
		token: localStorage.getItem("token"),
		id: null,
		email: null,
		isAdmin: false,
	});

	async function getUserDetails(token) {
		const activeToken = token === undefined ? localStorage.getItem("token") : token;

		if (!activeToken) {
			user.token = null;
			user.id = null;
			user.email = null;
			user.isAdmin = false;
			localStorage.removeItem("token");
			return;
		}

		localStorage.setItem("token", activeToken);
		user.token = activeToken;

		try {
			let { data } = await api.get("/users/details");

			const serverUser = data.user || {};
			Object.assign(user, {
				token: activeToken,
				id: serverUser.id || serverUser._id || null,
				email: serverUser.email || null,
				isAdmin: serverUser.isAdmin || false,
			});
			localStorage.setItem("user", JSON.stringify(serverUser));
		} catch (error) {
			user.token = null;
			user.id = null;
			user.email = null;
			user.isAdmin = false;
			localStorage.removeItem("token");
		}
	}

	return {
		user,
		getUserDetails,
	};
});
