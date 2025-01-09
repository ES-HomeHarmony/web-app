import axios from "axios";

const API_URL_USERS = "http://localhost:8001";
const API_URL = "http://localhost:8000";

export const fetchUserRole = async () => {
  try {
    const response = await axios.get(`${API_URL_USERS}/user/profile`, {
      withCredentials: true,
    });
    console.log("User role:", response.data.role);
    return response.data.role; // Assuming backend returns { role: "tenant" }
  } catch (error) {
    console.error("Error fetching user role:", error);
    throw error;
  }
};

export const fetchTenantId = async () => {
  try {
    const response = await axios.get(`${API_URL}/tenants/tenantId`, {
      withCredentials: true,
    });
    console.log("Tenant ID:", response.data.id);
    return response.data.id;
  } catch (error) {
    console.error("Error fetching tenant ID:", error);
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

export async function fetchContract() {
  try {
    const response = await axios.get(`${API_URL}/tenants/downloadContract`, {
      withCredentials: true,
      responseType: "arraybuffer", // Ensure the response type is binary data
    });

    // Create a Blob from the arraybuffer response
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));

    // Open the URL in a new browser tab
    window.open(url, "_blank");
  } catch (error) {
    console.error("Error fetching contract:", error);
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
  fetchContract,
  fetchTenantId,
};
