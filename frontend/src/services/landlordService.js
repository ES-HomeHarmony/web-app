import axios from "axios";

const API_URL = "http://localhost:8000";

// Função para criar uma nova casa para o landlord
export async function createHouse(houseData) {
  try {
    const response = await axios.post(`${API_URL}/houses/create`, houseData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Para incluir cookies de autenticação, se necessário
    });
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao criar a casa:", error);
    throw error;
  }
}

// Função para buscar todas as casas associadas a um landlord específico
export async function fetchHousesByLandlord() {
  try {
    const response = await axios.get(`${API_URL}/houses/landlord`, {
      withCredentials: true, // Inclui cookies de autenticação
    });
    return response.data; // Retorna os dados em JSON
  } catch (error) {
    console.error("Erro ao buscar casas:", error);
    throw error;
  }
}

// Função para buscar a casa associada a um tenant específico
export async function getHouseById(house_id) {
  try {
    const response = await axios.get(`${API_URL}/houses/landlord/house/${house_id}`, {
      withCredentials: true, // Inclui cookies de autenticação
    });
    return response.data; // Retorna os dados em JSON
  } catch (error) {
    console.error("Erro ao buscar casa(s):", error);
    throw error;
  }
}

// Função para buscar as issues associadas a um landlord específico
export async function fetchIssuesByLandlord(landlordId) {
  try {
    const response = await axios.get(`${API_URL}/tenants/landlords/${landlordId}/issues`, {
      withCredentials: true, // Inclui cookies de autenticação
    });
    return response.data; // Retorna os dados em JSON
  } catch (error) {
    console.error("Erro ao buscar issues:", error);
    throw error;
  }
}

// Função para editar o status de uma issue
export async function editIssueStatus(issueData) {
  try {
    const response = await axios.put(`${API_URL}/tenants/updateIssue`, issueData, {
      withCredentials: true, // Inclui cookies de autenticação
    });
    return response.data; // Retorna os dados em JSON
  } catch (error) {
    console.error("Erro ao editar o status da issue:", error);
    throw error;
  }
}

export default {
  createHouse,
  fetchHousesByLandlord,
  getHouseById,
  fetchIssuesByLandlord,
  editIssueStatus,
};
