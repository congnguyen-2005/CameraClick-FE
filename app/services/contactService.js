import axios from "axios";

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cameraclick-be-production.up.railway.app/api";

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