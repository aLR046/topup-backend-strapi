module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Jangan override jika sudah ada
    if (data.order_code) return;

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    const dateStr = `${yyyy}${mm}${dd}`;

    const start = new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`);
    const end = new Date(`${yyyy}-${mm}-${dd}T23:59:59.999Z`);

    const count = await strapi.db.query('api::order.order').count({
      where: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    });

    const sequence = String(count + 1).padStart(4, '0');

    data.order_code = `ORD-${dateStr}-${sequence}`;
  },
};
