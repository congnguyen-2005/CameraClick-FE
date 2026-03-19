
import http from "./http";


const TopicService = {

    getAll: () => {
        return http.get('topic');
    },

    getById: (id) => {
        return http.get(`topic/${id}`);
    },

    create: (data) => {
        return http.post('topic', data);
    },

    update: (id, data) => {
        return http.put(`topic/${id}`, data);
    },

    delete: (id) => {
        return http.delete(`topic/${id}`);
    }
};

export default TopicService;
