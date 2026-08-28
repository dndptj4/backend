const { prisma } = require("../lib/prisma");

const postRepository = {
  findAll() {
    return prisma.cards.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id) {
    return prisma.cards.findUnique({
      where: { id },
    });
  },

  create(data) {
    return prisma.cards.create({ data });
  },

  update(id, data) {
    return prisma.cards.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.cards.delete({
      where: { id },
    });
  },
};

module.exports = { postRepository };
