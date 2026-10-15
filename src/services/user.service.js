const userRepository = require("../repositories/user.repository");
const { ROLES } = require("../constants");
const ErrorDictionary = require("../errors/errorDictionary");

class UserService {
  async getAll() {
    return await userRepository.getAll();
  }

  async getById(id) {
    const user = await userRepository.getById(id);
    if (!user) throw ErrorDictionary.USER_NOT_FOUND();
    return user;
  }

  async create(data) {
    if (!data.name || !data.email || !data.password) {
      throw ErrorDictionary.USER_MISSING_FIELDS();
    }
    const existingUser = await userRepository.getByEmail(data.email);
    if (existingUser) throw ErrorDictionary.USER_ALREADY_EXISTS();
    if (!data.role) data.role = ROLES.USER;
    return await userRepository.create(data);
  }

  async update(id, data) {
    const user = await userRepository.getById(id);
    if (!user) throw ErrorDictionary.USER_NOT_FOUND();
    return await userRepository.update(id, data);
  }

  async delete(id) {
    const user = await userRepository.getById(id);
    if (!user) throw ErrorDictionary.USER_NOT_FOUND();
    return await userRepository.delete(id);
  }
}

module.exports = new UserService();