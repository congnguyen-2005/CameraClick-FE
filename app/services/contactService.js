import axios from "axios";

const API_URL = "http://localhost:8000/api";

const contactService = {
    sendContact: (data) => {
        return axios.post(`${API_URL}/contact`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
    },
};

export default contactService;