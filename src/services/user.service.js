const userRepository = require("../repositories/user.repository");
const { ROLES } = require("../constants");

class UserService {
  async getAll() {
    return await userRepository.getAll();
  }

  async getById(id) {
    const user = await userRepository.getById(id);
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  }

  async create(data) {
    if (!data.name || !data.email || !data.password) {
      throw new Error("Faltan campos obligatorios: name, email, password");
    }
    const existingUser = await userRepository.getByEmail(data.email);
    if (existingUser) throw new Error("El email ya está registrado");
    if (!data.role) data.role = ROLES.USER;
    return await userRepository.create(data);
  }

  async update(id, data) {
    const user = await userRepository.getById(id);
    if (!user) throw new Error("Usuario no encontrado");
    return await userRepository.update(id, data);
  }

  async delete(id) {
    const user = await userRepository.getById(id);
    if (!user) throw new Error("Usuario no encontrado");
    return await userRepository.delete(id);
  }
}

module.exports = new UserService();