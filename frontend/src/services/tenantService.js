import axios from "axios";

const API_URL_USERS = "http://userservice-alb-883434472.eu-north-1.elb.amazonaws.com/userservice";
const API_URL = "http://housemanagement-alb-2122003581.eu-north-1.elb.amazonaws.com";

export const fetchUserRole = async () => {
  try {
    // const response = await axios.get(`${API_URL_USERS}/user/profile`, {
    //   withCredentials: true, // Inclui cookies de autenticação
    // });

    const response = await axios.get(
      "https://corsproxy.io/?https://webhook.site/93246c42-8baa-487f-b78a-30da12995e38",
      {
        withCredentials: true, // Inclui cookies de autenticação
        headers: new Headers({
          "Access-Control-Allow-Origin":
            "https://alb-frontend-249540307.eu-north-1.elb.amazonaws.com",
        }),
      }
    );

    console.log("User role:", response.data.role);
    return response.data.role; // Assuming backend returns { role: "tenant" }
  } catch (error) {
    console.error("Error fetching user role:", error);
    throw error;
  }
};

//Função para buscar a casa associada a um tenant específico
export async function fetchHousesByTenant() {
  try {
    const response = await axios.get(`${API_URL}/tenants/houses`, {
      withCredentials: true, // Inclui cookies de autenticação
    });
    return response.data; // Retorna os dados em JSON
  } catch (error) {
    console.error("Error fetching house(s):", error);
    throw error;
  }
}

export async function fetchIssuesbyHouse(houseId) {
  try {
    const response = await axios.get(`${API_URL}/tenants/houses/${houseId}/issues`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  }
}

export async function createIssue(issueData) {
  try {
    await axios.post(`${API_URL}/tenants/createIssue`, issueData, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
}

export async function updateIssue(issueData) {
  try {
    await axios.put(`${API_URL}/tenants/updateIssue`, issueData, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error updating issue:", error);
    throw error;
  }
}

export async function deleteIssue(issueId) {
  try {
    await axios.delete(`${API_URL}/tenants/issues/${issueId}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error deleting issue:", error);
    throw error;
  }
}

export default {
  fetchUserRole,
  fetchHousesByTenant,
  fetchIssuesbyHouse,
  createIssue,
  updateIssue,
  deleteIssue,
};
