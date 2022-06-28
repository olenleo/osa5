import axios from 'axios';
const baseUrl = '/api/users';

const getUser = async (username) => {
    const response = await axios.get(`${baseUrl}/${username}`);
    return response.data;
};
const exportedObject = { getUser }
export default exportedObject
