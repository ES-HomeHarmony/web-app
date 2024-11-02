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

export default {
  createHouse,
  fetchHousesByLandlord,
};
